import { create } from 'zustand'

type ActiveListStore = {
  users: string[]
  set(ids: string[]): void
  add(id: string): void
  remove(id: string): void
}

export const useActiveList = create<ActiveListStore>()(set => ({
  users: [],
  add: id => set(state => ({ users: [...state.users, id] })),
  remove: id => set(state => ({ users: state.users.filter(m => m !== id) })),
  set: ids => set({ users: ids })
}))
