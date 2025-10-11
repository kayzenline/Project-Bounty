import fs from 'fs';
import path from 'path';
import request from 'sync-request-curl';
const SERVER_URL = "http://127.0.0.1:3200";
const DB_PATH = path.join(__dirname, '../../src/db.json');
import { loadData } from '../../src/dataStore';
//initial for db
beforeEach(() => {
  const initialData = {
    controlUsers: [
      {
        controlUserId: 1,
        email: 'strongbeard@starfleet.com.au',
        password: 'abcdefg123',
        nameFirst: 'Bill',
        nameLast: 'Ryker',
        numSuccessfulLogins: 3,
        numFailedPasswordsSinceLastLogin: 1,
        passwordHistory: ['abcdefg123'],
      },
      {
        controlUserId: 2,
        email: 'kitty@qq.com',
        password: '123456789',
        nameFirst: 'Kitty',
        nameLast: 'Tan',
        numSuccessfulLogins: 0,
        numFailedPasswordsSinceLastLogin: 0,
        passwordHistory: ['123456789'],
      }
    ],

  };
  fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
  loadData();
});
describe('HTTP tests for ControlUserPasswordUpdate', () => {

  test('header is invalid', () => {
    const res = request('PUT', `${SERVER_URL}/v1/admin/controluser/details`,{
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
      headers: { ControlUserSessionId: '1' },
      json: { oldPassword:'abcdefg111',newPassword:'1234%$#@ac'}
    });
    const body = JSON.parse(res.body.toString());
    expect(res.statusCode).toBe(400);
    expect(body.error).toBe('wrong old password');
    expect(body.errorCategory).toBe('BAD_INPUT');
  });
  test('same as old', () => {
    const res = request('PUT', `${SERVER_URL}/v1/admin/controluser/password`, {
      headers: { ControlUserSessionId: '1' },
      json: { oldPassword:'abcdefg123',newPassword:'abcdefg123'}
    });
    const body = JSON.parse(res.body.toString());
    expect(res.statusCode).toBe(400);
    expect(body.error).toBe('same as old');
    expect(body.errorCategory).toBe('BAD_INPUT');
  });
  test('weak password', () => {
    const res = request('PUT', `${SERVER_URL}/v1/admin/controluser/password`, {
      headers: { ControlUserSessionId: '1' },
      json: { oldPassword:'abcdefg123',newPassword:'123'}
    });
    const body = JSON.parse(res.body.toString());
    expect(res.statusCode).toBe(400);
    expect(body.error).toBe('weak password');
    expect(body.errorCategory).toBe('BAD_INPUT');
  });
  test('password reused', () => {
    const res = request('PUT', `${SERVER_URL}/v1/admin/controluser/password`, {
      headers: { ControlUserSessionId: '1' },
      json: { oldPassword:'abcdefg123',newPassword:'123456789'}
    });
    const body = JSON.parse(res.body.toString());
    expect(res.statusCode).toBe(400);
    expect(body.error).toBe('password reused');
    expect(body.errorCategory).toBe('BAD_INPUT');
  });
  test('request successfully ', () => {
    const res = request('PUT', `${SERVER_URL}/v1/admin/controluser/password`, {
      headers: { ControlUserSessionId: '1' },
      json: { oldPassword:'abcdefg123',newPassword:'1234abcd!!@@kkk'}
    });
    const body = JSON.parse(res.body.toString());
    expect(res.statusCode).toBe(200);
    expect(body).toEqual({});
  });

});