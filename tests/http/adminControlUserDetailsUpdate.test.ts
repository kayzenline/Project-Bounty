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
describe('HTTP tests for ControlUserdetailsUpdate', () => {

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
    const res = request('PUT', `${SERVER_URL}/v1/admin/controluser/details`, {
      headers: { ControlUserSessionId: 'aaa' },
      json:{email:'1234@qq.com',nameFirst:'Ka',nameLast:'Ka'}
    });
    const body = JSON.parse(res.body.toString());
    expect(res.statusCode).toBe(401);
    expect(body.error).toBe('ControlUserSessionId is not a number');
    expect(body.errorCategory).toBe('INVALID_CREDENTIALS'); 
  });
  test('User not found', () => {
    const res = request('PUT', `${SERVER_URL}/v1/admin/controluser/details`, {
      headers: { ControlUserSessionId: '999' } ,
      json:{email:'1234@qq.com',nameFirst:'Ka',nameLast:'Ka'}
    });
    const body = JSON.parse(res.body.toString());
    expect(res.statusCode).toBe(401);
    expect(body.error).toBe('controlUserId not found');
    expect(body.errorCategory).toBe('INVALID_CREDENTIALS'); 
  });
  test('email is invalid', () => {
    const res = request('PUT', `${SERVER_URL}/v1/admin/controluser/details`, {
      headers: { ControlUserSessionId: '1' },
      json: { email: 'emailxxx', nameFirst: 'Bill', nameLast: 'Ryker' }
    });
    const body = JSON.parse(res.body.toString());
    expect(res.statusCode).toBe(400);
    expect(body.error).toBe('this email is invalid');
    expect(body.errorCategory).toBe('BAD_INPUT');
  });
  test('name is invalid', () => {
    const res = request('PUT', `${SERVER_URL}/v1/admin/controluser/details`, {
      headers: { ControlUserSessionId: '1' },
      json: { email: 'kitty123@qq.com', nameFirst: '', nameLast: '' }
    });
    const body = JSON.parse(res.body.toString());
    expect(res.statusCode).toBe(400);
    expect(body.error).toBe('this name is invalid');
    expect(body.errorCategory).toBe('BAD_INPUT');
  });
  test('email already exists', () => {
    const res = request('PUT', `${SERVER_URL}/v1/admin/controluser/details`, {
      headers: { ControlUserSessionId: '2' },
      json: { email: 'strongbeard@starfleet.com.au', nameFirst: 'Kitty', nameLast: 'Tan' }
      // wait db.json
    });
    const body = JSON.parse(res.body.toString());
    expect(res.statusCode).toBe(400);
    expect(body.error).toBe('excluding the current authorised user');
    expect(body.errorCategory).toBe('BAD_INPUT');
  });
  test('request successfully ', () => {
    const res = request('PUT', `${SERVER_URL}/v1/admin/controluser/details`, {
      headers: { ControlUserSessionId: '1' },
      json: { email: 'strongbeard@starfleet.com.au', nameFirst: 'Bill', nameLast: 'Ryker' }
    });
    const body = JSON.parse(res.body.toString());
    expect(res.statusCode).toBe(200);
    expect(body).toEqual({});
  });

});