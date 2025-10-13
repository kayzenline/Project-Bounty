import fs from 'fs';
import path from 'path';
import request from 'sync-request-curl';
const SERVER_URL = "http://127.0.0.1:3200";
const DB_PATH = path.join(__dirname, '../../src/db.json');
import { loadData,DataStore } from '../../src/dataStore';
let sessionId1: number;
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
  const res1 = request('POST', `${SERVER_URL}/v1/admin/auth/register`, {
    json: {
      email: 'strongbeard@starfleet.com.au',
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

  test('sesionid is not a number', () => {
    const res = request('PUT', `${SERVER_URL}/v1/admin/controluser/password`, {
      headers: { ControlUserSessionId: 'aaa' },
      json:{email:'1234@qq.com',nameFirst:'Ka',nameLast:'Ka'}
    });
    const body = JSON.parse(res.body.toString());
    expect(res.statusCode).toBe(401);
    expect(body.error).toBe('ControlUserSessionId is not a number');
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
      headers: { ControlUserSessionId: String(sessionId1) },
      json: { oldPassword:'abcdefg111',newPassword:'1234%$#@ac'}
    });
    const body = JSON.parse(res.body.toString());
    expect(res.statusCode).toBe(400);
    expect(body.error).toBe('wrong old password');
    expect(body.errorCategory).toBe('BAD_INPUT');
  });
  test('same as old', () => {
    const res = request('PUT', `${SERVER_URL}/v1/admin/controluser/password`, {
      headers: { ControlUserSessionId: String(sessionId1) },
      json: { oldPassword:'StrongPass123',newPassword:'StrongPass123'}
    });
    const body = JSON.parse(res.body.toString());
    expect(res.statusCode).toBe(400);
    expect(body.error).toBe('same as old');
    expect(body.errorCategory).toBe('BAD_INPUT');
  });
  test('weak password', () => {
    const res = request('PUT', `${SERVER_URL}/v1/admin/controluser/password`, {
      headers: { ControlUserSessionId: String(sessionId1) },
      json: { oldPassword:'StrongPass123',newPassword:'000'}
    });
    const body = JSON.parse(res.body.toString());
    expect(res.statusCode).toBe(400);
    expect(body.error).toBe('weak password');
    expect(body.errorCategory).toBe('BAD_INPUT');
  });
  test('password reused', () => {
    const res = request('PUT', `${SERVER_URL}/v1/admin/controluser/password`, {
      headers: { ControlUserSessionId: String(sessionId1) },
      json: { oldPassword:'StrongPass123',newPassword:'123456789'}
    });
    const body = JSON.parse(res.body.toString());
    expect(res.statusCode).toBe(400);
    expect(body.error).toBe('password reused');
    expect(body.errorCategory).toBe('BAD_INPUT');
  });
  test('request successfully ', () => {
    const res = request('PUT', `${SERVER_URL}/v1/admin/controluser/password`, {
      headers: { ControlUserSessionId: String(sessionId1) },
      json: { oldPassword:'StrongPass123',newPassword:'1234abcd!!@@kkk'}
    });
    const body = JSON.parse(res.body.toString());
    expect(res.statusCode).toBe(200);
    expect(body).toEqual({});
  });

});