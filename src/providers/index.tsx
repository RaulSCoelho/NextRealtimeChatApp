'use client'

import { Modals } from '@/hooks/useModal'
import { NextUIProvider } from '@nextui-org/react'

import { UserProvider } from './UserProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <Modals />
      <UserProvider>{children}</UserProvider>
    </NextUIProvider>
  )
}
