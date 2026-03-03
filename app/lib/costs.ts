export const MODELS = {
  'claude-sonnet-4-6': { label: 'Claude Sonnet 4.6', shortLabel: 'Sonnet 4.6', description: 'Fast & cost-effective', input: 3.00,  output: 15.00 },
  'claude-opus-4-6':   { label: 'Claude Opus 4.6',   shortLabel: 'Opus 4.6',   description: 'Most capable',         input: 15.00, output: 75.00 },
} as const

export type ModelId = keyof typeof MODELS

export interface UsagePayload {
  promptTokens: number
  completionTokens: number
}

export function calcCost(model: ModelId, promptTokens: number, completionTokens: number): number {
  const pricing = MODELS[model]
  return (promptTokens * pricing.input + completionTokens * pricing.output) / 1_000_000
}

export function formatCost(usd: number): string {
  if (usd <= 0) return '$0.0000'
  if (usd < 0.0001) return '<$0.0001'
  return '$' + usd.toFixed(4)
}

const SENTINEL_PREFIX = '\n\n[USAGE:'
const SENTINEL_SUFFIX = ']'

export function buildSentinel(promptTokens: number, completionTokens: number): string {
  const payload: UsagePayload = { promptTokens, completionTokens }
  return SENTINEL_PREFIX + JSON.stringify(payload) + SENTINEL_SUFFIX
}

export function stripSentinel(raw: string): { content: string; usage: UsagePayload | null } {
  const idx = raw.lastIndexOf(SENTINEL_PREFIX)
  if (idx === -1) return { content: raw, usage: null }

  const suffixIdx = raw.indexOf(SENTINEL_SUFFIX, idx + SENTINEL_PREFIX.length)
  if (suffixIdx === -1) return { content: raw, usage: null }

  const jsonStr = raw.slice(idx + SENTINEL_PREFIX.length, suffixIdx)
  try {
    const usage = JSON.parse(jsonStr) as UsagePayload
    const content = raw.slice(0, idx)
    return { content, usage }
  } catch {
    return { content: raw, usage: null }
  }
}
