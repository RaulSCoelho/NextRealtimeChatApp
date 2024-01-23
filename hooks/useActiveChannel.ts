import { useEffect, useState } from 'react'

import { cookies } from '@/lib/cookies'
import { pusherClient } from '@/services/pusher/client'
import { Channel } from 'pusher-js'

import { useActiveList } from './useActiveList'

export function useActiveChannel() {
  const { set, add, remove } = useActiveList()
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null)

  useEffect(() => {
    let channel = activeChannel

    if (!channel) {
      channel = pusherClient.subscribe('presence-messenger')
      setActiveChannel(channel)
    }

    channel.bind('pusher:subscription_succeeded', ({ members = {} }: any) => {
      const currentUser = cookies.get('user') || {}
      const storedUsers = cookies.get('users') || {}
      const loggedUsers = members
      cookies.set('users', { ...storedUsers, ...loggedUsers })

      set(
        Object.values(members)
          .filter(({ id }: any) => id !== currentUser.id)
          .map((m: any) => m?.name)
      )
    })

    channel.bind('pusher:member_added', (member: any) => {
      const { info: { name = member.id } = {} } = member
      add(name)
    })

    channel.bind('pusher:member_removed', (member: any) => {
      const { info: { name = member.id } = {} } = member
      remove(name)
    })

    return () => {
      if (activeChannel) {
        pusherClient.unsubscribe('presence-messenger')
        setActiveChannel(null)
      }
    }
  }, [activeChannel, set, add, remove])
}
