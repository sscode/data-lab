'use client'

import React from 'react'
import type { CSVData } from '../lib/types'

interface HeaderProps {
  csv: CSVData | null
  isAnalyzing: boolean
  onRunAnalysis: () => void
}

export function Header({ csv, isAnalyzing, onRunAnalysis }: HeaderProps) {
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
