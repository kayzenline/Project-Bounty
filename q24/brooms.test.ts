import request from 'sync-request-curl';
import { port, url } from './config.json';

const SERVER_URL = `${url}:${port}`;

export function clearRequest() {
  const res = request('DELETE', SERVER_URL + '/clear');

  return {
    status: res.statusCode,
    body: res.getJSON(),
  };
}

export function addUserRequest(role: string, username: string) {
  const res = request('POST', SERVER_URL + '/user', {
     headers: {
      role
    },
    json: {
      username,
    }
  });

  return {
    status: res.statusCode,
    body: res.getJSON(),
  };
}

export function sendMessageRequest(messageDetails: string) {
  const res = request('POST', SERVER_URL + '/message', {
    json: {
      messageDetails: messageDetails
    }
  });

  return {
    status: res.statusCode,
    body: res.getJSON(),
  };
}

export function getMessagesRequest(from: number, to: number, messageLimit: number) {
  const res = request('GET', SERVER_URL + `/message/${from}/${to}`, {
    qs: {
      messageLimit: messageLimit
    }
  });

  return {
    status: res.statusCode,
    body: res.getJSON(),
  };
}

export function editMessageRequest(messageId: number, from: number, message: string) {
  const res = request('PUT', SERVER_URL + `/message/${messageId}`, {
    json: {
      from,
      message
    }
  });

  return {
    status: res.statusCode,
    body: res.getJSON(),
  };
}

beforeEach(() => {
 clearRequest();
});

describe('addUser', () => {
  test('success', () => {
    const user = addUserRequest('moderator', 'Yuchao');
    expect(user.status).toBe(200);
    expect(user.body).toStrictEqual({
      userId: expect.any(Number),
    });
  });

  test('error -> username < 2', () => {
    const user = addUserRequest('moderator', 'Y');
    expect(user.status).toBe(400);
    expect(user.body).toStrictEqual({
      error: "INVALID_USERNAME",
      message: expect.any(String)
    });
  });

  test('error -> username > 15', () => {
    const name = 'y'.repeat(16);
    const user = addUserRequest('moderator', name);
    expect(user.status).toBe(400);
    expect(user.body).toStrictEqual({
      error: "INVALID_USERNAME",
      message: expect.any(String)
    });
  });

  test('error -> username exists', () => {
    addUserRequest('moderator', 'Yuchao');
    const user = addUserRequest('moderator', 'Yuchao');
    expect(user.status).toBe(400);
    expect(user.body).toStrictEqual({
      error: "INVALID_USERNAME",
      message: expect.any(String)
    });
  });

  test('error -> not moderator', () => {
    const user = addUserRequest('user', 'Yuchao');
    expect(user.status).toBe(401);
    expect(user.body).toStrictEqual({
      error: "UNAUTHORIZED",
      message: expect.any(String)
    });
  });
});

describe('sendMessage', () => {
  let user1;
  let user2;
  beforeEach(() => {
    clearRequest();
    user1 = addUserRequest('moderator', 'Yuchao').body;
    user2 = addUserRequest('moderator', 'Ben').body;
  });

  test('success', () => {
    const msg = sendMessageRequest(`{"from": ${user1.userId}, "to": ${user2.userId}, "message": "Hello"}`);
    expect(msg.status).toBe(200);
    expect(msg.body).toStrictEqual({
      messageId: expect.any(Number),
    });
  });

  test('error -> same sender and receiver', () => {
    const msg = sendMessageRequest(`{"from": ${user1.userId}, "to": ${user1.userId}, "message": "Hello"}`);
    expect(msg.status).toBe(400);
    expect(msg.body).toStrictEqual({
      error: "INVALID_USERNAME",
      message: expect.any(String)
    });
  });

  test('error -> invalid sender', () => {
    const msg = sendMessageRequest(`{"from": ${user2.userId + 1}, "to": ${user1.userId}, "message": "Hello"}`);
    expect(msg.status).toBe(400);
    expect(msg.body).toStrictEqual({
      error: "INVALID_SENDER",
      message: expect.any(String)
    });
  });

  test('error -> invalid receiver', () => {
    const msg = sendMessageRequest(`{"from": ${user1.userId}, "to": ${user2.userId + 1}, "message": "Hello"}`);
    expect(msg.status).toBe(400);
    expect(msg.body).toStrictEqual({
      error: "INVALID_RECEIVER",
      message: expect.any(String)
    });
  });

  test('error -> empty message', () => {
    const msg = sendMessageRequest(`{"from": ${user1.userId}, "to": ${user2.userId}, "message": ""}`);
    expect(msg.status).toBe(400);
    expect(msg.body).toStrictEqual({
      error: "INVALID_MESSAGE",
      message: expect.any(String)
    });
  });

  test('error -> message > 100', () => {
    const longMsg = 'm'.repeat(101);
    const msg = sendMessageRequest(`{"from": ${user1.userId}, "to": ${user2.userId}, "message": "${longMsg}"}`);
    expect(msg.status).toBe(400);
    expect(msg.body).toStrictEqual({
      error: "INVALID_MESSAGE",
      message: expect.any(String)
    });
  });
});

