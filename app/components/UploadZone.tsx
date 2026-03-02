'use client'

import React from 'react'
import type { CSVData } from '../lib/types'

interface UploadZoneProps {
  csv: CSVData | null
  isDragging: boolean
  fileRef: React.RefObject<HTMLInputElement | null>
  handleFile: (file: File) => void
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: () => void
  onDrop: (e: React.DragEvent) => void
}

export function UploadZone({
  csv, isDragging, fileRef, handleFile, onDragOver, onDragLeave, onDrop,
}: UploadZoneProps) {
  return (
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
            <svg
              width="20" height="20" viewBox="0 0 24 24" fill="none"
              style={{ display: 'block', margin: '0 auto 7px', animation: 'upload-pulse 2.4s ease-in-out infinite' }}
            >
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
      <style>{`
        @keyframes upload-pulse {
          0%, 100% { opacity: 0.55; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-2px); }
        }
      `}</style>
    </div>
  )
}
