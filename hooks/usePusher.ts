import { useContext } from 'react'

import { PusherContext } from '@/providers/PusherProvider'

export const usePusher = () => useContext(PusherContext)
