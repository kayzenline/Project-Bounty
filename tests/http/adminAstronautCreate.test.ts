import { v4 as uuid } from 'uuid';
import { userLogin, userRegister, clearRequest, createAstronautId } from './requestHelpers';

beforeEach(() => {
  const res = clearRequest();
  expect(res.statusCode).toBe(200);
});

function uniqueEmail(prefix = 'user') {
  return `${prefix}.${uuid()}@example.com`;
}

function createUserAndLogin() {
  const email = uniqueEmail('astronaut-test');
  const reg = userRegister(email, 'Abcd1234', 'John', 'Doe');
  expect(reg.statusCode).toBe(200);
  const login = userLogin(email, 'Abcd1234');
  expect(login.statusCode).toBe(200);
  return login.body.controlUserSessionId;
}

describe('POST /v1/admin/astronaut', () => {
  test('success: creates astronaut with valid data', () => {
    const sessionId = createUserAndLogin();
    const res = createAstronautId(sessionId, 'James', 'Kirk', 'Captain', 30, 70, 180);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ astronautId: expect.any(Number) });
  });

  test('error: missing controlUserSessionId header', () => {
    const res = createAstronautId('', 'James', 'Kirk', 'Captain', 30, 70, 180);
    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ error: 'ControlUserSessionId is empty or invalid' });
  });

  test('error: invalid controlUserSessionId', () => {
    const res = createAstronautId('invalid-session', 'James', 'Kirk', 'Captain', 30, 70, 180);
    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ error: 'ControlUserSessionId is empty or invalid' });
  });

  test('error: duplicate astronaut name', () => {
    const sessionId = createUserAndLogin();
    const res1 = createAstronautId(sessionId, 'James', 'Kirk', 'Captain', 30, 70, 180);
    expect(res1.statusCode).toBe(200);

    const res2 = createAstronautId(sessionId, 'James', 'Kirk', 'Commander', 35, 75, 185);
    expect(res2.statusCode).toBe(400);
    expect(res2.body).toEqual({ error: expect.any(String) });
  });

  test('error: invalid first name - too short', () => {
    const sessionId = createUserAndLogin();
    const res = createAstronautId(sessionId, 'J', 'Kirk', 'Captain', 30, 70, 180);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: expect.any(String) });
  });

  test('error: invalid first name - too long', () => {
    const sessionId = createUserAndLogin();
    const res = createAstronautId(sessionId, 'A'.repeat(21), 'Kirk', 'Captain', 30, 70, 180);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: expect.any(String) });
  });

  test('error: invalid first name - invalid characters', () => {
    const sessionId = createUserAndLogin();
    const res = createAstronautId(sessionId, 'James123', 'Kirk', 'Captain', 30, 70, 180);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: expect.any(String) });
  });

  test('error: invalid last name - too short', () => {
    const sessionId = createUserAndLogin();
    const res = createAstronautId(sessionId, 'James', 'K', 'Captain', 30, 70, 180);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: expect.any(String) });
  });

  test('error: invalid last name - too long', () => {
    const sessionId = createUserAndLogin();
    const res = createAstronautId(sessionId, 'James', 'K'.repeat(21), 'Captain', 30, 70, 180);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: expect.any(String) });
  });

  test('error: invalid last name - invalid characters', () => {
    const sessionId = createUserAndLogin();
    const res = createAstronautId(sessionId, 'James', 'Kirk123', 'Captain', 30, 70, 180);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: expect.any(String) });
  });

  test('error: invalid rank - too short', () => {
    const sessionId = createUserAndLogin();
    const res = createAstronautId(sessionId, 'James', 'Kirk', 'Cap', 30, 70, 180);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: expect.any(String) });
  });

  test('error: invalid rank - too long', () => {
    const sessionId = createUserAndLogin();
    const res = createAstronautId(sessionId, 'James', 'Kirk', 'A'.repeat(51), 30, 70, 180);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: expect.any(String) });
  });

  test('error: invalid rank - invalid characters', () => {
    const sessionId = createUserAndLogin();
    const res = createAstronautId(sessionId, 'James', 'Kirk', 'Captain123', 30, 70, 180);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: expect.any(String) });
  });

  test('error: invalid age - too young', () => {
    const sessionId = createUserAndLogin();
    const res = createAstronautId(sessionId, 'James', 'Kirk', 'Captain', 19, 70, 180);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: expect.any(String) });
  });

  test('error: invalid age - too old', () => {
    const sessionId = createUserAndLogin();
    const res = createAstronautId(sessionId, 'James', 'Kirk', 'Captain', 61, 70, 180);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: expect.any(String) });
  });

  test('error: invalid age - not integer', () => {
    const sessionId = createUserAndLogin();
    const res = createAstronautId(sessionId, 'James', 'Kirk', 'Captain', 30.5, 70, 180);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: expect.any(String) });
  });

  test('error: invalid weight - too heavy', () => {
    const sessionId = createUserAndLogin();
    const res = createAstronautId(sessionId, 'James', 'Kirk', 'Captain', 30, 101, 180);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: expect.any(String) });
  });

  test('error: invalid weight - negative', () => {
    const sessionId = createUserAndLogin();
    const res = createAstronautId(sessionId, 'James', 'Kirk', 'Captain', 30, -1, 180);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: expect.any(String) });
  });

  test('error: invalid height - too short', () => {
    const sessionId = createUserAndLogin();
    const res = createAstronautId(sessionId, 'James', 'Kirk', 'Captain', 30, 70, 149);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: expect.any(String) });
  });

  test('error: invalid height - too tall', () => {
    const sessionId = createUserAndLogin();
    const res = createAstronautId(sessionId, 'James', 'Kirk', 'Captain', 30, 70, 201);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: expect.any(String) });
  });

  test('success: valid rank with parentheses and apostrophes', () => {
    const sessionId = createUserAndLogin();
    const res = createAstronautId(sessionId, 'James', 'O\'Connor', 'Captain (Ret.)', 30, 70, 180);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ astronautId: expect.any(Number) });
  });

  test('success: valid names with hyphens and apostrophes', () => {
    const sessionId = createUserAndLogin();
    const res = createAstronautId(sessionId, 'Jean-Luc', 'O\'Brien', 'Captain', 30, 70, 180);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ astronautId: expect.any(Number) });
  });

  test('success: boundary values for age', () => {
    const sessionId = createUserAndLogin();
    const res = createAstronautId(sessionId, 'James', 'Kirk', 'Captain', 20, 70, 180);
    expect(res.statusCode).toBe(200);

    const res2 = createAstronautId(sessionId, 'James', 'Spock', 'Commander', 60, 70, 180);
    expect(res2.statusCode).toBe(200);
  });

  test('success: boundary values for weight', () => {
    const sessionId = createUserAndLogin();
    const res = createAstronautId(sessionId, 'James', 'Kirk', 'Captain', 30, 100, 180);
    expect(res.statusCode).toBe(200);
  });

  test('success: boundary values for height', () => {
    const sessionId = createUserAndLogin();
    const res = createAstronautId(sessionId, 'James', 'Kirk', 'Captain', 30, 70, 150);
    expect(res.statusCode).toBe(200);

    const res2 = createAstronautId(sessionId, 'James', 'Spock', 'Commander', 30, 70, 200);
    expect(res2.statusCode).toBe(200);
  });
});
