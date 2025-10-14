import { v4 as uuid } from 'uuid';
import { userLogin, userRegister, clearRequest } from './requestHelpers';

beforeEach(() => {
  const res = clearRequest();
  expect(res.statusCode).toBe(200);
});

function uniqueEmail(prefix = 'user') {
  return `${prefix}.${uuid()}@example.com`;
}

describe('POST /v1/admin/auth/login', () => {
  test('success: returns controlUserId', () => {
    const email = uniqueEmail('login-success');
    const reg = userRegister(email, 'Abcd1234', 'John', 'Doe');
    expect(reg.statusCode).toBe(200);
    const res = userLogin(email, 'Abcd1234');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ controlUserId: expect.any(Number) });
  });

  test('error: missing password', () => {
    const email = uniqueEmail('login-missing-pw');
    const reg = userRegister(email, 'Abcd1234', 'Amy', 'Pond');
    expect(reg.statusCode).toBe(200);
    const res = userLogin(email, '');
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: expect.any(String) });
  });

  test('error: user not found', () => {
    const res = userLogin(uniqueEmail('no-user'), 'Abcd1234');
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: expect.any(String) });
  });

  test('error: incorrect password', () => {
    const email = uniqueEmail('login-wrong-pw');
    const reg = userRegister(email, 'Abcd1234', 'River', 'Song');
    expect(reg.statusCode).toBe(200);
    const res = userLogin(email, 'Wrong1234');
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: expect.any(String) });
  });
});
