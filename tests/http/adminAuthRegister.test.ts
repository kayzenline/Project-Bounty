import { v4 as uuid } from 'uuid';
import { adminAuthUserRegisterRequest, clearRequest } from './requestHelpers';

beforeEach(() => {
  const res = clearRequest();
  expect(res.statusCode).toBe(200);
});

function uniqueEmail(prefix = 'user') {
  return `${prefix}.${uuid().split('-').pop() || ''}@example.com`;
}

describe('POST /v1/admin/auth/register', () => {
  test('success: returns controlUserSessionId', () => {
    const email = uniqueEmail('success');
    const res = adminAuthUserRegisterRequest(email, 'abc12345', 'John', 'Doe');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ controlUserSessionId: expect.any(String) });
  });

  test('error: invalid email format', () => {
    const res = adminAuthUserRegisterRequest('invalid-email', 'abc12345', 'John', 'Doe');
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: expect.any(String) });
  });

  test('error: duplicate email', () => {
    const email = uniqueEmail('dup');
    const first = adminAuthUserRegisterRequest(email, 'abc12345', 'John', 'Doe');
    expect(first.statusCode).toBe(200);
    const res = adminAuthUserRegisterRequest(email, 'abc12345', 'John', 'Doe');
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: expect.any(String) });
  });

  test('error: nameFirst invalid characters', () => {
    const res = adminAuthUserRegisterRequest(uniqueEmail('nfchars'), 'abc12345', 'John!', 'Doe');
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: expect.any(String) });
  });

  test('error: nameFirst too short', () => {
    const res = adminAuthUserRegisterRequest(uniqueEmail('nfshort'), 'abc12345', 'A', 'Doe');
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: expect.any(String) });
  });

  test('error: nameLast invalid characters', () => {
    const res = adminAuthUserRegisterRequest(uniqueEmail('nlchars'), 'abc12345', 'John', 'Doe!');
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: expect.any(String) });
  });

  test('error: nameLast too long', () => {
    const longName = 'A'.repeat(21);
    const res = adminAuthUserRegisterRequest(uniqueEmail('nllong'), 'abc12345', 'John', longName);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: expect.any(String) });
  });

  test('error: password too short', () => {
    const res = adminAuthUserRegisterRequest(uniqueEmail('pshort'), 'a1b2c3', 'John', 'Doe');
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: expect.any(String) });
  });

  test('error: password lacks number', () => {
    const res = adminAuthUserRegisterRequest(uniqueEmail('pnonum'), 'abcdefgh', 'John', 'Doe');
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: expect.any(String) });
  });

  test('error: password lacks letter', () => {
    const res = adminAuthUserRegisterRequest(uniqueEmail('pnolet'), '12345678', 'John', 'Doe');
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: expect.any(String) });
  });
});
