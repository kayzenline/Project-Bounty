import fs from 'fs';
import path from 'path';
import request from 'sync-request-curl';
const SERVER_URL = 'http://127.0.0.1:4900';
const DB_PATH = path.join(__dirname, '../../src/db.json');
import { loadData, DataStore } from '../../src/dataStore';
import { adminAuthUserRegisterRequest, getUserDetails } from './requestHelpers';
let sessionId: string;
let userEmail: string;
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
  userEmail = uniqueEmail;
  const res = adminAuthUserRegisterRequest(uniqueEmail, 'abcdefg123', 'Bill', 'Ryker');
  sessionId = res.body.controlUserSessionId;
});

describe('HTTP tests for ControlUserdetails', () => {
  test('header is invalid', () => {
    const res = request('GET', `${SERVER_URL}/v1/admin/controluser/details`);
    const body = JSON.parse(res.body.toString());
    expect(res.statusCode).toBe(401);
    expect(body.error).toBe('ControlUserSessionId is invalid');
    expect(body.errorCategory).toBe('INVALID_CREDENTIALS');
  });

  test('User not found', () => {
    const res = getUserDetails('999');
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe('User not found');
    expect(res.body.errorCategory).toBe('INVALID_CREDENTIALS');
  });

  test('request successfully ', () => {
    const res = getUserDetails(sessionId);
    const user = res.body.user;
    expect(res.statusCode).toBe(200);
    expect(user.controlUserId).toBeGreaterThan(0);
    expect(user.email).toBe(userEmail);
    expect(user.name).toBe('Bill Ryker');
    expect(user.numSuccessfulLogins).toBe(2);
    expect(user.numFailedPasswordsSinceLastLogin).toBe(0);
  });
});
