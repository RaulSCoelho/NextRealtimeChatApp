import './globals.css'
import { Providers } from '@/providers'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { Navbar } from './navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Next.js Real Time Chat'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-app`}>
        <Providers>
          <div className="flex h-[100dvh] w-screen flex-col overflow-hidden">
            <Navbar />
            <div className="flex grow flex-col overflow-hidden p-5 sm:p-20">{children}</div>
          </div>
        </Providers>
      </body>
    </html>
  )
}
