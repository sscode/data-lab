'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import type { CSVData, Message } from '../lib/types'

export function useChat(csv: CSVData | null, apiKey: string, report: string | null = null) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isChatBusy, setChatBusy] = useState(false)

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
      setMessages((p) =>
        p.map((m) => (m.id === asstId ? { ...m, streaming: false } : m))
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

  return { messages, setMessages, input, setInput, isChatBusy, bottomRef, inputRef, handleSubmit, reset }
}
