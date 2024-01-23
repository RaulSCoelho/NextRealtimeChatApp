import { useState } from 'react'

import { isFunction, isServer } from '@/lib/assertions'
import { cookies } from '@/lib/cookies'

function getInitialValue<T>(key: string, initialValue: T | (() => T)) {
  const defaultValue = () => (isFunction(initialValue) ? initialValue() : initialValue)
  if (isServer) {
    return defaultValue()
  }

  try {
    const item = cookies.get(key)

    if (item) return item

    const value = defaultValue()

    cookies.set(key, value)

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
        cookies.set(key, valueToStore)
      }
    } catch (error) {
      console.log(error)
    }
  }

  function removeValue() {
    if (!isServer) {
      cookies.delete(key)
    }
  }

  return [storedValue, setValue, removeValue] as const
}

export type CookieStateReturn = ReturnType<typeof useCookieState>
