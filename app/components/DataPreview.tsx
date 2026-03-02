'use client'

import React from 'react'
import type { CSVData } from '../lib/types'

interface DataPreviewProps {
  csv: CSVData | null
}

export function DataPreview({ csv }: DataPreviewProps) {
  if (!csv) {
    return (
      <div style={{
        padding: '40px 20px', textAlign: 'center',
        color: '#AEAAA2', fontSize: 12,
        fontFamily: "'Manrope', sans-serif",
        lineHeight: 1.9,
      }}>
        No dataset loaded.<br/>
        <span style={{ fontSize: 11 }}>
          Upload a CSV file to get started.
        </span>
      </div>
    )
  }

  return (
    <>
      {/* Stats row */}
      <div style={{ display: 'flex', gap: 6, padding: '0 12px 12px', flexShrink: 0 }}>
        {[
          { label: 'ROWS', value: csv.rowCount.toLocaleString() },
          { label: 'COLS', value: String(csv.headers.length) },
          { label: 'SIZE', value: csv.fileSize },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="stat-chip"
            style={{ flex: 1, minWidth: 0, transition: 'background 0.15s' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#F0EFEC')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '')}
          >
            <span style={{
              fontSize: 9,
              color: '#AEAAA2',
              fontFamily: "'IBM Plex Mono', monospace",
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontWeight: 500,
            }}>
              {label}
            </span>
            <span style={{
              fontSize: 13,
              color: '#2264D1',
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 500,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(55,53,47,0.10)', flexShrink: 0 }} />

      {/* Table preview */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{
          padding: '8px 12px 6px',
          fontSize: 10,
          color: '#AEAAA2',
          fontFamily: "'IBM Plex Mono', monospace",
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          flexShrink: 0,
        }}>
          Preview — {Math.min(5, csv.rows.length)} of {csv.rowCount.toLocaleString()} rows
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="dt">
            <thead>
              <tr>
                {csv.headers.map((h, i) => <th key={i}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {csv.rows.map((row, ri) => (
                <tr key={ri} style={{ background: ri % 2 === 1 ? 'rgba(55,53,47,0.025)' : 'transparent' }}>
                  {csv.headers.map((_, ci) => (
                    <td key={ci} title={row[ci]}>{row[ci] ?? '—'}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
