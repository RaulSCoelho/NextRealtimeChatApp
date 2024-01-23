import { z } from 'zod'

export const userSchema = z.object({
  id: z.string(),
  name: z.string()
})

export const messageSchema = z.object({
  sender: userSchema,
  receiver: userSchema,
  message: z.string().min(1, 'Message cannot be empty'),
  sendDate: z.date().default(new Date())
})

export type User = z.infer<typeof userSchema>
export type Message = z.infer<typeof messageSchema>
