'use client'

import { useState } from 'react'

import { Message } from '@/@types/pusher'
import { useActiveList } from '@/hooks/useActiveList'
import { useArrayState } from '@/hooks/useArrayState'
import { useFirstRenderEffect } from '@/hooks/useFirstRenderEffect'
import { usePusher } from '@/hooks/usePusher'
import { toPusherKey } from '@/lib/pusher'
import { api } from '@/services/axios'
import { pusherClient } from '@/services/pusher/client'
import { Avatar, Button, Card, CardBody, Textarea } from '@nextui-org/react'

export default function Home() {
  const { users } = useActiveList()
  const { user } = usePusher()
  const [messages, { add: addMessage }] = useArrayState<Message>([])
  const [receiver, setReceiver] = useState('')
  const [message, setMessage] = useState('')

  useFirstRenderEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${user.name}:incoming_message`))

    function sendMessageHandler(message: Message) {
      if (user.id !== message.sender.id) {
        addMessage(message)
      }
    }

    pusherClient.bind('incoming_message', sendMessageHandler)

    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${user.name}:incoming_message`))
      pusherClient.unbind('incoming_message', sendMessageHandler)
    }
  })

  async function sendMessage(message: string) {
    const newMessage = {
      sender: user,
      receiver,
      message,
      sendDate: new Date()
    }
    addMessage(newMessage)
    setMessage('')
    await api.post('api/messages', newMessage)
  }

  return (
    <Card className="h-full" isBlurred>
      <CardBody className="flex h-full flex-col divide-white max-sm:divide-y-2 sm:flex-row sm:divide-x-2">
        <div className="flex w-full gap-2 max-sm:mb-2 max-sm:overflow-auto sm:mr-2 sm:w-1/4 sm:flex-col">
          {users.map((user, i) => (
            <div
              className="flex cursor-pointer items-center gap-2 rounded-md p-1.5 hover:bg-blue-200/35 max-sm:w-[90%] max-sm:min-w-[90%]"
              onClick={() => setReceiver(user)}
              key={i}
            >
              <Avatar name={user} className="shrink-0" />
              <p className="line-clamp-2">{user}</p>
            </div>
          ))}
        </div>
        <div className="flex grow flex-col max-sm:pt-2 sm:pl-2">
          <div className="grow space-y-3">
            {messages.map((msg, i) => (
              <Card className="break-word p-1.5" radius="sm" key={i} isBlurred>
                {msg.message}
              </Card>
            ))}
          </div>
          <div className="space-y-2 text-end">
            <Textarea placeholder="Message" value={message} onValueChange={setMessage} />
            <Button color="primary" onPress={() => sendMessage(message)}>
              Send
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
