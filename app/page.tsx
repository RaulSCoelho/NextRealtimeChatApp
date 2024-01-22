'use client'

import { useState } from 'react'

import { usePusher } from '@/hooks/usePusher'
import { Button, Textarea } from '@nextui-org/react'

export default function Home() {
  const { users, messages, sendMessage } = usePusher()
  const [message, setMessage] = useState('')

  return (
    <div className="p-20">
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
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
