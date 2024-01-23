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
  return (
    <html lang="en">
      <body className={`${inter.className} bg-app h-[100dvh] w-screen p-5 sm:p-20`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