describe('getMessages', () => {
  let user1;
  let user2;
  beforeEach(() => {
    clearRequest();
    user1 = addUserRequest('moderator', 'Yuchao').body;
    user2 = addUserRequest('moderator', 'Ben').body;

    sendMessageRequest(`{"from": ${user1.userId}, "to": ${user2.userId}, "message": "Hello"}`);
    sendMessageRequest(`{"from": ${user1.userId}, "to": ${user2.userId}, "message": "Morning!"}`);
    sendMessageRequest(`{"from": ${user2.userId}, "to": ${user1.userId}, "message": "Hi"}`);
  });

  test('success', () => {
    const messages = getMessagesRequest(user1.userId, user2.userId, 3);
    expect(messages.status).toBe(200);
    expect(messages.body).toStrictEqual({
      messages: [
        "Morning!",
        "Hello"
      ]
    });
  });

  test('error -> messageLimit < 1', () => {
    const messages = getMessagesRequest(user1.userId, user2.userId, 0);
    expect(messages.status).toBe(400);
    expect(messages.body).toStrictEqual({
      error: "INVALID_MESSAGE_LIMIT",
      message: expect.any(String)
    });
  });

  test('error -> messageLimit < 1', () => {
    const messages = getMessagesRequest(user1.userId, user2.userId, 0);
    expect(messages.status).toBe(400);
    expect(messages.body).toStrictEqual({
      error: "INVALID_MESSAGE_LIMIT",
      message: expect.any(String)
    });
  });

  test('error -> messageLimit > 5', () => {
    const messages = getMessagesRequest(user1.userId, user2.userId, 6);
    expect(messages.status).toBe(400);
    expect(messages.body).toStrictEqual({
      error: "INVALID_MESSAGE_LIMIT",
      message: expect.any(String)
    });
  });

  test('error -> invalid sender', () => {
    const messages = getMessagesRequest(user2.userId + 1, user1.userId, 3);
    expect(messages.status).toBe(400);
    expect(messages.body).toStrictEqual({
      error: "INVALID_SENDER",
      message: expect.any(String)
    });
  });

  test('error -> invalid receiver', () => {
    const messages = getMessagesRequest(user1.userId, user2.userId + 1, 3);
    expect(messages.status).toBe(400);
    expect(messages.body).toStrictEqual({
      error: "INVALID_RECEIVER",
      message: expect.any(String)
    });
  });
});

describe('editMessages', () => {
  let user1;
  let user2;
  let msg1;
  beforeEach(() => {
    clearRequest();
    user1 = addUserRequest('moderator', 'Yuchao').body;
    user2 = addUserRequest('moderator', 'Ben').body;

    msg1 = sendMessageRequest(`{"from": ${user1.userId}, "to": ${user2.userId}, "message": "Hello"}`).body;
  });

  test('success', () => {
    const messages = editMessageRequest(msg1.messageId, user1.userId, "Hello!");
    expect(messages.status).toBe(200);
    expect(messages.body).toStrictEqual({
      message: "Hello!"
    });
  });

  test('error -> invalid sender', () => {
    const messages = editMessageRequest(msg1.messageId, user2.userId + 1, "Hello!");
    expect(messages.status).toBe(400);
    expect(messages.body).toStrictEqual({
      error: "INVALID_SENDER",
      message: expect.any(String)
    });
  });

  test('error -> empty message', () => {
    const messages = editMessageRequest(msg1.messageId, user1.userId, "");
    expect(messages.status).toBe(400);
    expect(messages.body).toStrictEqual({
      error: "INVALID_MESSAGE",
      message: expect.any(String)
    });
  });

  test('error -> message > 100', () => {
    const longMsg = 'y'.repeat(101);
    const messages = editMessageRequest(msg1.messageId, user1.userId, longMsg);
    expect(messages.status).toBe(400);
    expect(messages.body).toStrictEqual({
      error: "INVALID_MESSAGE",
      message: expect.any(String)
    });
  });

  test('error -> not sent by sender', () => {
    const messages = editMessageRequest(msg1.messageId, user2.userId, "Hi!");
    expect(messages.status).toBe(403);
    expect(messages.body).toStrictEqual({
      error: "FORBIDDEN",
      message: expect.any(String)
    });
  });
});
