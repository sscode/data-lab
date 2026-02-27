import type { CSVData } from './types'

export function parseCSV(text: string, filename: string, size: number): CSVData {
  const lines = text
    .trim()
    .split('\n')
    .filter((l) => l.trim())
  const headers = lines[0]
    .split(',')
    .map((h) => h.trim().replace(/^"|"$/g, ''))
  const rows = lines
    .slice(1, 6)
    .map((line) => line.split(',').map((c) => c.trim().replace(/^"|"$/g, '')))
  const kb = size / 1024
  const fileSize = kb < 1024 ? `${kb.toFixed(1)}kb` : `${(kb / 1024).toFixed(2)}mb`
  return { headers, rows, rowCount: lines.length - 1, filename, fileSize }
}
