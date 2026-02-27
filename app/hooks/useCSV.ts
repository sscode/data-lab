'use client'

import { useState, useRef, useCallback } from 'react'
import { parseCSV } from '../lib/parseCSV'
import type { CSVData } from '../lib/types'

interface UseCSVOptions {
  onFileLoaded: (data: CSVData) => void
}

export function useCSV({ onFileLoaded }: UseCSVOptions) {
  const [isDragging, setIsDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((file: File) => {
    if (!file.name.endsWith('.csv')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const data = parseCSV(text, file.name, file.size)
      onFileLoaded(data)
    }
    reader.readAsText(file)
  }, [onFileLoaded])

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const onDragLeave = useCallback(() => setIsDragging(false), [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }, [handleFile])

  return { isDragging, fileRef, handleFile, onDragOver, onDragLeave, onDrop }
}
