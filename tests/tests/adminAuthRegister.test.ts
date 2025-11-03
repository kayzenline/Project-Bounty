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


  const invalidNameValue = [
    { nameFirst: 'John!', nameLast: 'Doe'},
    { nameFirst: 'John', nameLast: 'Doe!'},
    { nameFirst: 'John', nameLast: 'D'},
    { nameFirst: 'J', nameLast: 'Doe'},
    { nameFirst: 'John'.repeat(20), nameLast: 'Doe'},
    { nameFirst: 'John!', nameLast: 'Doe'.repeat(20)}
  ];
  test.each(invalidNameValue)('invalid name', ({ nameFirst, nameLast }) => {
    const res = adminAuthUserRegisterRequest(uniqueEmail('nfchars'), 'abc12345', nameFirst, nameLast);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: expect.any(String) });
  });

  const invalidPasswordValue = [
    'abcdefgh',
    '12345678',
    'abc123'
  ];
  test.each(invalidPasswordValue)('invalid password', (password) => {
    const res = adminAuthUserRegisterRequest(uniqueEmail('pnonum'), password, 'John', 'Doe');
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: expect.any(String) });
  });
});
