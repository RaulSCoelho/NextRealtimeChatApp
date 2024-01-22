import { useState } from 'react'

import { isFunction, isServer } from '@/lib/assertions'

function getInitialValue<T>(initialValue: T | (() => T)) {
  return isFunction(initialValue) ? initialValue() : initialValue
}

export function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (isServer) {
      return getInitialValue(initialValue)
    }

    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : getInitialValue(initialValue)
    } catch (error) {
      console.log(error)
      return getInitialValue(initialValue)
    }
  })

  function setValue(value: T | ((val: T) => T)) {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value

      setStoredValue(valueToStore)

      if (!isServer) {
        localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.log(error)
    }
  }

  function removeValue() {
    if (!isServer) {
      localStorage.removeItem(key)
    }
  }

  return [storedValue, setValue, removeValue] as const
}

export type UseLocalStorageReturn = ReturnType<typeof useLocalStorage>
