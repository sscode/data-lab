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

export const maxDuration = 60

interface CSVContext {
  filename: string
  rowCount: number
  headers: string[]
  preview: string[][]
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

  const { messages, csvContext }: { messages: Message[]; csvContext: CSVContext } =
    await req.json()

  const previewRows = csvContext.preview
    .map((row) =>
      csvContext.headers
        .map((h, i) => `${h}: ${row[i] ?? 'null'}`)
        .join(' | ')
    )
    .join('\n')

  const datasetContext = `
## Active Dataset: ${csvContext.filename}
- **Rows**: ${csvContext.rowCount.toLocaleString()}
- **Columns (${csvContext.headers.length})**: ${csvContext.headers.join(', ')}

### Preview (first ${csvContext.preview.length} records):
\`\`\`
${previewRows}
\`\`\`
`

  const provider = createAnthropic({ apiKey })

  const result = streamText({
    model: provider('claude-opus-4-6'),
    system: `${SENIOR_DS_SYSTEM_PROMPT}\n\n${datasetContext}`,
    messages,
    maxOutputTokens: 1024,
  })

  return result.toTextStreamResponse()
}
