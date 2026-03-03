'use client'

import React from 'react'
import type { CSVData, Message, ModelId } from '../lib/types'
import { renderMarkdown } from '../lib/renderMarkdown'
import { formatCost } from '../lib/costs'

interface ChatPanelProps {
  csv: CSVData | null
  messages: Message[]
  input: string
  setInput: (v: string) => void
  isChatBusy: boolean
  bottomRef: React.RefObject<HTMLDivElement | null>
  inputRef: React.RefObject<HTMLInputElement | null>
  handleSubmit: (e: React.FormEvent) => void
  sessionCostUsd: number
  selectedModel: ModelId
}

export function ChatPanel({
  csv, messages, input, setInput, isChatBusy,
  bottomRef, inputRef, handleSubmit,
  sessionCostUsd, selectedModel,
}: ChatPanelProps) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
        {messages.length === 0 ? (
          <div style={{
            paddingTop: 80, textAlign: 'center',
            color: '#AEAAA2',
            fontFamily: "'Manrope', sans-serif",
            fontSize: 13,
            lineHeight: 2,
          }}>
            <div style={{ marginBottom: 18 }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" style={{ display: 'inline-block', opacity: 0.25 }}>
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M3 9h18M9 21V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div style={{ fontWeight: 600, color: '#6F6E69', marginBottom: 6 }}>No dataset loaded</div>
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
                  boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                }}>
                  {msg.content}
                </div>
              ) : msg.streaming ? (
                <div style={{
                  maxWidth: '88%',
                  color: '#6F6E69',
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 12,
                  lineHeight: 1.95,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}>
                  {msg.content}
                  <span style={{
                    display: 'inline-block',
                    width: 5, height: 13,
                    background: '#1A1917',
                    marginLeft: 2,
                    verticalAlign: 'text-bottom',
                    borderRadius: 1,
                    opacity: 0.55,
                  }} />
                </div>
              ) : (
                <div
                  className="prose chat-prose"
                  style={{
                    maxWidth: '88%',
                    color: '#6F6E69',
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 12,
                    lineHeight: 1.95,
                  }}
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                />
              )}
              {msg.role === 'assistant' && !msg.streaming && msg.cost && (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  marginTop: 7,
                  padding: '3px 8px',
                  background: '#F0EFEC',
                  border: '1px solid rgba(55,53,47,0.12)',
                  borderRadius: 4,
                  fontFamily: 'IBM Plex Mono, monospace',
                  fontSize: 10.5,
                  color: '#6F6E69',
                }}>
                  <span style={{ color: '#1A1917', fontWeight: 600 }}>{formatCost(msg.cost.costUsd)}</span>
                  <span style={{ opacity: 0.4 }}>·</span>
                  <span>{msg.cost.totalTokens.toLocaleString()} tok</span>
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
        {sessionCostUsd > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            marginBottom: 8,
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: 10.5,
            color: '#AEAAA2',
          }}>
            <span>session total</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span style={{ color: '#1A1917', fontWeight: 600 }}>{formatCost(sessionCostUsd)}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div className="chat-input-wrap" style={{ flex: 1, minHeight: 38 }}>
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
  )
}
