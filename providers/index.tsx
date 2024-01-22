'use client'

import { NextUIProvider } from '@nextui-org/react'

import { PusherProvider } from './PusherProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider className="h-full">
      <PusherProvider>{children}</PusherProvider>
    </NextUIProvider>
  )
}
