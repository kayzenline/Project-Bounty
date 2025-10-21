import fs from 'fs';
import path from 'path';
import request from 'sync-request-curl';
const SERVER_URL = "http://127.0.0.1:4900";
const DB_PATH = path.join(__dirname, '../../src/db.json');
import { loadData,DataStore } from '../../src/dataStore';
let sessionId: string;
let userEmail: string;
beforeEach(() => {
  const initialData: DataStore = {
    controlUsers: [],
    spaceMissions: [],
    nextControlUserId: 1,
    nextMissionId: 1,
    sessions: [],
  };
  fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
  loadData();
  const uniqueEmail = `user${Date.now()}@test.com`
  userEmail = uniqueEmail;
  const res = request('POST', `${SERVER_URL}/v1/admin/auth/register`, {
    json: {
      email: uniqueEmail,
      password: 'abcdefg123',
      nameFirst: 'Bill',
      nameLast: 'Ryker',
    },
  });

  const body = JSON.parse(res.body.toString());
  sessionId = body.controlUserSessionId; 
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
    const res = request('GET', `${SERVER_URL}/v1/admin/controluser/details`, {
      headers: { ControlUserSessionId: '999' } 
    });
    const body = JSON.parse(res.body.toString());
    expect(res.statusCode).toBe(401);
    expect(body.error).toBe('User not found');
    expect(body.errorCategory).toBe('INVALID_CREDENTIALS'); 
  });

  test('request successfully ', () => {
    const res = request('GET', `${SERVER_URL}/v1/admin/controluser/details`, {
      headers: { ControlUserSessionId: sessionId } 
    });
    const body = JSON.parse(res.body.toString());
    const user = body.user;
    expect(res.statusCode).toBe(200);
    expect(user.controlUserId).toBeGreaterThan(0);
    expect(user.email).toBe(userEmail);
    expect(user.name).toBe('Bill Ryker'); 
    expect(user.numSuccessfulLogins).toBe(2);
    expect(user.numFailedPasswordsSinceLastLogin).toBe(0);
  });

});
