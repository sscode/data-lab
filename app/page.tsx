'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { CSS } from './styles/global-classes'
import { useCSV } from './hooks/useCSV'
import { useChat } from './hooks/useChat'
import { useAnalysis } from './hooks/useAnalysis'
import { Header } from './components/Header'
import { LeftPanel } from './components/LeftPanel'
import { RightPanel } from './components/RightPanel'
import { StatusBar } from './components/StatusBar'
import type { CSVData, Panel, ModelId } from './lib/types'

export default function DataLab() {
  const [csv, setCsv]           = useState<CSVData | null>(null)
  const [panel, setPanel]       = useState<Panel>('chat')
  const [apiKey, setApiKey]     = useState('')
  const [selectedModel, setSelectedModel] = useState<ModelId>('claude-sonnet-4-6')

  useEffect(() => {
    const saved = localStorage.getItem('anthropic-api-key')
    if (saved) setApiKey(saved)
  }, [])

  const analysis = useAnalysis(csv, setPanel, apiKey, selectedModel)
  const chat     = useChat(csv, apiKey, analysis.report, selectedModel)
  const { sessionCostUsd } = chat
  const { analysisCost }   = analysis

  const handleClearAll = useCallback(() => {
    setCsv(null)
    chat.reset()
    analysis.reset()
    setPanel('chat')
  }, [chat, analysis])

  const { isDragging, fileRef, handleFile, onDragOver, onDragLeave, onDrop } = useCSV({
    onFileLoaded: useCallback((data: CSVData) => {
      setCsv(data)
      setPanel('chat')
      chat.setMessages([{
        id: 'init',
        role: 'assistant',
        content: `Dataset loaded: **${data.filename}**\n${data.rowCount.toLocaleString()} records · ${data.headers.length} features · ${data.fileSize}\n\nReady. Ask me anything about your data.`,
      }])
    }, [chat.setMessages]),
  })

  return (
    <>
      <style>{CSS}</style>

      <div style={{
        display: 'flex', flexDirection: 'column', height: '100vh',
        position: 'relative', zIndex: 1,
      }}>
        <Header
          csv={csv}
          apiKey={apiKey}
          onApiKeyChange={(key) => { setApiKey(key); localStorage.setItem('anthropic-api-key', key) }}
          hasCsv={!!csv}
          onClearAll={handleClearAll}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
        />

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <LeftPanel
            csv={csv}
            isDragging={isDragging}
            fileRef={fileRef}
            handleFile={handleFile}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          />
          <RightPanel
            csv={csv}
            panel={panel}
            setPanel={setPanel}
            messages={chat.messages}
            input={chat.input}
            setInput={chat.setInput}
            isChatBusy={chat.isChatBusy}
            isAnalyzing={analysis.isAnalyzing}
            report={analysis.report}
            bottomRef={chat.bottomRef}
            inputRef={chat.inputRef}
            handleSubmit={chat.handleSubmit}
            onRunAnalysis={analysis.runAnalysis}
            sessionCostUsd={sessionCostUsd}
            analysisCost={analysisCost}
            selectedModel={selectedModel}
          />
        </div>

        <StatusBar csv={csv} />
      </div>
    </>
  )
}
