export type CSVData = {
  headers: string[]
  rows: string[][]      // first 5 rows (for DataPreview table)
  allRows: string[][]   // ALL rows
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
