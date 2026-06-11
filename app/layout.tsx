import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Light switch',
  description: 'A simple light switch with voice feedback',
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
