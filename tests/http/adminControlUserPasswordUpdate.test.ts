import fs from 'fs';
import path from 'path';
import request from 'sync-request-curl';
const SERVER_URL = "http://127.0.0.1:4900";
const DB_PATH = path.join(__dirname, '../../src/db.json');
import { loadData,DataStore } from '../../src/dataStore';
let sessionId1: string;
let userEmail: string;
beforeEach(() => {
  const initialData :DataStore= {
    controlUsers: [],
    spaceMissions: [],
    nextControlUserId: 1,
    nextMissionId: 1,
    sessions: [],
  };

  fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
  loadData();
  const uniqueEmail = `user${Date.now()}@test.com`;
  userEmail = uniqueEmail; 
  const res1 = request('POST', `${SERVER_URL}/v1/admin/auth/register`, {
    json: {
      email: uniqueEmail,
      password: 'StrongPass123',
      nameFirst: 'Bill',
      nameLast: 'Ryker',
    },
  });
  const body1 = JSON.parse(res1.body.toString());
  sessionId1 = body1.controlUserSessionId;
});
describe('HTTP tests for ControlUserPasswordUpdate', () => {

  test('header is invalid', () => {
    const res = request('PUT', `${SERVER_URL}/v1/admin/controluser/password`,{
      json:{email:'1234@qq.com',nameFirst:'Ka',nameLast:'Ka'}
    });
    const body = JSON.parse(res.body.toString());
    expect(res.statusCode).toBe(401);
    expect(body.error).toBe('ControlUserSessionId is invalid');
    expect(body.errorCategory).toBe('INVALID_CREDENTIALS'); 
  });

  test('User not found', () => {
    const res = request('PUT', `${SERVER_URL}/v1/admin/controluser/password`, {
      headers: { ControlUserSessionId: '999' } ,
      json:{email:'1234@qq.com',nameFirst:'Ka',nameLast:'Ka'}
    });
    const body = JSON.parse(res.body.toString());
    expect(res.statusCode).toBe(401);
    expect(body.error).toBe('invalid user');
    expect(body.errorCategory).toBe('INVALID_CREDENTIALS'); 
  });
  
  test('wrong old password', () => {
    const res = request('PUT', `${SERVER_URL}/v1/admin/controluser/password`, {
      headers: { ControlUserSessionId: sessionId1 },
      json: { oldPassword:'abcdefg111',newPassword:'1234%$#@ac'}
    });
    const body = JSON.parse(res.body.toString());
    expect(res.statusCode).toBe(400);
    expect(body.error).toBe('wrong old password');
    expect(body.errorCategory).toBe('BAD_INPUT');
  });
  
  test('same as old', () => {
    const res = request('PUT', `${SERVER_URL}/v1/admin/controluser/password`, {
      headers: { ControlUserSessionId: sessionId1},
      json: { oldPassword:'StrongPass123',newPassword:'StrongPass123'}
    });
    const body = JSON.parse(res.body.toString());
    expect(res.statusCode).toBe(400);
    expect(body.error).toBe('same as old');
    expect(body.errorCategory).toBe('BAD_INPUT');
  });
  
  test('weak password', () => {
    const res = request('PUT', `${SERVER_URL}/v1/admin/controluser/password`, {
      headers: { ControlUserSessionId: sessionId1},
      json: { oldPassword:'StrongPass123',newPassword:'000'}
    });
    const body = JSON.parse(res.body.toString());
    expect(res.statusCode).toBe(400);
    expect(body.error).toBe('weak password');
    expect(body.errorCategory).toBe('BAD_INPUT');
  });
  
  test('password reused', () => {
    const res1 = request('PUT', `${SERVER_URL}/v1/admin/controluser/password`, {
      headers: { ControlUserSessionId: sessionId1 },
      json: { oldPassword: 'StrongPass123', newPassword: 'Abcd1234567!!' }
    });
    expect(res1.statusCode).toBe(200);
    const loginRes = request('POST', `${SERVER_URL}/v1/admin/auth/login`, {
      json: {
        email: userEmail,
        password: 'Abcd1234567!!'
      }
    });
    const loginBody = JSON.parse(loginRes.body.toString());
    const newSessionId = loginBody.controlUserSessionId;
    const res2 = request('PUT', `${SERVER_URL}/v1/admin/controluser/password`, {
      headers: { ControlUserSessionId: newSessionId }, 
      json: { oldPassword:'Abcd1234567!!', newPassword:'StrongPass123'}
    });
    const body2 = JSON.parse(res2.body.toString());
    expect(res2.statusCode).toBe(400);
    expect(body2.error).toBe('password reused');
    expect(body2.errorCategory).toBe('BAD_INPUT');
  });  
  
  test('request successfully', () => {
    const res1 = request('PUT', `${SERVER_URL}/v1/admin/controluser/password`, {
      headers: { ControlUserSessionId: sessionId1 },
      json: { oldPassword: 'StrongPass123', newPassword: 'Abcd1234567!!' }
    });
    expect(res1.statusCode).toBe(200);
    const loginRes = request('POST', `${SERVER_URL}/v1/admin/auth/login`, {
      json: {
        email: userEmail,
        password: 'Abcd1234567!!'
      }
    });
    const loginBody = JSON.parse(loginRes.body.toString());
    const newSessionId = loginBody.controlUserSessionId;
    const res2 = request('PUT', `${SERVER_URL}/v1/admin/controluser/password`, {
      headers: { ControlUserSessionId: newSessionId }, 
      json: { oldPassword:'Abcd1234567!!', newPassword:'1234abcd!!@@kkk'}
    });
    const body2 = JSON.parse(res2.body.toString());
    expect(res2.statusCode).toBe(200);
    expect(body2).toEqual({});
  });

});  