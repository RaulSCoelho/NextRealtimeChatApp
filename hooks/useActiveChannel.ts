import { useEffect, useState } from 'react'

import { User } from '@/@types/pusher'
import { cookies } from '@/lib/cookies'
import { pusherClient } from '@/services/pusher/client'
import { Channel } from 'pusher-js'

import { useActiveList } from './useActiveList'

interface Member {
  id: string
  info: User
}

interface Members {
  me: Member
  members: {
    [key: string]: User
  }
  myID: string
  count: number
}

export function useActiveChannel() {
  const { set, add, remove } = useActiveList()
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null)

  useEffect(() => {
    let channel = activeChannel

    if (!channel) {
      channel = pusherClient.subscribe('presence-messenger')
      setActiveChannel(channel)
    }

    channel.bind('pusher:subscription_succeeded', ({ members = {} }: Members) => {
      const currentUser = cookies.get('user') || {}
      const storedUsers = cookies.get('users') || {}
      const loggedUsers = members
      cookies.set('users', { ...storedUsers, ...loggedUsers })

      set(Object.values(members).filter(({ id }: any) => id !== currentUser.id))
    })

    channel.bind('pusher:member_added', (member: Member) => {
      member.info && add(member.info)
    })

    channel.bind('pusher:member_removed', (member: Member) => {
      member.info && remove(member.info.id)
    })

    return () => {
      if (activeChannel) {
        pusherClient.unsubscribe('presence-messenger')
        setActiveChannel(null)
      }
    }
  }, [activeChannel, set, add, remove])
}
