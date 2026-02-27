'use client'

import React from 'react'
import { renderMarkdown } from '../lib/renderMarkdown'
import type { CSVData, Message, Panel } from '../lib/types'

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
        borderBottom: '1px solid rgba(55,53,47,0.10)',
        flexShrink: 0,
        height: 40,
        background: '#FFFFFF',
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
        >
          Report{report ? ' ·' : ''}
        </button>
      </div>

      {/* Chat panel */}
      {panel === 'chat' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
            {messages.length === 0 ? (
              <div style={{
                paddingTop: 72, textAlign: 'center',
                color: '#AEAAA2',
                fontFamily: "'Manrope', sans-serif",
                fontSize: 13,
                lineHeight: 2,
              }}>
                <div style={{ marginBottom: 14 }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ display: 'inline-block', opacity: 0.3 }}>
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M3 9h18M9 21V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                Load a CSV file to start analyzing your data.
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className="msg-in"
                  style={{
                    marginBottom: 22,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  {/* Role label */}
                  <div style={{
                    fontSize: 10.5,
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 700,
                    color: msg.role === 'user' ? '#1A1917' : '#AEAAA2',
                    marginBottom: 5,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}>
                    {msg.role === 'user' ? 'You' : 'DataLab'}
                  </div>

                  {/* Bubble */}
                  {msg.role === 'user' ? (
                    <div style={{
                      maxWidth: '72%',
                      padding: '10px 14px',
                      background: '#F0EFEC',
                      border: '1px solid rgba(55,53,47,0.10)',
                      borderRadius: 10,
                      color: '#1A1917',
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: 12,
                      lineHeight: 1.7,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}>
                      {msg.content}
                    </div>
                  ) : (
                    <div style={{
                      maxWidth: '88%',
                      color: '#6F6E69',
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: 12,
                      lineHeight: 1.85,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}>
                      {msg.content}
                      {msg.streaming && (
                        <span style={{
                          display: 'inline-block',
                          width: 5, height: 13,
                          background: '#1A1917',
                          marginLeft: 2,
                          verticalAlign: 'text-bottom',
                          borderRadius: 1,
                          opacity: 0.55,
                        }} />
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input area */}
          <div style={{
            borderTop: '1px solid rgba(55,53,47,0.10)',
            padding: '12px 20px',
            flexShrink: 0,
            background: '#FAFAF8',
          }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div className="chat-input-wrap" style={{ flex: 1 }}>
                <input
                  ref={inputRef}
                  className="chat-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={csv ? 'Ask about your data...' : 'Load a dataset first...'}
                  disabled={!csv || isChatBusy}
                  autoComplete="off"
                />
                {isChatBusy && <div className="spinner" />}
              </div>
              <button
                type="submit"
                className="send-btn"
                disabled={!input.trim() || !csv || isChatBusy}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Report panel */}
      {panel === 'report' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
          {isAnalyzing ? (
            <div style={{
              paddingTop: 80, textAlign: 'center',
              color: '#6F6E69',
              fontFamily: "'Manrope', sans-serif",
            }}>
              <div className="spinner" style={{ width: 18, height: 18, margin: '0 auto 18px', borderWidth: 1.5 }} />
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 5, color: '#1A1917' }}>
                Running deep analysis...
              </div>
              <div style={{ fontSize: 12, color: '#AEAAA2' }}>
                Senior data scientist agent working
              </div>
            </div>
          ) : report ? (
            <div
              className="prose fade-in"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(report) }}
            />
          ) : (
            <div style={{
              paddingTop: 80, textAlign: 'center',
              color: '#AEAAA2',
              fontFamily: "'Manrope', sans-serif",
              fontSize: 13,
              lineHeight: 2,
            }}>
              No report generated yet.<br/>
              <span style={{ fontSize: 12 }}>
                Click Run Analysis to generate a full EDA report.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
