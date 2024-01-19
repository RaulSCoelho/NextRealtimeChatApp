'use client'

import { NextUIProvider } from '@nextui-org/react'

import { SocketProvider } from './SocketProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider className="h-full">
      <SocketProvider>{children}</SocketProvider>
    </NextUIProvider>
  )
}
