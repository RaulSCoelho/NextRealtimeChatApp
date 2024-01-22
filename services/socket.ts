import { env } from '@/env'
import { io } from 'socket.io-client'

export type SocketClient = ReturnType<typeof socketClient>

export interface SocketClientProps {
  onConnect?(): void
  onDisconnect?(): void
  onFetched?(): void
}

export default function socketClient({ onConnect, onDisconnect, onFetched }: SocketClientProps = {}) {
  const socket = io(`:${env.NEXT_PUBLIC_PORT + 1}`, { path: '/api/socket', addTrailingSlash: false })

  socket.on('connect', () => {
    onConnect?.()
  })

  socket.on('disconnect', () => {
    onDisconnect?.()
  })

  socket.on('connect_error', async () => {
    await fetch('/api/socket')
    onFetched?.()
  })

  return socket
}
