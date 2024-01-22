import { pusherServer } from '@/services/pusher/server'
import type { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()

    const socketId = formData.get('socket_id')?.toString()
    const channel = formData.get('channel_name')?.toString()

    if (!socketId || !channel) {
      throw new Error('Socket ID and channel name are required')
    }

    // This authenticates every user. Don't do this in production!
    const authResponse = pusherServer.authorizeChannel(socketId, channel)

    return Response.json({ ...authResponse, success: true }, { status: 200 })
  } catch (err: any) {
    return Response.json(err.message, { status: err.statusCode || 400 })
  }
}
