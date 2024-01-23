'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { FaUserFriends } from 'react-icons/fa'
import { MdSend } from 'react-icons/md'

import { Message, User, messageSchema } from '@/@types/pusher'
import { useActiveList } from '@/hooks/useActiveList'
import { useArrayState } from '@/hooks/useArrayState'
import { useFirstRenderEffect } from '@/hooks/useFirstRenderEffect'
import { useUser } from '@/hooks/useUser'
import { toPusherKey } from '@/lib/pusher'
import { submitOnEnter } from '@/lib/utils'
import { api } from '@/services/axios'
import { pusherClient } from '@/services/pusher/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Card, CardBody, Textarea, User as UserCard } from '@nextui-org/react'
import { format } from 'date-fns'

export default function Home() {
  const { users } = useActiveList()
  const { user } = useUser()
  const { register, handleSubmit, watch, setValue, resetField } = useForm<Message>({
    resolver: zodResolver(messageSchema),
    defaultValues: { message: '' }
  })
  const [messages, { add: addMessage }] = useArrayState<Message>([])
  const values = watch()

  useFirstRenderEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${user.id}:incoming_message`))
    pusherClient.bind('incoming_message', addMessage)

    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${user.id}:incoming_message`))
      pusherClient.unbind('incoming_message', addMessage)
    }
  })

  useEffect(() => {
    setValue('sender', user)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const setReceiver = (user: User) => () => {
    setValue('receiver', user)
  }

  async function onSubmit(message: Message) {
    addMessage(message)
    resetField('message')
    await api.post('api/messages', message)
  }

  return (
    <form className="h-full" onSubmit={handleSubmit(onSubmit)}>
      <Card className="h-full" isBlurred>
        <CardBody className="flex h-full flex-col divide-white max-sm:divide-y-2 sm:flex-row sm:divide-x-2">
          <div className="flex w-full gap-2 max-sm:mb-2 max-sm:overflow-auto sm:mr-2 sm:w-1/4 sm:flex-col">
            {users.map(user => (
              <UserCard
                data-selected={user.id === values.receiver?.id}
                name={user.name}
                description={
                  messages.filter(msg => msg.sender.id === user.id || msg.receiver.id === user.id).slice(-1)[0]?.message
                }
                avatarProps={{
                  src: `https://i.pravatar.cc/150?u=${user.id}`,
                  className: 'shrink-0'
                }}
                classNames={{
                  base: 'cursor-pointer justify-start min-w-[90%] p-1.5 hover:bg-blue-200 data-[selected=true]:bg-blue-200',
                  name: 'line-clamp-1',
                  description: 'line-clamp-2'
                }}
                onClick={setReceiver(user)}
                key={user.id}
              />
            ))}
          </div>
          <div className="flex grow flex-col max-sm:pt-2 sm:pl-2">
            <div className="grow space-y-3">
              {values.receiver &&
                messages
                  .filter(msg => msg.sender.id === values.receiver.id || msg.receiver.id === values.receiver.id)
                  .map((msg, i) => (
                    <Card
                      className="break-word relative bg-white/65 p-1.5 text-small text-inherit"
                      radius="sm"
                      shadow="sm"
                      key={i}
                    >
                      <p className="font-bold">{msg.sender.name}</p>
                      <p>{msg.message}</p>
                      <p className="absolute bottom-1 right-1.5 text-tiny text-foreground-400">
                        {format(msg.sendDate, 'HH:mm')}
                      </p>
                    </Card>
                  ))}
              {!values.receiver && (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <FaUserFriends className="mx-auto mb-4 text-5xl text-gray-300" />
                    <p className="text-lg text-gray-500">
                      No friend selected yet! Connect with someone to start chatting.
                    </p>
                    <p className="text-sm text-gray-500">
                      Choose a friend from the list and share your thoughts and feelings.
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-2 text-end">
              <Textarea
                placeholder="Message"
                value={values.message}
                classNames={{ innerWrapper: 'items-center' }}
                endContent={
                  <Button type="submit" color="secondary" isDisabled={!values.receiver} isIconOnly>
                    <MdSend size={20} />
                  </Button>
                }
                onKeyDown={e => submitOnEnter(e, !!values.receiver)}
                {...register('message')}
              />
            </div>
          </div>
        </CardBody>
      </Card>
    </form>
  )
}
