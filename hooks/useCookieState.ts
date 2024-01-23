import { useState } from 'react'

import { isFunction, isServer } from '@/lib/assertions'
import { clientCookies } from '@/lib/cookies/client'

function getInitialValue<T>(key: string, initialValue: T | (() => T)) {
  const defaultValue = () => (isFunction(initialValue) ? initialValue() : initialValue)
  if (isServer) return defaultValue()

  try {
    const item = clientCookies.get(key)
    if (item) return item

    const value = defaultValue()
    clientCookies.set(key, value)

    return value
  } catch (error) {
    console.log(error)
    return defaultValue()
  }
}

export function useCookieState<T>(key: string, initialValue: T | (() => T)) {
  const [storedValue, setStoredValue] = useState<T>(() => getInitialValue(key, initialValue))

  function setValue(value: T | ((val: T) => T)) {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value

      setStoredValue(valueToStore)

      if (!isServer) {
        clientCookies.set(key, valueToStore)
      }
    } catch (error) {
      console.log(error)
    }
  }

  function removeValue() {
    if (!isServer) {
      clientCookies.delete(key)
    }
  }

  return [storedValue, setValue, removeValue] as const
}

export type CookieStateReturn = ReturnType<typeof useCookieState>
