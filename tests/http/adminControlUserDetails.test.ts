import fs from 'fs';
import path from 'path';
import request from 'sync-request-curl';
const SERVER_URL = "http://127.0.0.1:3200";
const DB_PATH = path.join(__dirname, '../../src/db.json');
import { loadData,DataStore } from '../../src/dataStore';
let sessionId: number;
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

  const res = request('POST', `${SERVER_URL}/v1/admin/auth/register`, {
    json: {
      email: 'strongbeard@starfleet.com.au',
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

  test('sesionid is not a number', () => {
    const res = request('GET', `${SERVER_URL}/v1/admin/controluser/details`, {
      headers: { ControlUserSessionId: 'aaa' } 
    });
    const body = JSON.parse(res.body.toString());
    expect(res.statusCode).toBe(401);
    expect(body.error).toBe('ControlUserSessionId is not a number');
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
      headers: { ControlUserSessionId: String(sessionId) } 
    });
    const body = JSON.parse(res.body.toString());
    const user = body.user;
    expect(res.statusCode).toBe(200);
    expect(user.controlUserId).toBe(1);
    expect(user.email).toBe('strongbeard@starfleet.com.au');
    expect(user.name).toBe('Bill Ryker'); 
    expect(user.numSuccessfulLogins).toBe(0);
    expect(user.numFailedPasswordsSinceLastLogin).toBe(0);
  });

});
