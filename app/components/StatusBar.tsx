'use client'

import React from 'react'
import type { CSVData } from '../lib/types'

interface StatusBarProps {
  csv: CSVData | null
}

export function StatusBar({ csv }: StatusBarProps) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'flex-start', alignItems: 'center',
      padding: '0 16px', height: 26,
      borderTop: '1px solid rgba(55,53,47,0.09)',
      background: '#FAFAF8',
      flexShrink: 0,
    }}>
      <span style={{
        display: 'flex', alignItems: 'center', gap: 6,
        fontSize: 10,
        color: '#AEAAA2',
        fontFamily: "'IBM Plex Mono', monospace",
      }}>
        {csv && (
          <span style={{
            width: 5, height: 5, borderRadius: '50%',
            background: '#0F7B5B',
            display: 'inline-block', flexShrink: 0,
          }} />
        )}
        {csv
          ? `${csv.filename}  ·  ${csv.rowCount.toLocaleString()} rows  ·  ${csv.headers.length} cols`
          : 'No file loaded'}
      </span>
    </div>
  )
}
