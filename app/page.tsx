'use client'

import React, { useState, useCallback } from 'react'
import { CSS } from './styles/global-classes'
import { useCSV } from './hooks/useCSV'
import { useChat } from './hooks/useChat'
import { useAnalysis } from './hooks/useAnalysis'
import { Header } from './components/Header'
import { LeftPanel } from './components/LeftPanel'
import { RightPanel } from './components/RightPanel'
import type { CSVData, Panel } from './lib/types'

export default function DataLab() {
  const [csv, setCsv]     = useState<CSVData | null>(null)
  const [panel, setPanel] = useState<Panel>('chat')

  const chat     = useChat(csv)
  const analysis = useAnalysis(csv, setPanel)

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
          isAnalyzing={analysis.isAnalyzing}
          onRunAnalysis={analysis.runAnalysis}
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
          />
        </div>

        {/* Footer / status bar */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '0 16px', height: 26,
          borderTop: '1px solid rgba(55,53,47,0.09)',
          background: '#FAFAF8',
          flexShrink: 0,
        }}>
          <span style={{
            fontSize: 10,
            color: '#AEAAA2',
            fontFamily: "'IBM Plex Mono', monospace",
          }}>
            {csv
              ? `${csv.filename}  ·  ${csv.rowCount.toLocaleString()} rows  ·  ${csv.headers.length} cols`
              : 'No file loaded'}
          </span>
          <span style={{
            fontSize: 10,
            color: '#AEAAA2',
            fontFamily: "'IBM Plex Mono', monospace",
          }}>
            claude-opus-4-6  ·  senior-data-scientist
          </span>
        </div>
      </div>
    </>
  )
}
