import { userRegister, updateControlUserPassword, clearRequest, userLogin } from './requestHelpers';

let sessionId1: string;
let userEmail: string;

beforeEach(() => {
  // Clear the database using the API
  clearRequest();

  // Register a new user for testing
  const uniqueEmail = `user${Date.now()}@test.com`;
  userEmail = uniqueEmail;
  const res1 = userRegister(uniqueEmail, 'StrongPass123', 'Bill', 'Ryker');
  sessionId1 = res1.body.controlUserSessionId;
});
describe('HTTP tests for ControlUserPasswordUpdate', () => {
  test('header is invalid', () => {
    const res = updateControlUserPassword('', 'StrongPass123', 'NewPass123');
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe('ControlUserSessionId is invalid');
    expect(res.body.errorCategory).toBe('INVALID_CREDENTIALS');
  });

  test('User not found', () => {
    const res = updateControlUserPassword('999', 'StrongPass123', 'NewPass123');
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe('invalid user');
    expect(res.body.errorCategory).toBe('INVALID_CREDENTIALS');
  });

  test('wrong old password', () => {
    const res = updateControlUserPassword(sessionId1, 'abcdefg111', '1234%$#@ac');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('wrong old password');
    expect(res.body.errorCategory).toBe('BAD_INPUT');
  });

  test('same as old', () => {
    const res = updateControlUserPassword(sessionId1, 'StrongPass123', 'StrongPass123');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('same as old');
    expect(res.body.errorCategory).toBe('BAD_INPUT');
  });

  test('weak password', () => {
    const res = updateControlUserPassword(sessionId1, 'StrongPass123', '000');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('weak password');
    expect(res.body.errorCategory).toBe('BAD_INPUT');
  });

  test('password reused', () => {
    const res1 = updateControlUserPassword(sessionId1, 'StrongPass123', 'Abcd1234567!!');
    expect(res1.statusCode).toBe(200);
    const loginRes = userLogin(userEmail, 'Abcd1234567!!');
    const newSessionId = loginRes.body.controlUserSessionId;
    const res2 = updateControlUserPassword(newSessionId, 'Abcd1234567!!', 'StrongPass123');
    expect(res2.statusCode).toBe(400);
    expect(res2.body.error).toBe('password reused');
    expect(res2.body.errorCategory).toBe('BAD_INPUT');
  });

  test('request successfully', () => {
    const res1 = updateControlUserPassword(sessionId1, 'StrongPass123', 'Abcd1234567!!');
    expect(res1.statusCode).toBe(200);
    const loginRes = userLogin(userEmail, 'Abcd1234567!!');
    const newSessionId = loginRes.body.controlUserSessionId;
    const res2 = updateControlUserPassword(newSessionId, 'Abcd1234567!!', '1234abcd!!@@kkk');
    expect(res2.statusCode).toBe(200);
    expect(res2.body).toEqual({});
  });
});
