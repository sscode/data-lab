import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DataLab — Senior Data Scientist',
  description: 'CSV analysis powered by Claude senior data scientist skill',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
