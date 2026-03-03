'use client'

import { useState, useEffect, useCallback } from 'react'
import type { CSVData, MessageCost, ModelId, Panel } from '../lib/types'
import type { Dispatch, SetStateAction } from 'react'

export function useAnalysis(csv: CSVData | null, setPanel: Dispatch<SetStateAction<Panel>>, apiKey: string, model: ModelId) {
  const [isAnalyzing, setAnalyzing]   = useState(false)
  const [report, setReport]           = useState<string | null>(null)
  const [analysisCost, setAnalysisCost] = useState<MessageCost | null>(null)

  useEffect(() => {
    setReport(null)
  }, [csv])

  const runAnalysis = useCallback(async () => {
    if (!csv || isAnalyzing) return
    setAnalyzing(true)
    setReport(null)
    setAnalysisCost(null)
    setPanel('report')

    try {
      const res  = await fetch('/api/analyze', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
        body:    JSON.stringify({ headers: csv.headers, preview: csv.rows, allRows: csv.allRows, rowCount: csv.rowCount, filename: csv.filename, model }),
      })
      const data = await res.json()
      if (data.error) setReport(`**ERROR**: ${data.error}`)
      else {
        setReport(data.report)
        setAnalysisCost((data.usage as MessageCost | null) ?? null)
      }
    } catch {
      setReport('**ERROR**: Analysis request failed. Check your API key and network.')
    } finally {
      setAnalyzing(false)
    }
  }, [csv, isAnalyzing, setPanel])

  const reset = useCallback(() => {
    setReport(null)
    setAnalysisCost(null)
  }, [])

  return { isAnalyzing, report, analysisCost, runAnalysis, reset }
}
