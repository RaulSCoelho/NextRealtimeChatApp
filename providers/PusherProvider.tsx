import { createContext } from 'react'

import { Message, User } from '@/@types/pusher'
import { useArrayState } from '@/hooks/useArrayState'
import { useFirstRenderEffect } from '@/hooks/useFirstRenderEffect'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { api } from '@/services/axios'
import { pusherClient } from '@/services/pusher/client'
import { v4 as uuid } from 'uuid'

interface PusherContextProps {
  user: User
  users: User[]
  messages: Message[]
  setUser(user: string): void
  sendMessage(message: string): Promise<void>
}

export const PusherContext = createContext({} as PusherContextProps)

function getFirstTimeUser() {
  const id = uuid()
  return { id, name: `anonymous-${id}` }
}

export function PusherProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useLocalStorage<User>('user', getFirstTimeUser)
  const [users] = useArrayState<User>([])
  const [messages, { add: addMessage }] = useArrayState<Message>([])

  useFirstRenderEffect(() => {
    const presenceChannel = pusherClient.subscribe('presence-channel')
    presenceChannel.bind('pusher:subscription_succeeded', function (members: any) {
      console.log('the current members are', members)
    })
    presenceChannel.bind('pusher:member_added', function (member: any) {
      console.log('A new member is online', member)
    })
    presenceChannel.bind('pusher:member_removed', function (member: any) {
      console.log('This member is now offline', member)
    })

    pusherClient.subscribe('incoming_message')

    function sendMessageHandler(message: Message) {
      if (user.id !== message.sender.id) {
        addMessage(message)
      }
    }

    pusherClient.bind('incoming_message', sendMessageHandler)

    return () => {
      pusherClient.unsubscribe('incoming_message')
      pusherClient.unbind('incoming_message', sendMessageHandler)
    }
  })

  async function sendMessage(message: string) {
    const newMessage = {
      sender: user,
      message,
      sendDate: new Date()
    }
    addMessage(newMessage)
    await api.post('api/messages', newMessage)
  }

  return (
    <PusherContext.Provider
      value={{
        user,
        users,
        messages,
        sendMessage,
        setUser(user) {
          setUser(prev => ({ ...prev, name: user }))
        }
      }}
    >
      {children}
    </PusherContext.Provider>
  )
}
