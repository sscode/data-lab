'use client'

import React, { useState, useRef, useEffect } from 'react'
import type { CSVData, ModelId } from '../lib/types'
import { MODELS } from '../lib/costs'

interface HeaderProps {
  csv: CSVData | null
  apiKey: string
  onApiKeyChange: (key: string) => void
  hasCsv: boolean
  onClearAll: () => void
  selectedModel: ModelId
  onModelChange: (model: ModelId) => void
}

export function Header({ csv, apiKey, onApiKeyChange, hasCsv, onClearAll, selectedModel, onModelChange }: HeaderProps) {
  const [showPopover, setShowPopover] = useState(false)
  const [showKey, setShowKey] = useState(false)
  const keyContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (keyContainerRef.current && !keyContainerRef.current.contains(e.target as Node)) {
        setShowPopover(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 20px', height: 48,
      borderBottom: '1px solid rgba(55,53,47,0.10)',
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(16px)',
      flexShrink: 0,
      position: 'relative', zIndex: 10,
    }}>
      {/* Logo + breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Wordmark icon */}
        <div style={{
          width: 22, height: 22,
          background: '#1A1917',
          borderRadius: 5,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <rect x="1" y="1" width="4" height="4" fill="white" rx="0.5"/>
            <rect x="7" y="1" width="4" height="4" fill="white" rx="0.5"/>
            <rect x="1" y="7" width="4" height="4" fill="white" rx="0.5"/>
            <rect x="7" y="7" width="4" height="4" fill="white" rx="0.5"/>
          </svg>
        </div>
        <span style={{
          color: '#1A1917',
          fontFamily: "'Manrope', sans-serif",
          fontWeight: 700,
          fontSize: 14,
          letterSpacing: '-0.02em',
        }}>
          DataLab
        </span>
        {csv && (
          <>
            <span style={{ color: '#AEAAA2', fontSize: 14, fontWeight: 300 }}>/</span>
            <span style={{
              color: '#6F6E69',
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11,
            }}>
              {csv.filename}
            </span>
          </>
        )}
      </div>

      {/* Right toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {hasCsv && (
          <button
            type="button"
            onClick={onClearAll}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '4px 10px',
              background: 'transparent',
              border: '1px solid rgba(55,53,47,0.18)',
              borderRadius: 6,
              cursor: 'pointer',
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11,
              fontWeight: 500,
              color: '#6F6E69',
              letterSpacing: '0.03em',
              transition: 'all 0.14s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,32,28,0.35)'
              ;(e.currentTarget as HTMLButtonElement).style.color = '#C9201C'
              ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(201,32,28,0.04)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(55,53,47,0.18)'
              ;(e.currentTarget as HTMLButtonElement).style.color = '#6F6E69'
              ;(e.currentTarget as HTMLButtonElement).style.background = 'transparent'
            }}
          >
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
            Clear All
          </button>
        )}

        {/* Model selector */}
        <select
          value={selectedModel}
          onChange={e => onModelChange(e.target.value as ModelId)}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,184,0,0.4)',
            color: '#ffb800',
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '11px',
            padding: '3px 6px',
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          {(Object.entries(MODELS) as [ModelId, { label: string }][]).map(([id, { label }]) => (
            <option key={id} value={id} style={{ background: '#080600' }}>{label}</option>
          ))}
        </select>

        {/* API Key */}
        <div ref={keyContainerRef} style={{ position: 'relative' }}>
        <button
          onClick={() => setShowPopover(p => !p)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '5px 10px',
            background: showPopover ? 'rgba(55,53,47,0.06)' : apiKey ? 'rgba(15,123,91,0.06)' : 'rgba(55,53,47,0.04)',
            border: apiKey ? '1px solid rgba(15,123,91,0.22)' : '1px solid rgba(55,53,47,0.12)',
            borderRadius: 6,
            cursor: 'pointer',
            transition: 'all 0.14s',
          }}
        >
          {/* Key icon */}
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
            <circle cx="8" cy="15" r="5" stroke={apiKey ? '#0F7B5B' : '#AEAAA2'} strokeWidth="1.8"/>
            <path d="M12.5 11.5L21 3M21 3h-3M21 3v3" stroke={apiKey ? '#0F7B5B' : '#AEAAA2'} strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <span style={{
            fontSize: 11.5,
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 600,
            color: apiKey ? '#0F7B5B' : '#6F6E69',
            letterSpacing: '-0.01em',
          }}>
            {apiKey ? 'API Key' : 'Add API Key'}
          </span>
          <span style={{
            width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
            background: apiKey ? '#0F7B5B' : '#D4A017',
          }} />
        </button>

        {showPopover && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 8px)', right: 0,
            width: 300,
            background: '#FFFFFF',
            border: '1px solid rgba(55,53,47,0.14)',
            borderRadius: 10,
            boxShadow: '0 4px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)',
            padding: '14px 16px',
            zIndex: 100,
          }}>
            {/* Header */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1917', fontFamily: "'Manrope', sans-serif", marginBottom: 3 }}>
                Anthropic API Key
              </div>
              <div style={{ fontSize: 11, color: '#AEAAA2', fontFamily: "'Manrope', sans-serif" }}>
                Stored locally in your browser · never sent to our servers
              </div>
            </div>

            {/* Input row */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: '#FAFAF8',
              border: apiKey
                ? (apiKey.startsWith('sk-ant-') ? '1px solid rgba(15,123,91,0.35)' : '1px solid rgba(201,32,28,0.25)')
                : '1px solid rgba(55,53,47,0.14)',
              borderRadius: 7,
              padding: '7px 10px',
              marginBottom: 8,
            }}>
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => onApiKeyChange(e.target.value)}
                placeholder="sk-ant-api03-..."
                autoComplete="off"
                spellCheck={false}
                style={{
                  flex: 1,
                  background: 'none', border: 'none', outline: 'none',
                  fontSize: 12,
                  fontFamily: "'IBM Plex Mono', monospace",
                  color: '#1A1917',
                  minWidth: 0,
                }}
              />
              {/* Show/hide toggle */}
              <button
                type="button"
                onClick={() => setShowKey(k => !k)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: '#AEAAA2', flexShrink: 0 }}
              >
                {showKey ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M3 12s3.6-7 9-7 9 7 9 7-3.6 7-9 7-9-7-9-7z" stroke="currentColor" strokeWidth="1.8"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/>
                    <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M3 12s3.6-7 9-7 9 7 9 7-3.6 7-9 7-9-7-9-7z" stroke="currentColor" strokeWidth="1.8"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/>
                  </svg>
                )}
              </button>
              {/* Clear button */}
              {apiKey && (
                <button
                  type="button"
                  onClick={() => onApiKeyChange('')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: '#AEAAA2', flexShrink: 0 }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              )}
              {/* Validation indicator */}
              {apiKey && (
                <span style={{
                  width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                  background: apiKey.startsWith('sk-ant-') ? '#0F7B5B' : '#C9201C',
                }} />
              )}
            </div>

            {/* Footer row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <a
                href="https://console.anthropic.com/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 11, color: '#2264D1',
                  fontFamily: "'Manrope', sans-serif",
                  textDecoration: 'none',
                  fontWeight: 500,
                }}
              >
                Get your API key →
              </a>
              <button
                type="button"
                onClick={() => setShowPopover(false)}
                style={{
                  fontSize: 11, color: '#6F6E69',
                  fontFamily: "'Manrope', sans-serif",
                  background: 'rgba(55,53,47,0.06)',
                  border: '1px solid rgba(55,53,47,0.12)',
                  borderRadius: 5,
                  padding: '4px 10px',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Done
              </button>
            </div>
          </div>
        )}
        </div>
      </div>
    </header>
  )
}
