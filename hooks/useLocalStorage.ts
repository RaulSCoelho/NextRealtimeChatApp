import { useState } from 'react'

import { isFunction, isServer } from '@/lib/assertions'

function getInitialValue<T>(key: string, initialValue: T | (() => T)) {
  const defaultValue = () => (isFunction(initialValue) ? initialValue() : initialValue)
  if (isServer) {
    return defaultValue()
  }

  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue()
  } catch (error) {
    console.log(error)
    return defaultValue()
  }
}

export function useLocalStorage<T>(key: string, initialValue: T | (() => T), onChange?: (value: T) => void) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const value = getInitialValue(key, initialValue)
    onChange?.(value)
    return value
  })

  function setValue(value: T | ((val: T) => T)) {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value

      setStoredValue(valueToStore)
      onChange?.(valueToStore)

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
