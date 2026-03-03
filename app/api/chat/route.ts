/**
 * Chat route — Vercel AI SDK + Anthropic
 *
 * Uses AI SDK's streamText for streaming responses.
 * The senior-data-scientist skill is injected as a system prompt,
 * with the CSV dataset context appended per-request.
 */
import { streamText } from 'ai'
import { createAnthropic } from '@ai-sdk/anthropic'
import { SENIOR_DS_SYSTEM_PROMPT } from '@/lib/skill-prompt'
import { buildSentinel } from '../../lib/costs'
import type { ModelId } from '../../lib/types'

export const maxDuration = 60

interface CSVContext {
  filename: string
  rowCount: number
  headers: string[]
  preview: string[][]
  allRows: string[][]
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(req: Request) {
  const apiKey = req.headers.get('x-api-key')
  if (!apiKey) {
    return Response.json({ error: 'API key required' }, { status: 401 })
  }

  const { messages, csvContext, report, model: modelId }: { messages: Message[]; csvContext: CSVContext; report?: string | null; model?: ModelId } =
    await req.json()

  const model: ModelId = modelId ?? 'claude-sonnet-4-6'

  const rowsToShow = csvContext.allRows.slice(0, 200)
  const formattedRows = rowsToShow
    .map((row) =>
      csvContext.headers
        .map((h, i) => `${h}: ${row[i] ?? 'null'}`)
        .join(' | ')
    )
    .join('\n')
  const truncationNote = csvContext.rowCount > 200
    ? `\n(${csvContext.rowCount - 200} additional rows not shown)`
    : ''

  const datasetContext = `
## Active Dataset: ${csvContext.filename}
- **Rows**: ${csvContext.rowCount.toLocaleString()}
- **Columns (${csvContext.headers.length})**: ${csvContext.headers.join(', ')}

### Full dataset (up to 200 rows shown):
\`\`\`
${formattedRows}
\`\`\`${truncationNote}
`

  const provider = createAnthropic({ apiKey })

  const reportContext = report
    ? `\n\n---\nA pre-generated analysis report is available for reference:\n<report>\n${report}\n</report>`
    : ''

  const result = streamText({
    model: provider(model),
    system: `${SENIOR_DS_SYSTEM_PROMPT}\n\n${datasetContext}${reportContext}`,
    messages,
    maxOutputTokens: 1024,
  })

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of result.textStream) {
        controller.enqueue(encoder.encode(chunk))
      }
      const usage = await result.usage
      // AI SDK v6 uses inputTokens/outputTokens (not promptTokens/completionTokens)
      const promptTokens = usage.inputTokens ?? 0
      const completionTokens = usage.outputTokens ?? 0
      controller.enqueue(encoder.encode(buildSentinel(promptTokens, completionTokens)))
      controller.close()
    }
  })
  return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
