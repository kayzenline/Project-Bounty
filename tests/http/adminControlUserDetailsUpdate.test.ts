import { userRegister, updateControlUserDetails, clearRequest } from './requestHelpers';

let sessionId1: string;
let sessionId2: string;
let userEmail1: string;
let userEmail2: string;

beforeEach(() => {
  // Clear the database using the API
  clearRequest();

  // Register first user
  const uniqueEmail = `user${Date.now()}@test.com`;
  userEmail1 = uniqueEmail;
  const res1 = userRegister(uniqueEmail, 'abcdefg123', 'Bill', 'Ryker');
  sessionId1 = res1.body.controlUserSessionId;

  // Register second user
  const uniqueEmail2 = `kitty${Date.now()}@qq.com`;
  userEmail2 = uniqueEmail2;
  const res2 = userRegister(uniqueEmail2, 'Kitty123456', 'Kitty', 'Tan');
  sessionId2 = res2.body.controlUserSessionId;
});
describe('HTTP tests for ControlUserdetailsUpdate', () => {
  test('header is invalid', () => {
    const res = updateControlUserDetails('', '1234@qq.com', 'Ka', 'Ka');
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe('ControlUserSessionId is invalid');
    expect(res.body.errorCategory).toBe('INVALID_CREDENTIALS');
  });

  test('User not found', () => {
    const res = updateControlUserDetails('999', '1234@qq.com', 'Ka', 'Ka');
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe('controlUserId not found');
    expect(res.body.errorCategory).toBe('INVALID_CREDENTIALS');
  });
  test('email is invalid', () => {
    const res = updateControlUserDetails(sessionId1, 'emailxxx', 'Bill', 'Ryker');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('this email is invalid');
    expect(res.body.errorCategory).toBe('BAD_INPUT');
  });
  test('name is invalid', () => {
    const res = updateControlUserDetails(sessionId1, 'kitty123@qq.com', '', '');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('this name is invalid');
    expect(res.body.errorCategory).toBe('BAD_INPUT');
  });
  test('email already exists', () => {
    const res = updateControlUserDetails(sessionId2, userEmail1, 'Kitty', 'Tan');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('excluding the current authorised user');
    expect(res.body.errorCategory).toBe('BAD_INPUT');
  });
  test('request successfully ', () => {
    const uniqueNewEmail = `newemail${Date.now()}@test.com`;
    const res = updateControlUserDetails(sessionId2, uniqueNewEmail, 'Bill', 'Ryker');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({});
  });
});
