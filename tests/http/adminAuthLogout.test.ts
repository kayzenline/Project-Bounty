import { beforeEach, describe, expect, test } from '@jest/globals';
import { adminAuthUserRegisterRequest, userLogout, clearRequest, adminMissionCreateRequest } from './requestHelpers';

beforeEach(() => {
  const res = clearRequest();
  expect(res.statusCode).toBe(200);
});

const ERROR = { error: expect.any(String) };

describe('POST /v1/admin/auth/logout', () => {
  test('success: valid session logs out and becomes invalid', () => {
    const reg = adminAuthUserRegisterRequest('logout.user@example.com', 'ValidPass123', 'John', 'Doe');
    expect(reg.statusCode).toBe(200);
    const token = reg.body.controlUserSessionId;

    const out = userLogout(token);
    expect(out.statusCode).toBe(200);
    expect(out.body).toEqual({});

    const after = adminMissionCreateRequest(token, 'Post-logout Mission', 'Desc', 'Mars');
    expect(after.statusCode).toBe(401);
    expect(after.body).toEqual(ERROR);
  });

  describe('invalid session header', () => {
    test.each(['', 'invalid-session-id'])('ControlUserSessionId "%s" is empty or invalid', (sid) => {
      const res = userLogout(sid);
      expect(res.statusCode).toBe(401);
      expect(res.body).toEqual(ERROR);
    });
  });
});
