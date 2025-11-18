import { getData, Error } from "./dataStore";

///////////////////////////////////////////////////////////////////////////////
// Function Stub
// TODO: complete the implementation for the function below
///////////////////////////////////////////////////////////////////////////////

/**
 * Edit the message the user sent
 *
 * @param messageId - the id of message to be updated
 * @param from - sender userId
 * @param message - the new message string
 * @returns - { message: string } | Error
 */
export function editMessage(messageId: number, from: number, message: string): { message: string } | Error {
  // TODO: complete me
  return { message: "" };
}

///////////////////////////////////////////////////////////////////////////////
// PROVIDED IMPLEMENTATION
// You should not need to change the functions below.
///////////////////////////////////////////////////////////////////////////////

/**
 * Clear all users and messages in the room/broom
 * @returns {}
 */
export function clear(): {} {
  const data = getData();
  data.users = [];
  data.messages = [];
  return {};
}

/**
 * Adds a new user to the room.
 *
 * @param role - the role of the user who adds a new user to the room
 * @param username - username to be added
 * @returns - { userId: number } | Error
 */
export function addUser(role: string, username: string): {} {
  const data = getData();

  if (role !== 'moderator') {
    return {
      error: 'UNAUTHORIZED',
      message: 'Role is not moderator.'
    }
  }

  if (username.length < 2) {
    return {
      error: 'INVALID_USERNAME',
      message: 'Username is less than 2 characters.'
    }
  }

  if (username.length > 15) {
    return {
      error: 'INVALID_USERNAME',
      message: 'Username is longer than 15 characters.'
    }
  }

  const user = data.users.find(u => u.username === username);
  if (user) {
    return {
      error: 'INVALID_USERNAME',
      message: 'Username already exists.'
    }
  }

  const userId = data.users.length + 1;
  const newUser = {
    userId: userId,
    username: username
  }
  data.users.push(newUser);
  return {
    userId: userId
  };
}

/**
 * Sends message from a user to another user
 *
 * @param from - the sender userId
 * @param to - the receiver userId
 * @param message - the message string
 * @returns  { messageId: number } | Error
 */
export function sendMessage(from: number, to: number, message: string): {} {
  const data = getData();
  if (from === to) {
    return {
      error: 'INVALID_USERNAME',
      message: 'Sender and receiver are the same ids.'
    };
  }

  const userFrom = data.users.find(u => u.userId === from);
  if (!userFrom) {
    return {
      error: 'INVALID_SENDER',
      message: 'Invalid sender id.'
    };
  }

  const userTo = data.users.find(u => u.userId === to);
  if (!userTo) {
    return {
      error: 'INVALID_RECEIVER',
      message: 'Invalid receiver id.'
    };
  }

  if (!message || message.length > 100) {
    return {
      error: 'INVALID_MESSAGE',
      message: 'Message is empty or longer than 100 characters.'
    };
  }

  const messageId = data.messages.length + 1;
  data.messages.push({
    messageId: messageId,
    from: from,
    to: to,
    message: message
  })

  return { messageId: messageId };
}

/**
 * Retrieve messages that a user sent to others,
 * the number of return messages is limited by messageLimit
 *
 * @param from - sender userId
 * @param to - receiver userId
 * @param messageLimit - the number of messages to be returned
 * @returns - { messages: string[] } | Error
 */
export function getMessages(from: number, to: number, messageLimit: number): { messages: string[] } | Error {
  const data = getData();
  if (messageLimit < 1) {
    return {
      error: 'INVALID_MESSAGE_LIMIT',
      message: 'Message limit is less than 1.'
    }
  }

  if (messageLimit > 5) {
    return {
      error: 'INVALID_MESSAGE_LIMIT',
      message: 'Message limit is greater than 1.'
    }
  }

  const sender = data.users.find(u => u.userId === from);
  if (!sender) {
    return {
      error: 'INVALID_SENDER',
      message: 'Sender is not valid userId.'
    }
  }

  const receiver = data.users.find(u => u.userId === to);
  if (!receiver) {
    return {
      error: 'INVALID_RECEIVER',
      message: 'Receiver is not valid userId.'
    }
  }

  const messages = data.messages.filter(m => m.from === from && m.to === to);
  const messagesRet: string[] = [];
  for (let i = 0; i < messages.length; i++) {
    if (i <= messageLimit) {
      messagesRet.push(messages[i].message);
    }
  }
  return { messages: messagesRet.reverse() };
}
