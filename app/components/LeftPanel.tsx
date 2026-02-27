'use client'

import React from 'react'
import type { CSVData } from '../lib/types'

interface LeftPanelProps {
  csv: CSVData | null
  isDragging: boolean
  fileRef: React.RefObject<HTMLInputElement | null>
  handleFile: (file: File) => void
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: () => void
  onDrop: (e: React.DragEvent) => void
}

export function LeftPanel({
  csv, isDragging, fileRef, handleFile, onDragOver, onDragLeave, onDrop,
}: LeftPanelProps) {
  return (
    <div style={{
      width: 300, flexShrink: 0,
      display: 'flex', flexDirection: 'column',
      borderRight: '1px solid rgba(55,53,47,0.10)',
      overflow: 'hidden',
      background: '#FAFAF8',
    }}>

      {/* Upload zone */}
      <div style={{ padding: '12px', flexShrink: 0 }}>
        <input
          ref={fileRef}
          type="file"
          accept=".csv"
          style={{ display: 'none' }}
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        <div
          className={`upload-zone${isDragging ? ' drag-on' : ''}`}
          style={{ height: csv ? 40 : 80 }}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileRef.current?.click()}
        >
          {csv ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '0 14px' }}>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                <path d="M13.5 4.5L6 12 2.5 8.5" stroke="#0F7B5B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{
                color: '#1A1917',
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11,
                flex: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {csv.filename}
              </span>
              <span style={{ color: '#AEAAA2', fontSize: 10, flexShrink: 0 }}>replace</span>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '0 14px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ display: 'block', margin: '0 auto 6px' }}>
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="#AEAAA2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{
                color: '#AEAAA2',
                fontSize: 11,
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 500,
              }}>
                Drop CSV or click to browse
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Stats row */}
      {csv && (
        <div style={{
          display: 'flex', gap: 6, padding: '0 12px 12px',
          flexShrink: 0,
        }}>
          {[
            { label: 'ROWS', value: csv.rowCount.toLocaleString() },
            { label: 'COLS', value: String(csv.headers.length) },
            { label: 'SIZE', value: csv.fileSize },
          ].map(({ label, value }) => (
            <div key={label} className="stat-chip" style={{ flex: 1, minWidth: 0 }}>
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
      )}

      {/* Divider */}
      {csv && <div style={{ height: 1, background: 'rgba(55,53,47,0.10)', flexShrink: 0 }} />}

      {/* Table preview */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {csv ? (
          <>
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
                    <tr key={ri}>
                      {csv.headers.map((_, ci) => (
                        <td key={ci} title={row[ci]}>{row[ci] ?? '—'}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
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
        )}
      </div>
    </div>
  )
}
