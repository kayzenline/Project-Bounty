import fs from 'fs';
import path from 'path';
import request from 'sync-request-curl';
const SERVER_URL = 'http://127.0.0.1:4900';
const DB_PATH = path.join(__dirname, '../../src/db.json');
import { loadData, DataStore } from '../../src/dataStore';
import { adminAuthUserRegisterRequest, updateUserDetails } from './requestHelpers';
let sessionId1: string;
let sessionId2: string;
let userEmail1: string;
let userEmail2: string;
beforeEach(() => {
  const initialData: DataStore = {
    controlUsers: [],
    spaceMissions: [],
    nextControlUserId: 1,
    nextMissionId: 1,
    nextAstronautId: 1,
    sessions: [],
    astronauts: [],
  };

  fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
  loadData();
  const uniqueEmail = `user${Date.now()}@test.com`;
  userEmail1 = uniqueEmail;
  const res1 = adminAuthUserRegisterRequest(uniqueEmail, 'abcdefg123', 'Bill', 'Ryker');
  sessionId1 = res1.body.controlUserSessionId;
  const uniqueEmail2 = `kitty${Date.now()}@qq.com`;
  userEmail2 = uniqueEmail2;
  const res2 = adminAuthUserRegisterRequest(uniqueEmail2, 'Kitty123456', 'Kitty', 'Tan');
  sessionId2 = res2.body.controlUserSessionId;
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
    const res = updateUserDetails('999', '1234@qq.com', 'Ka', 'Ka');
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe('controlUserId not found');
    expect(res.body.errorCategory).toBe('INVALID_CREDENTIALS');
  });
  test('email is invalid', () => {
    const res = updateUserDetails(sessionId1, 'emailxxx', 'Bill', 'Ryker');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('this email is invalid');
    expect(res.body.errorCategory).toBe('BAD_INPUT');
  });
  test('name is invalid', () => {
    const res = updateUserDetails(sessionId1, 'kitty123@qq.com', '', '');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('this name is invalid');
    expect(res.body.errorCategory).toBe('BAD_INPUT');
  });
  test('email already exists', () => {
    const res = updateUserDetails(sessionId2, userEmail1, 'Kitty', 'Tan');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('excluding the current authorised user');
    expect(res.body.errorCategory).toBe('BAD_INPUT');
  });
  test('request successfully ', () => {
    const uniqueNewEmail = `newemail${Date.now()}@test.com`;
    const res = updateUserDetails(sessionId2, uniqueNewEmail, 'Bill', 'Ryker');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({});
  });
});
