import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sibanda | Portfolio',
  description: 'Sibanda Leeroy - Portfolio',
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        type: 'image/x-icon',
      },
    ]
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
