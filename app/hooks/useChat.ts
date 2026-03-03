'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import type { CSVData, Message, MessageCost, ModelId } from '../lib/types'
import { stripSentinel, calcCost } from '../lib/costs'

export function useChat(csv: CSVData | null, apiKey: string, report: string | null = null, model: ModelId = 'claude-sonnet-4-6') {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isChatBusy, setChatBusy] = useState(false)
  const [sessionCostUsd, setSessionCostUsd] = useState(0)

  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isChatBusy])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !csv || isChatBusy) return

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input }
    const allMsgs = [...messages, userMsg]
    setMessages(allMsgs)
    setInput('')
    setChatBusy(true)

    const asstId = `${Date.now()}-a`
    setMessages((p) => [...p, { id: asstId, role: 'assistant', content: '', streaming: true }])

    try {
      const res = await fetch('/api/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
        body:    JSON.stringify({
          messages: allMsgs.map((m) => ({ role: m.role, content: m.content })),
          csvContext: { headers: csv.headers, preview: csv.rows, allRows: csv.allRows, rowCount: csv.rowCount, filename: csv.filename },
          report,
          model,
        }),
      })

      const reader  = res.body?.getReader()
      const decoder = new TextDecoder()
      let content   = ''

      while (reader) {
        const { done, value } = await reader.read()
        if (done) break
        content += decoder.decode(value, { stream: true })
        setMessages((p) =>
          p.map((m) => (m.id === asstId ? { ...m, content } : m))
        )
      }
      const result = stripSentinel(content)
      let cost: MessageCost | undefined
      if (
        result.usage !== null &&
        typeof result.usage.promptTokens === 'number' &&
        typeof result.usage.completionTokens === 'number'
      ) {
        cost = {
          promptTokens: result.usage.promptTokens,
          completionTokens: result.usage.completionTokens,
          totalTokens: result.usage.promptTokens + result.usage.completionTokens,
          costUsd: calcCost(model, result.usage.promptTokens, result.usage.completionTokens),
        }
        setSessionCostUsd((prev) => prev + cost!.costUsd)
      }
      setMessages((p) =>
        p.map((m) => (m.id === asstId ? { ...m, content: result.content, streaming: false, cost } : m))
      )
    } catch {
      setMessages((p) =>
        p.map((m) =>
          m.id === asstId ? { ...m, content: 'Request failed. Please try again.', streaming: false } : m
        )
      )
    } finally {
      setChatBusy(false)
      inputRef.current?.focus()
    }
  }, [input, csv, isChatBusy, messages, report])

  const reset = useCallback(() => {
    setMessages([])
    setInput('')
  }, [])

  return { messages, setMessages, input, setInput, isChatBusy, sessionCostUsd, bottomRef, inputRef, handleSubmit, reset }
}
