import { Message, User } from "./interface";

/**
 * Decides whether to send a notification depending on a 
 * users settings and message information
 * 
 * @param user
 * @param message 
 * @returns { boolean }
 */
export function notificationService(user: User, message: Message): boolean {
  if (user.status === 'do not disturb') {
    return false;
  }

  if (user.silenced.includes(message.channel)) {
    return false
  }

  if (message.content.includes(`@${user.username}`) || message.content.includes('@everyone')) {
    return true;
  }

  if (user.status === 'online') {
    if (message.dm && message.channel === `@${user.username}`) {
      return true;
    }
    if (user.subscribed.includes(message.channel)) {
      return true;
    }
  }
  return false;
}
