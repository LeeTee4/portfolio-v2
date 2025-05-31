import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sibanda | Portfolio',
  description: 'Sibanda Leeroy - Portfolio',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
