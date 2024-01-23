import { User } from '@/@types/pusher'
import { create } from 'zustand'

type ActiveListStore = {
  users: User[]
  set(users: User[]): void
  add(users: User): void
  remove(id: string): void
}

export const useActiveList = create<ActiveListStore>()(set => ({
  users: [],
  add: user => set(state => (state.users.some(u => u.id === user.id) ? state : { users: [...state.users, user] })),
  remove: id => set(state => ({ users: state.users.filter(user => user.id !== id) })),
  set: users => set({ users })
}))
