import { env } from '@/env'
import { io } from 'socket.io-client'

export type SocketClient = ReturnType<typeof socketClient>

export interface SocketClientProps {
  onConnect?(): void
  onDisconnect?(): void
}

export default function socketClient({ onConnect, onDisconnect }: SocketClientProps = {}) {
  const socket = io(`:${env.NEXT_PUBLIC_PORT + 1}`, { path: '/api/socket', addTrailingSlash: false })

  socket.on('connect', () => {
    onConnect?.()
  })

  socket.on('disconnect', () => {
    onDisconnect?.()
  })

  socket.on('connect_error', async err => {
    console.log(`connect_error due to ${err.message}`)
    await fetch('/api/socket')
  })

  return socket
}
