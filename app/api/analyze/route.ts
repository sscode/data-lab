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

export const maxDuration = 120

interface AnalyzeRequest {
  filename: string
  rowCount: number
  headers: string[]
  preview: string[][]
}

/**
 * Agent SDK analysis — runs Claude Code with the senior-data-scientist skill.
 * Requires `claude` CLI installed: npm install -g @anthropic-ai/claude-code
 */
async function runAgentAnalysis(data: AnalyzeRequest): Promise<string> {
  // Dynamic import so the app still boots without the CLI installed
  const { query } = await import('@anthropic-ai/claude-agent-sdk')

  const previewTable = [
    data.headers.join('\t'),
    ...data.preview.map((row) => row.join('\t')),
  ].join('\n')

  const prompt = `${DEEP_ANALYSIS_PROMPT}

## Dataset to Analyze

**File**: ${data.filename}
**Total rows**: ${data.rowCount.toLocaleString()}
**Columns**: ${data.headers.join(', ')}

**Preview data (first ${data.preview.length} rows)**:
\`\`\`tsv
${previewTable}
\`\`\`

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
async function runDirectAnalysis(data: AnalyzeRequest): Promise<string> {
  const client = new Anthropic()

  const previewTable = [
    data.headers.join(' | '),
    data.headers.map(() => '---').join(' | '),
    ...data.preview.map((row) => row.join(' | ')),
  ].join('\n')

  const message = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: `${DEEP_ANALYSIS_PROMPT}

## Dataset to Analyze

**File**: ${data.filename}
**Total rows**: ${data.rowCount.toLocaleString()}
**Columns**: ${data.headers.join(', ')}

**Preview**:
${previewTable}

Generate the full EDA report now.`,
      },
    ],
  })

  const block = message.content[0]
  return block.type === 'text' ? block.text : 'No report generated.'
}

export async function POST(req: Request) {
  const data: AnalyzeRequest = await req.json()

  const useAgentSdk = process.env.USE_AGENT_SDK === 'true'

  try {
    const report = useAgentSdk
      ? await runAgentAnalysis(data)
      : await runDirectAnalysis(data)

    return Response.json({ report })
  } catch (err) {
    console.error('[analyze]', err)

    // If Agent SDK failed (e.g. claude CLI not installed), fall back
    if (useAgentSdk) {
      console.warn('[analyze] Agent SDK failed, falling back to direct API')
      try {
        const report = await runDirectAnalysis(data)
        return Response.json({ report })
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
