import { env } from '@/env'
import './globals.css'
import { Providers } from '@/providers'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Next.js Real Time Chat'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  console.log('Envs', env)

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
