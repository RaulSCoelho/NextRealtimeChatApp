import { Message } from '@/@types/chat'
import { env } from '@/env'
import type { NextRequest, NextResponse } from 'next/server'
import { Server } from 'socket.io'

interface NextApiResponseWithSocket extends NextResponse {
  socket?: {
    server: {
      io: Server | undefined
    }
  }
}

let messages: Message[] = []
const PORT = env.NEXT_PUBLIC_PORT + 1

export async function GET(req: NextRequest, res: NextApiResponseWithSocket) {
  if (res.socket?.server.io) {
    return Response.json({
      success: true,
      message: 'Socket is already running',
      socket: `:${PORT}`
    })
  }

  try {
    console.log('Starting Socket.IO server on port:', PORT)
    const io = new Server({ path: '/api/socket', addTrailingSlash: false, cors: { origin: '*' } }).listen(PORT)

    io.on('connect', socket => {
      console.log('socket connect', socket.id)

      socket.broadcast.emit('welcome', `Welcome ${socket.id}`)

      socket.emit('previousMessages', messages)

      socket.on('sendMessage', (msg: Message) => {
        messages.push(msg)
        socket.emit('receivedMessage', msg)
      })

      socket.on('disconnect', async () => {
        console.log('socket disconnect', socket.id)
      })
    })

    res.socket = { server: { io } }
    return Response.json({ success: true, message: 'Socket is started', socket: `:${PORT}` }, { status: 201 })
  } catch (err: any) {
    return Response.json(err.message, { status: err.statusCode || 400 })
  }
}
