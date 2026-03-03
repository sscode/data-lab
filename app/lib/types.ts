export type CSVData = {
  headers: string[]
  rows: string[][]      // first 5 rows (for DataPreview table)
  allRows: string[][]   // ALL rows
  rowCount: number
  filename: string
  fileSize: string
}

export type MessageCost = {
  promptTokens: number
  completionTokens: number
  totalTokens: number
  costUsd: number
}

export type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  streaming?: boolean
  cost?: MessageCost
}

export type Panel = 'chat' | 'report'

export type ModelId = 'claude-sonnet-4-6' | 'claude-opus-4-6'
