'use client'

import React, { useState, useEffect } from 'react'
import { renderMarkdown } from '../lib/renderMarkdown'
import type { CSVData, MessageCost } from '../lib/types'
import { formatCost } from '../lib/costs'

interface ReportPanelProps {
  isAnalyzing: boolean
  report: string | null
  csv: CSVData | null
  onRunAnalysis: () => void
  analysisCost: MessageCost | null
}

function AnimatedEllipsis() {
  const [dots, setDots] = useState('.')
  useEffect(() => {
    if (dots === '...') { const t = setTimeout(() => setDots('.'), 500); return () => clearTimeout(t) }
    const t = setTimeout(() => setDots(d => d + '.'), 500)
    return () => clearTimeout(t)
  }, [dots])
  return <span style={{ letterSpacing: 2 }}>{dots}</span>
}

export function ReportPanel({ isAnalyzing, report, csv, onRunAnalysis, analysisCost }: ReportPanelProps) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
      {isAnalyzing ? (
        <div style={{
          paddingTop: 80, textAlign: 'center',
          color: '#6F6E69',
          fontFamily: "'Manrope', sans-serif",
        }}>
          <div className="spinner" style={{ width: 20, height: 20, margin: '0 auto 20px', borderWidth: 1.5 }} />
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#1A1917' }}>
            Running deep analysis...
          </div>
          <div style={{ fontSize: 12, color: '#AEAAA2' }}>
            Senior data scientist agent working<AnimatedEllipsis />
          </div>
        </div>
      ) : report ? (
        <div className="fade-in">
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(report) }}
          />
          {analysisCost && (
            <div style={{ fontSize: '10px', color: 'rgba(255,184,0,0.5)', fontFamily: 'IBM Plex Mono, monospace', marginTop: '12px', borderTop: '1px solid rgba(255,184,0,0.15)', paddingTop: '8px' }}>
              Analysis cost: {formatCost(analysisCost.costUsd)} · {analysisCost.promptTokens.toLocaleString()} in / {analysisCost.completionTokens.toLocaleString()} out
            </div>
          )}
        </div>
      ) : (
        <div style={{
          paddingTop: 80, textAlign: 'center',
          color: '#AEAAA2',
          fontFamily: "'Manrope', sans-serif",
          fontSize: 13,
          lineHeight: 2,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          <div style={{ marginBottom: 16, opacity: 0.4 }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ display: 'inline-block' }}>
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div style={{ fontWeight: 600, color: '#6F6E69', marginBottom: 6 }}>No report yet</div>
          Run a deep analysis to generate a full EDA report for your dataset.
          {csv && (
            <button className="run-btn" onClick={onRunAnalysis} style={{ marginTop: 16, fontSize: 12 }}>
              Run Analysis
            </button>
          )}
        </div>
      )}
    </div>
  )
}
