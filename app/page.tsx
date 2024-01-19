'use client'

import { useState } from 'react'

import { useSocket } from '@/hooks/useSocket'
import { Button, Textarea } from '@nextui-org/react'

export default function Home() {
  const { messages, sendMessage } = useSocket()
  const [message, setMessage] = useState('')
  console.log(messages)

  return (
    <div className="p-20">
      {messages.map((msg, i) => (
        <div key={i}>{msg.message}</div>
      ))}
      <div className="space-y-2 text-end">
        <Textarea placeholder="Message" onValueChange={setMessage} />
        <Button color="primary" onPress={() => sendMessage(message)}>
          Send
        </Button>
      </div>
    </div>
  )
}
