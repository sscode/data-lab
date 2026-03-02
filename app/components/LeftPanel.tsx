'use client'

import React from 'react'
import type { CSVData } from '../lib/types'
import { UploadZone } from './UploadZone'
import { DataPreview } from './DataPreview'

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
      <UploadZone
        csv={csv}
        isDragging={isDragging}
        fileRef={fileRef}
        handleFile={handleFile}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      />
      <DataPreview csv={csv} />
    </div>
  )
}
