import { userRegister, getControlUserDetails, clearRequest } from './requestHelpers';

let sessionId: string;
let userEmail: string;

beforeEach(() => {
  // Clear the database using the API
  clearRequest();

  // Register a new user for testing
  const uniqueEmail = `user${Date.now()}@test.com`;
  userEmail = uniqueEmail;
  const res = userRegister(uniqueEmail, 'abcdefg123', 'Bill', 'Ryker');
  sessionId = res.body.controlUserSessionId;
});

describe('HTTP tests for ControlUserdetails', () => {
  test('header is invalid', () => {
    const res = getControlUserDetails('');
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe('ControlUserSessionId is invalid');
    expect(res.body.errorCategory).toBe('INVALID_CREDENTIALS');
  });

  test('User not found', () => {
    const res = getControlUserDetails('999');
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe('User not found');
    expect(res.body.errorCategory).toBe('INVALID_CREDENTIALS');
  });

  test('request successfully ', () => {
    const res = getControlUserDetails(sessionId);
    const user = res.body.user;
    expect(res.statusCode).toBe(200);
    expect(user.controlUserId).toBeGreaterThan(0);
    expect(user.email).toBe(userEmail);
    expect(user.name).toBe('Bill Ryker');
    expect(user.numSuccessfulLogins).toBe(2);
    expect(user.numFailedPasswordsSinceLastLogin).toBe(0);
  });
});
