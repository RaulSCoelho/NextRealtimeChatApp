import { Message } from '@/@types/pusher'
import { toPusherKey } from '@/lib/pusher'
import { pusherServer } from '@/services/pusher/server'
import type { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const message: Message = await req.json()

    pusherServer.trigger(toPusherKey('incoming_message'), 'incoming_message', message)

    return Response.json({ success: true }, { status: 201 })
  } catch (err: any) {
    return Response.json(err.message, { status: err.statusCode || 400 })
  }
}
