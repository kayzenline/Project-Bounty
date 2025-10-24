import { v4 as uuid } from 'uuid';
import { generateSessionId } from '../../src/helper';
import { adminAuthUserRegisterRequest, adminAuthUserLogoutRequest, clearRequest, adminMissionCreateRequest } from './requestHelpers';

function uniqueEmail(prefix = 'user') {
  return `${prefix}.${uuid()}@example.com`;
}

describe('POST /v1/admin/auth/logout', () => {
  let controlSessionUserId: string;
  beforeEach(() => {
    const res = clearRequest();
    expect(res.statusCode).toBe(200);

    const email = uniqueEmail('success');
    const reg = adminAuthUserRegisterRequest(email, 'ValidPass123', 'John', 'Doe');
    expect(reg.statusCode).toBe(200);
    controlSessionUserId = reg.body.controlUserSessionId;
  });

  test('success: valid session logs out and becomes invalid', () => {
    const out = adminAuthUserLogoutRequest(controlSessionUserId);
    expect(out.statusCode).toBe(200);
    expect(out.body).toStrictEqual({});

    const after = adminMissionCreateRequest(controlSessionUserId, 'Post-logout Mission', 'Desc', 'Mars');
    expect(after.statusCode).toBe(401);
    expect(after.body).toEqual({ error: expect.any(String) });
  });

  const invalidSessionId = [
    '',
    generateSessionId()
  ];
  test.each(invalidSessionId)('ControlUserSessionId "%s" is empty or invalid', (sessionId) => {
    const res = adminAuthUserLogoutRequest(sessionId);
    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ error: expect.any(String) });
  });
});
