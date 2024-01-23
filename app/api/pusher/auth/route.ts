import { pusherServer } from '@/services/pusher/server'
import type { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const socketId = formData.get('socket_id')?.toString()
    const channel = formData.get('channel_name')?.toString()
    const user = JSON.parse(req.cookies.get('user')?.value || '{}')

    if (!socketId || !channel) {
      throw new Error('socket_id and channel_name are required')
    }

    // This authenticates every user. Don't do this in production!
    const authResponse = pusherServer.authorizeChannel(socketId, channel, { user_id: socketId, user_info: user })

    return Response.json(authResponse, { status: 200 })
  } catch (err: any) {
    return Response.json(err.message, { status: err.statusCode || 400 })
  }
}
