import { useState } from 'react'

import { runPotentialPromise } from '@/lib/promise'

import { useFirstRenderEffect } from './useFirstRenderEffect'

export function useIsMounted(fn: () => void | Promise<void> = () => {}) {
  const [isMounted, setIsMounted] = useState(false)

  useFirstRenderEffect(() => {
    runPotentialPromise(fn).then(() => setIsMounted(true))
  })

  return isMounted
}
