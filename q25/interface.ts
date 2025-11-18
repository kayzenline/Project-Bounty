export interface User {
  username: string,
  status: 'online' | 'do not disturb' | 'busy',
  silenced: string[],
  subscribed: string[],
}

export interface Message {
  sender: string,
  dm: boolean,
  content: string,
  channel: string,
}