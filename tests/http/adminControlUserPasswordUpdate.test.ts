import fs from 'fs';
import path from 'path';
import request from 'sync-request-curl';
const SERVER_URL = "http://127.0.0.1:4900";
const DB_PATH = path.join(__dirname, '../../src/db.json');
import { loadData,DataStore } from '../../src/dataStore';
import { userRegister, userLogin, updatePassword } from './requestHelpers'; 
let sessionId1: string;
let userEmail: string;
beforeEach(() => {
  const initialData :DataStore= {
    controlUsers: [],
    spaceMissions: [],
    nextControlUserId: 1,
    nextMissionId: 1,
    sessions: [],
    astronauts: [],
  };

  fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
  loadData();
  const uniqueEmail = `user${Date.now()}@test.com`;
  userEmail = uniqueEmail; 
  const res1 = userRegister(uniqueEmail, 'StrongPass123', 'Bill', 'Ryker');
  sessionId1 = res1.body.controlUserSessionId;
});
describe('HTTP tests for ControlUserPasswordUpdate', () => {

  test('header is invalid', () => {
    const res = request('PUT', `${SERVER_URL}/v1/admin/controluser/password`,{
      json:{oldPassword: '123456abcdefg!!', newPassword: '11223344acbdgh**'}
    });
    const body = JSON.parse(res.body.toString());
    expect(res.statusCode).toBe(401);
    expect(body.error).toBe('ControlUserSessionId is invalid');
    expect(body.errorCategory).toBe('INVALID_CREDENTIALS'); 
  });

  test('User not found', () => {
    const res = updatePassword('999', '123456abcdefg!!', '11223344acbdgh**');
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe('invalid user');
    expect(res.body.errorCategory).toBe('INVALID_CREDENTIALS'); 
  });
  
  test('wrong old password', () => {
    const res = updatePassword(sessionId1, 'abcdefg111', '1234%$#@ac');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('wrong old password');
    expect(res.body.errorCategory).toBe('BAD_INPUT');
  });
  
  test('same as old', () => {
    const res = updatePassword(sessionId1, 'StrongPass123', 'StrongPass123');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('same as old');
    expect(res.body.errorCategory).toBe('BAD_INPUT');
  });
  
  test('weak password', () => {
    const res = updatePassword(sessionId1, 'StrongPass123', '000');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('weak password');
    expect(res.body.errorCategory).toBe('BAD_INPUT');
  });
  
  test('password reused', () => {
    const res1 = updatePassword(sessionId1, 'StrongPass123', 'Abcd1234567!!');
    expect(res1.statusCode).toBe(200);
    const loginRes = userLogin(userEmail, 'Abcd1234567!!');
    const newSessionId = loginRes.body.controlUserSessionId;
    const res2 = updatePassword(newSessionId, 'Abcd1234567!!', 'StrongPass123');
    expect(res2.statusCode).toBe(400);
    expect(res2.body.error).toBe('password reused');
    expect(res2.body.errorCategory).toBe('BAD_INPUT');
  });  
  
  test('request successfully', () => {
    const res1 = updatePassword(sessionId1, 'StrongPass123', 'Abcd1234567!!');
    expect(res1.statusCode).toBe(200);
    const loginRes = userLogin(userEmail, 'Abcd1234567!!');
    const newSessionId = loginRes.body.controlUserSessionId;
    const res2 = updatePassword(newSessionId, 'Abcd1234567!!', '1234abcd!!@@kkk');
    expect(res2.statusCode).toBe(200);
    expect(res2.body).toEqual({});
  });

});  