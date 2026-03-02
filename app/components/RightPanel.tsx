'use client'

import React from 'react'
import type { CSVData, Message, Panel } from '../lib/types'
import { ChatPanel } from './ChatPanel'
import { ReportPanel } from './ReportPanel'

interface RightPanelProps {
  csv: CSVData | null
  panel: Panel
  setPanel: (p: Panel) => void
  messages: Message[]
  input: string
  setInput: (v: string) => void
  isChatBusy: boolean
  isAnalyzing: boolean
  report: string | null
  bottomRef: React.RefObject<HTMLDivElement | null>
  inputRef: React.RefObject<HTMLInputElement | null>
  handleSubmit: (e: React.FormEvent) => void
}

export function RightPanel({
  csv, panel, setPanel,
  messages, input, setInput, isChatBusy,
  isAnalyzing, report,
  bottomRef, inputRef, handleSubmit,
}: RightPanelProps) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden',
      background: '#FFFFFF',
    }}>

      {/* Tabs */}
      <div style={{
        display: 'flex', alignItems: 'flex-end',
        padding: '0 20px', gap: 0,
        boxShadow: '0 1px 0 rgba(55,53,47,0.10), 0 2px 4px rgba(55,53,47,0.04)',
        flexShrink: 0,
        height: 40,
        background: '#FAFAF8',
      }}>
        <button
          className={`tab-btn${panel === 'chat' ? ' active' : ''}`}
          onClick={() => setPanel('chat')}
        >
          Chat
        </button>
        <button
          className={`tab-btn${panel === 'report' ? ' active' : ''}`}
          onClick={() => setPanel('report')}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          Report
          {report && (
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#2264D1',
              display: 'inline-block', flexShrink: 0,
              marginBottom: 1,
            }} />
          )}
        </button>
      </div>

      {panel === 'chat' && (
        <ChatPanel
          csv={csv}
          messages={messages}
          input={input}
          setInput={setInput}
          isChatBusy={isChatBusy}
          bottomRef={bottomRef}
          inputRef={inputRef}
          handleSubmit={handleSubmit}
        />
      )}

      {panel === 'report' && (
        <ReportPanel isAnalyzing={isAnalyzing} report={report} />
      )}
    </div>
  )
}
