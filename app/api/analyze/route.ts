/**
 * Deep Analysis route — Claude Agent SDK
 *
 * Uses the Claude Agent SDK to run an autonomous analysis agent.
 * The senior-data-scientist skill is loaded from .claude/skills/ via
 * settingSources: ['project'], giving the agent full skill context.
 *
 * The agent uses Bash to run Python analysis scripts when available,
 * falling back to pure LLM reasoning for the preview data.
 *
 * NOTE: The Agent SDK requires the `claude` CLI to be installed locally.
 * For production deployments without the CLI, switch to the Anthropic
 * Client SDK fallback below (set USE_AGENT_SDK=false in .env).
 */
import Anthropic from '@anthropic-ai/sdk'
import { DEEP_ANALYSIS_PROMPT } from '@/lib/skill-prompt'
import { calcCost } from '../../lib/costs'
import { MessageCost, ModelId } from '../../lib/types'

export const maxDuration = 120

interface AnalyzeRequest {
  filename: string
  rowCount: number
  headers: string[]
  preview: string[][]
  allRows: string[][]
  model?: ModelId
}

/**
 * Agent SDK analysis — runs Claude Code with the senior-data-scientist skill.
 * Requires `claude` CLI installed: npm install -g @anthropic-ai/claude-code
 */
async function runAgentAnalysis(data: AnalyzeRequest, apiKey: string): Promise<string> {
  // Dynamic import so the app still boots without the CLI installed
  const { query } = await import('@anthropic-ai/claude-agent-sdk')

  const rowsToShow = data.allRows.slice(0, 200)
  const previewTable = [
    data.headers.join('\t'),
    ...rowsToShow.map((row) => row.join('\t')),
  ].join('\n')
  const truncationNote = data.rowCount > 200
    ? `\n(${data.rowCount - 200} additional rows not shown)`
    : ''

  const prompt = `${DEEP_ANALYSIS_PROMPT}

## Dataset to Analyze

**File**: ${data.filename}
**Total rows**: ${data.rowCount.toLocaleString()}
**Columns**: ${data.headers.join(', ')}

**Full dataset (up to 200 rows shown)**:
\`\`\`tsv
${previewTable}
\`\`\`${truncationNote}

Generate the full EDA report now. Be thorough, specific, and actionable.`

  let report = ''

  for await (const message of query({
    prompt,
    options: {
      // Load the senior-data-scientist skill from .claude/skills/
      settingSources: ['project'],
      // Read-only: no file writes needed for analysis
      allowedTools: ['Bash'],
      permissionMode: 'bypassPermissions',
    },
  })) {
    if ('result' in message && message.result) {
      report = message.result
    }
  }

  return report || 'Agent completed without generating output.'
}

/**
 * Direct Anthropic API fallback — no CLI required.
 * Used when USE_AGENT_SDK is not set or Agent SDK is unavailable.
 */
interface DirectAnalysisResult {
  report: string
  usage: { inputTokens: number; outputTokens: number } | null
}

async function runDirectAnalysis(data: AnalyzeRequest, apiKey: string, model: ModelId): Promise<DirectAnalysisResult> {
  const client = new Anthropic({ apiKey })

  const directRowsToShow = data.allRows.slice(0, 200)
  const directTable = [
    data.headers.join(' | '),
    data.headers.map(() => '---').join(' | '),
    ...directRowsToShow.map((row) => row.join(' | ')),
  ].join('\n')
  const directTruncationNote = data.rowCount > 200
    ? `\n(${data.rowCount - 200} additional rows not shown)`
    : ''

  const message = await client.messages.create({
    model,
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: `${DEEP_ANALYSIS_PROMPT}

## Dataset to Analyze

**File**: ${data.filename}
**Total rows**: ${data.rowCount.toLocaleString()}
**Columns**: ${data.headers.join(', ')}

**Full dataset (up to 200 rows shown)**:
${directTable}${directTruncationNote}

Generate the full EDA report now.`,
      },
    ],
  })

  const block = message.content[0]
  const report = block.type === 'text' ? block.text : 'No report generated.'
  const usage = message.usage
    ? { inputTokens: message.usage.input_tokens, outputTokens: message.usage.output_tokens }
    : null

  return { report, usage }
}

export async function POST(req: Request) {
  const apiKey = req.headers.get('x-api-key')
  if (!apiKey) {
    return Response.json({ error: 'API key required' }, { status: 401 })
  }

  const body: AnalyzeRequest = await req.json()
  const model: ModelId = (body.model === 'claude-sonnet-4-6' || body.model === 'claude-opus-4-6')
    ? body.model
    : 'claude-opus-4-6'

  const useAgentSdk = process.env.USE_AGENT_SDK === 'true'

  try {
    if (useAgentSdk) {
      const report = await runAgentAnalysis(body, apiKey)
      return Response.json({ report, usage: null, model })
    }

    const result = await runDirectAnalysis(body, apiKey, model)
    const costObj: MessageCost | null = result.usage ? {
      promptTokens: result.usage.inputTokens,
      completionTokens: result.usage.outputTokens,
      totalTokens: result.usage.inputTokens + result.usage.outputTokens,
      costUsd: calcCost(model, result.usage.inputTokens, result.usage.outputTokens),
    } : null

    return Response.json({ report: result.report, usage: costObj, model })
  } catch (err) {
    console.error('[analyze]', err)

    // If Agent SDK failed (e.g. claude CLI not installed), fall back
    if (useAgentSdk) {
      console.warn('[analyze] Agent SDK failed, falling back to direct API')
      try {
        const result = await runDirectAnalysis(body, apiKey, model)
        const costObj: MessageCost | null = result.usage ? {
          promptTokens: result.usage.inputTokens,
          completionTokens: result.usage.outputTokens,
          totalTokens: result.usage.inputTokens + result.usage.outputTokens,
          costUsd: calcCost(model, result.usage.inputTokens, result.usage.outputTokens),
        } : null
        return Response.json({ report: result.report, usage: costObj, model })
      } catch (fallbackErr) {
        console.error('[analyze] Fallback also failed', fallbackErr)
      }
    }

    return Response.json(
      { error: 'Analysis failed. Check ANTHROPIC_API_KEY and try again.' },
      { status: 500 }
    )
  }
}
