'use client'

import React from 'react'
import type { CSVData } from '../lib/types'

interface HeaderProps {
  csv: CSVData | null
  isAnalyzing: boolean
  onRunAnalysis: () => void
  apiKey: string
  onApiKeyChange: (key: string) => void
}

export function Header({ csv, isAnalyzing, onRunAnalysis, apiKey, onApiKeyChange }: HeaderProps) {
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

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* API Key input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="11" height="13" viewBox="0 0 11 13" fill="none" style={{ flexShrink: 0 }}>
            <rect x="1" y="5" width="9" height="7" rx="1.5" stroke="#AEAAA2" strokeWidth="1.2" fill="none"/>
            <path d="M3 5V3.5a2.5 2.5 0 0 1 5 0V5" stroke="#AEAAA2" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
            <circle cx="5.5" cy="8.5" r="1" fill="#AEAAA2"/>
          </svg>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            placeholder="Paste API key…"
            style={{
              width: 188,
              height: 28,
              padding: '0 8px',
              fontSize: 11,
              fontFamily: "'IBM Plex Mono', monospace",
              color: '#1A1917',
              background: apiKey ? 'rgba(15,123,91,0.06)' : 'rgba(55,53,47,0.04)',
              border: apiKey ? '1px solid rgba(15,123,91,0.3)' : '1px solid rgba(55,53,47,0.12)',
              borderRadius: 5,
              outline: 'none',
              transition: 'border-color 0.15s, background 0.15s',
            }}
          />
          {apiKey && (
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#0F7B5B', flexShrink: 0 }} />
          )}
        </div>
        {csv && (
          <button className="run-btn" onClick={onRunAnalysis} disabled={isAnalyzing}>
            {isAnalyzing
              ? <><div className="spinner" style={{ borderTopColor: '#fff' }} /> Analyzing...</>
              : <>Run Analysis</>
            }
          </button>
        )}
      </div>
    </header>
  )
}
