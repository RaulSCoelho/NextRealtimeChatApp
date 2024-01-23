import { createContext } from 'react'

import { User } from '@/@types/pusher'
import { useActiveChannel } from '@/hooks/useActiveChannel'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { cookies } from '@/lib/cookies'
import { v4 as uuid } from 'uuid'

interface PusherContextProps {
  user: User
  setUser(user: string): void
}

export const PusherContext = createContext({} as PusherContextProps)

function getFirstTimeUser() {
  const id = uuid()
  return { id, name: `anonymous-${id}` }
}

export function PusherProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useLocalStorage<User>('user', getFirstTimeUser, user => cookies.set('user', user))

  useActiveChannel()

  return (
    <PusherContext.Provider
      value={{
        user,
        setUser(user) {
          setUser(prev => ({ ...prev, name: user }))
        }
      }}
    >
      {children}
    </PusherContext.Provider>
  )
}
