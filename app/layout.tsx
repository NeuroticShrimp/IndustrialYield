import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { QueryProvider } from '@/components/query-provider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Industrial Yield',
  description: 'Financial analysis dashboard for evaluating American industrial stocks using revenue-to-interest-rate valuation',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <QueryProvider>{children}</QueryProvider>
        <Analytics />
      </body>
    </html>
  )
}
