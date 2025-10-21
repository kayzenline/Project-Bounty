import fs from 'fs';
import path from 'path';
import request from 'sync-request-curl';
const SERVER_URL = 'http://127.0.0.1:4900';
const DB_PATH = path.join(__dirname, '../../src/db.json');
import { loadData, DataStore } from '../../src/dataStore';
let sessionId1: string;
let sessionId2: string;
let userEmail1: string;
let userEmail2: string;
beforeEach(() => {
  const initialData :DataStore = {
    controlUsers: [],
    spaceMissions: [],
    astronauts: [],
    nextControlUserId: 1,
    nextMissionId: 1,
    nextAstronautId: 1,
    sessions: [],
  };

  fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
  loadData();
  const uniqueEmail = `user${Date.now()}@test.com`;
  userEmail1 = uniqueEmail;
  const res1 = request('POST', `${SERVER_URL}/v1/admin/auth/register`, {
    json: {
      email: uniqueEmail,
      password: 'abcdefg123',
      nameFirst: 'Bill',
      nameLast: 'Ryker',
    },
  });
  const body1 = JSON.parse(res1.body.toString());
  sessionId1 = body1.controlUserSessionId;
  const uniqueEmail2 = `kitty${Date.now()}@qq.com`;
  userEmail2 = uniqueEmail2;
  const res2 = request('POST', `${SERVER_URL}/v1/admin/auth/register`, {
    json: {
      email: uniqueEmail2,
      password: 'Kitty123456',
      nameFirst: 'Kitty',
      nameLast: 'Tan',
    },
  });
  const body2 = JSON.parse(res2.body.toString());
  sessionId2 = body2.controlUserSessionId;
});
describe('HTTP tests for ControlUserdetailsUpdate', () => {
  test('header is invalid', () => {
    const res = request('PUT', `${SERVER_URL}/v1/admin/controluser/details`, {
      json: { email: '1234@qq.com', nameFirst: 'Ka', nameLast: 'Ka' }
    });
    const body = JSON.parse(res.body.toString());
    expect(res.statusCode).toBe(401);
    expect(body.error).toBe('ControlUserSessionId is invalid');
    expect(body.errorCategory).toBe('INVALID_CREDENTIALS');
  });

  test('User not found', () => {
    const res = request('PUT', `${SERVER_URL}/v1/admin/controluser/details`, {
      headers: { ControlUserSessionId: '999' },
      json: { email: '1234@qq.com', nameFirst: 'Ka', nameLast: 'Ka' }
    });
    const body = JSON.parse(res.body.toString());
    expect(res.statusCode).toBe(401);
    expect(body.error).toBe('controlUserId not found');
    expect(body.errorCategory).toBe('INVALID_CREDENTIALS');
  });
  test('email is invalid', () => {
    const res = request('PUT', `${SERVER_URL}/v1/admin/controluser/details`, {
      headers: { ControlUserSessionId: sessionId1 },
      json: { email: 'emailxxx', nameFirst: 'Bill', nameLast: 'Ryker' }
    });
    const body = JSON.parse(res.body.toString());
    expect(res.statusCode).toBe(400);
    expect(body.error).toBe('this email is invalid');
    expect(body.errorCategory).toBe('BAD_INPUT');
  });
  test('name is invalid', () => {
    const res = request('PUT', `${SERVER_URL}/v1/admin/controluser/details`, {
      headers: { ControlUserSessionId: sessionId1 },
      json: { email: 'kitty123@qq.com', nameFirst: '', nameLast: '' }
    });
    const body = JSON.parse(res.body.toString());
    expect(res.statusCode).toBe(400);
    expect(body.error).toBe('this name is invalid');
    expect(body.errorCategory).toBe('BAD_INPUT');
  });
  test('email already exists', () => {
    const res = request('PUT', `${SERVER_URL}/v1/admin/controluser/details`, {
      headers: { ControlUserSessionId: sessionId2 },
      json: { email: userEmail1, nameFirst: 'Kitty', nameLast: 'Tan' }
      // wait db.json
    });
    const body = JSON.parse(res.body.toString());

    expect(res.statusCode).toBe(400);
    expect(body.error).toBe('excluding the current authorised user');
    expect(body.errorCategory).toBe('BAD_INPUT');
  });
  test('request successfully ', () => {
    const uniqueNewEmail = `newemail${Date.now()}@test.com`;
    const res = request('PUT', `${SERVER_URL}/v1/admin/controluser/details`, {
      headers: { ControlUserSessionId: sessionId2 },
      json: { email: uniqueNewEmail, nameFirst: 'Bill', nameLast: 'Ryker' }
    });
    const body = JSON.parse(res.body.toString());
    expect(res.statusCode).toBe(200);
    expect(body).toEqual({});
  });
});
