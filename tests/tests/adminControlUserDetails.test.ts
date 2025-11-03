import { v4 as uuid } from 'uuid';
import { generateSessionId } from '../../src/helper';
import { adminAuthUserRegisterRequest, adminAuthUserDetailsRequest, clearRequest } from './requestHelpers';

function uniqueEmail(prefix = 'user') {
  return `${prefix}.${uuid().split('-').pop() || ''}@example.com`;
}

describe('HTTP tests for ControlUserdetails', () => {
  let controlUserSessionId: string;
  let email: string;
  beforeEach(() => {
    const clearRes = clearRequest();
    expect(clearRes.statusCode).toBe(200);
    email = uniqueEmail('success');
    const registerRes = adminAuthUserRegisterRequest(email, 'abc12345', 'John', 'Doe');
    expect(registerRes.statusCode).toBe(200);
    controlUserSessionId = registerRes.body.controlUserSessionId;
  });

  test('request successfully ', () => {
    const res = adminAuthUserDetailsRequest(controlUserSessionId);
    const user = res.body.user;
    expect(res.statusCode).toBe(200);

    expect(user.email).toStrictEqual(email);
    expect(user.name).toStrictEqual('John Doe');
    expect(user.numSuccessfulLogins).toStrictEqual(1);

    expect(user.numFailedPasswordsSinceLastLogin).toStrictEqual(0);
  });

  const invalidSessionId = [
    '',
    generateSessionId()
  ];
  test.each(invalidSessionId)('controlUserSessionId is empty or invalid', (sessionId) => {
    const res = adminAuthUserDetailsRequest(sessionId);
    expect(res.statusCode).toBe(401);
    expect({ error: res.body.error }).toStrictEqual({ error: expect.any(String) });
  });
});
