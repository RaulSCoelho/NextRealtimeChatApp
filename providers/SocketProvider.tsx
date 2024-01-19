import { createContext, useState } from 'react'

import { Message } from '@/@types/chat'
import { useArrayState } from '@/hooks/useArrayState'
import { useFirstRenderEffect } from '@/hooks/useFirstRenderEffect'
import socketClient from '@/services/socket'

type Socket = ReturnType<typeof socketClient>

interface SocketContextProps {
  socket?: Socket
  messages: Message[]
  sendMessage(message: string): void
}

export const SocketContext = createContext({} as SocketContextProps)

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket>()
  const [isMounted, setIsMounted] = useState(false)
  const [messages, { add }, setMessages] = useArrayState<Message>([])

  useFirstRenderEffect(() => {
    const socket = socketClient({
      onConnect() {
        setIsMounted(true)
      }
    })

    socket.on('previousMessages', messages => {
      console.log(messages)
      setMessages(messages)
    })

    socket.on('receivedMessage', message => {
      console.log(message)

      add(message)
    })

    setSocket(socket)
  })

  function sendMessage(message: string) {
    if (socket) {
      socket.emit('sendMessage', {
        id: socket.id!,
        message,
        sendDate: new Date()
      })
    }
  }

  return (
    <SocketContext.Provider value={{ socket, messages, sendMessage }}>{isMounted && children}</SocketContext.Provider>
  )
}
