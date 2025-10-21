import { v4 as uuid } from 'uuid';
import request from 'sync-request-curl';
import { userLogin, userRegister, clearRequest, createAstronautId, getAstronautInfo } from './requestHelpers';
import config from '../../src/config.json';

const { port, url } = config;
const SERVER_URL = `${url}:${port}`;

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

describe('GET /v1/admin/astronaut/:astronautid', () => {
  test('success: returns astronaut info', () => {
    const sessionId = createUserAndLogin();
    const createRes = createAstronautId(sessionId, 'James', 'Kirk', 'Captain', 30, 70, 180);
    expect(createRes.statusCode).toBe(200);
    const astronautId = createRes.body.astronautId;

    const res = getAstronautInfo(sessionId, astronautId);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      astronautId: expect.any(Number),
      designation: 'Captain James Kirk',
      timeAdded: expect.any(Number),
      timeLastEdited: expect.any(Number),
      age: 30,
      weight: 70,
      height: 180,
      assignedMission: null
    });
  });

  test('error: missing controlUserSessionId header', () => {
    const res = getAstronautInfo('', 1);
    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ error: 'ControlUserSessionId is empty or invalid' });
  });

  test('error: invalid controlUserSessionId', () => {
    const res = getAstronautInfo('invalid-session', 1);
    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ error: 'ControlUserSessionId is empty or invalid' });
  });

  test('error: invalid astronaut ID - not a number', () => {
    const sessionId = createUserAndLogin();
    const response = request('GET', `${SERVER_URL}/v1/admin/astronaut/invalid`, {
      headers: { ControlUserSessionId: sessionId }
    });
    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.body.toString());
    expect(body).toEqual({ error: 'Invalid astronaut ID' });
  });

  test('error: invalid astronaut ID - negative number', () => {
    const sessionId = createUserAndLogin();
    const res = getAstronautInfo(sessionId, -1);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: expect.any(String) });
  });

  test('error: invalid astronaut ID - zero', () => {
    const sessionId = createUserAndLogin();
    const res = getAstronautInfo(sessionId, 0);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: expect.any(String) });
  });

  test('error: astronaut not found', () => {
    const sessionId = createUserAndLogin();
    const res = getAstronautInfo(sessionId, 999);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: expect.any(String) });
  });

  test('success: astronaut with special characters in name', () => {
    const sessionId = createUserAndLogin();
    const createRes = createAstronautId(sessionId, 'Jean-Luc', 'O\'Connor', 'Captain (Ret.)', 30, 70, 180);
    expect(createRes.statusCode).toBe(200);
    const astronautId = createRes.body.astronautId;

    const res = getAstronautInfo(sessionId, astronautId);
    expect(res.statusCode).toBe(200);
    expect(res.body.designation).toBe('Captain (Ret.) Jean-Luc O\'Connor');
  });

  test('success: multiple astronauts', () => {
    const sessionId = createUserAndLogin();

    // Create first astronaut
    const createRes1 = createAstronautId(sessionId, 'James', 'Kirk', 'Captain', 30, 70, 180);
    expect(createRes1.statusCode).toBe(200);
    const astronautId1 = createRes1.body.astronautId;

    // Create second astronaut
    const createRes2 = createAstronautId(sessionId, 'Spock', 'Vulcan', 'Commander', 35, 75, 185);
    expect(createRes2.statusCode).toBe(200);
    const astronautId2 = createRes2.body.astronautId;

    // Get first astronaut
    const res1 = getAstronautInfo(sessionId, astronautId1);
    expect(res1.statusCode).toBe(200);
    expect(res1.body.designation).toBe('Captain James Kirk');

    // Get second astronaut
    const res2 = getAstronautInfo(sessionId, astronautId2);
    expect(res2.statusCode).toBe(200);
    expect(res2.body.designation).toBe('Commander Spock Vulcan');
  });

  test('success: astronaut with boundary values', () => {
    const sessionId = createUserAndLogin();
    const createRes = createAstronautId(sessionId, 'Test', 'User', 'Captain', 20, 100, 150);
    expect(createRes.statusCode).toBe(200);
    const astronautId = createRes.body.astronautId;

    const res = getAstronautInfo(sessionId, astronautId);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      astronautId: expect.any(Number),
      designation: 'Captain Test User',
      timeAdded: expect.any(Number),
      timeLastEdited: expect.any(Number),
      age: 20,
      weight: 100,
      height: 150,
      assignedMission: null
    });
  });

  test('success: verify timestamps are reasonable', () => {
    const sessionId = createUserAndLogin();
    const beforeCreate = Math.floor(Date.now() / 1000);

    const createRes = createAstronautId(sessionId, 'James', 'Kirk', 'Captain', 30, 70, 180);
    expect(createRes.statusCode).toBe(200);
    const astronautId = createRes.body.astronautId;

    const afterCreate = Math.floor(Date.now() / 1000);
    const res = getAstronautInfo(sessionId, astronautId);
    expect(res.statusCode).toBe(200);

    expect(res.body.timeAdded).toBeGreaterThanOrEqual(beforeCreate);
    expect(res.body.timeAdded).toBeLessThanOrEqual(afterCreate);
    expect(res.body.timeLastEdited).toBeGreaterThanOrEqual(beforeCreate);
    expect(res.body.timeLastEdited).toBeLessThanOrEqual(afterCreate);
  });
});
