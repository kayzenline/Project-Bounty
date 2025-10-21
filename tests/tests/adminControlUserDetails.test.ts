import { adminAuthRegister, adminControlUserDetails } from '../../src/auth';
import { clear } from '../../src/other';
describe('adminControlUserDetails', () => {
  beforeEach(() => {
    clear();
  });
  test('check function return correct object', () => {
    const result = adminAuthRegister('rosielover@gmail.com', 'a!b@AB1234', 'Kitty', 'Tan');
    // adminAuthRegister return {controlUserSessionId}
    const sessionId = result.controlUserSessionId;

    // Get controlUserId from session
    const { getData } = require('../../src/dataStore');
    const data = getData();
    const session = data.sessions.find(s => s.controlUserSessionId === sessionId);
    const userid = session.controlUserId;

    const userdetails = adminControlUserDetails(userid);// return{user:{}}
    expect(session.controlUserId).toEqual(userid);
    expect(userdetails.user.name).toEqual('Kitty Tan');
    expect(userdetails.user.email).toEqual('rosielover@gmail.com');
    expect(userdetails.user.numSuccessfulLogins).toEqual(1);
    expect(userdetails.user.numFailedPasswordsSinceLastLogin).toEqual(0);
  });
  test('function return error', () => {
    const invalidId = 1234;
    const details = adminControlUserDetails(invalidId);
    expect(details).toHaveProperty('error');
    expect(details).toEqual({ error: 'User not found', errorCategory: 'INVALID_CREDENTIALS' });
  });
});
