export type CSVData = {
  headers: string[]
  rows: string[][]
  rowCount: number
  filename: string
  fileSize: string
}

export type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  streaming?: boolean
}

export type Panel = 'chat' | 'report'
