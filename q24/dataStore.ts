const data: DataStore = {
  users: [],
  messages: []
}

export interface Error {
  error: string;
  message: string;
}

export interface User {
  userId: number,
  username: string
}

export interface Message {
  messageId: number,
  from: number,
  to: number,
  message: string
}

export interface DataStore {
  users: User[],
  messages: Message[]
}

export const getData = (): DataStore => data;
