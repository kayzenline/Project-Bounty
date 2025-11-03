import { v4 as uuid } from 'uuid';
import { generateSessionId } from '../../src/helper';
import { adminAuthUserRegisterRequest, adminAuthUserLoginRequest, adminAuthUserPasswordUpdateRequest, clearRequest } from './requestHelpers';

function uniqueEmail(prefix = 'user') {
  return `${prefix}.${uuid().split('-').pop() || ''}@example.com`;
}

describe('HTTP tests for ControlUserPasswordUpdate', () => {
  let controlUserSessionId: string;
  let email: string;

  beforeEach(() => {
    const clearRes = clearRequest();
    expect(clearRes.statusCode).toBe(200);
    email = uniqueEmail('user');
    const registerRes = adminAuthUserRegisterRequest(email, 'OldStrongPass123', 'Bill', 'Ryker');
    controlUserSessionId = registerRes.body.controlUserSessionId;
    const passwordUpdateRes = adminAuthUserPasswordUpdateRequest(controlUserSessionId, 'OldStrongPass123', 'StrongPass123');
    expect(passwordUpdateRes.statusCode).toBe(200);
  });

  test('user password updated successfully', () => {
    const passwordUpdateRes = adminAuthUserPasswordUpdateRequest(controlUserSessionId, 'StrongPass123', 'NewPassword123');
    expect(passwordUpdateRes.statusCode).toBe(200);
    expect(passwordUpdateRes.body).toStrictEqual({});
    const loginRes = adminAuthUserLoginRequest(email, 'NewPassword123');
    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body).toStrictEqual({ controlUserSessionId: expect.any(String) });
  });

  const invalidPassword = [
    {
      oldPassword: 'StrongPass321',
      newPassword: 'NewPassword123'
    },
    {
      oldPassword: 'StrongPass123',
      newPassword: 'StrongPass123'
    },
    {
      oldPassword: 'StrongPass123',
      newPassword: 'OldStrongPass123'
    },
    {
      oldPassword: 'StrongPass123',
      newPassword: 'NewP123'
    },
    {
      oldPassword: 'StrongPass123',
      newPassword: 'NewPassword'
    },
    {
      oldPassword: 'StrongPass123',
      newPassword: '123456789'
    }
  ];
  test.each(invalidPassword)('invalid password', ({ oldPassword, newPassword }) => {
    const passwordUpdateRes = adminAuthUserPasswordUpdateRequest(controlUserSessionId, oldPassword, newPassword);
    expect(passwordUpdateRes.statusCode).toBe(400);
    expect(passwordUpdateRes.body).toStrictEqual({ error: expect.any(String) });
  });

  const invalidSessionId = [
    '',
    generateSessionId()
  ];
  test.each(invalidSessionId)('controlUserSessionId is invalid', (sessionId) => {
    const passwordUpdateRes = adminAuthUserPasswordUpdateRequest(sessionId, 'StrongPass123', 'NewPassword123');
    expect(passwordUpdateRes.statusCode).toBe(401);
    expect(passwordUpdateRes.body).toStrictEqual({ error: expect.any(String) });
  });
});
