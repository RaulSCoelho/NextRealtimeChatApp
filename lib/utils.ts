import { KeyboardEvent as ReactKeyboardEvent } from 'react'

export function submitOnEnter<T extends HTMLElement>(
  event: ReactKeyboardEvent<T> | KeyboardEvent,
  canSubmit: boolean = true
) {
  const target = event.target as T
  if (event.key === 'Enter') {
    event.preventDefault()
    const submit = document.querySelector('button[type="submit"]') as HTMLButtonElement
    canSubmit && submit?.click()
    canSubmit && target.focus()
  }
}
