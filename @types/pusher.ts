export interface User {
  id: string
  name: string
}

export interface Message {
  sender: User
  message: string
  sendDate: Date
}

export interface SendMessage extends Omit<Message, 'sendDate'> {}
