import { createContext } from 'react'

import { User } from '@/@types/pusher'
import { useActiveChannel } from '@/hooks/useActiveChannel'
import { useCookieState } from '@/hooks/useCookieState'
import { v4 as uuid } from 'uuid'

interface UserContextProps {
  user: User
  changeName(name: string): void
}

export const UserContext = createContext({} as UserContextProps)

function getFirstTimeUser() {
  const id = uuid()
  return { id, name: `anonymous-${id}` }
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useCookieState<User>('user', getFirstTimeUser)

  useActiveChannel()

  function setUserField<T extends keyof User>(field: T, value: User[T]) {
    setUser(prev => ({ ...prev, [field]: value }))
  }

  return (
    <UserContext.Provider
      value={{
        user,
        changeName: name => setUserField('name', name)
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
