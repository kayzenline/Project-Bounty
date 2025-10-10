import {
  adminAuthRegister,
  adminAuthLogin,
  adminControlUserPasswordUpdate,
} from '../../src/auth';
import { clear } from '../../src/other';

beforeEach(() => clear());

describe('adminControlUserPasswordUpdate (minimal spec set)', () => {
  test('happy path: change -> old fails, new works', () => {
    const { controlUserId } = adminAuthRegister('pw@x.com', 'Oldpass123', 'Amy', 'Pond');

    expect(adminControlUserPasswordUpdate(controlUserId, 'Oldpass123', 'Newpass123'))
      .toEqual({});

    expect(adminAuthLogin('pw@x.com', 'Oldpass123').errorCategory).toBe('BAD_INPUT');
    expect(adminAuthLogin('pw@x.com', 'Newpass123')).toEqual({ controlUserId });
  });

  test('INVALID_CREDENTIALS: user not found', () => {
    const res = adminControlUserPasswordUpdate(999999, 'a', 'b');
    expect(res.errorCategory).toBe('INVALID_CREDENTIALS');
  });

  test('BAD_INPUT: wrong old password', () => {
    const { controlUserId } = adminAuthRegister('a@b.com', 'Abcd1234', 'Alice', 'Brown');
    const res = adminControlUserPasswordUpdate(controlUserId, 'WRONG', 'Newpass123');
    expect(res.errorCategory).toBe('BAD_INPUT');
  });

  test('BAD_INPUT: old === new', () => {
    const { controlUserId } = adminAuthRegister('c@d.com', 'Abcd1234', 'Charlie', 'Davis');
    const res = adminControlUserPasswordUpdate(controlUserId, 'Abcd1234', 'Abcd1234');
    expect(res.errorCategory).toBe('BAD_INPUT');
  });

  test('BAD_INPUT: new password too weak (representative)', () => {
    const { controlUserId } = adminAuthRegister('e@f.com', 'Abcd1234', 'Emma', 'Foster');
    const res = adminControlUserPasswordUpdate(controlUserId, 'Abcd1234', 'OnlyLetters');
    expect(res.errorCategory).toBe('BAD_INPUT');
  });

  test('BAD_INPUT: cannot reuse any previous password', () => {
    const { controlUserId } = adminAuthRegister('g@h.com', 'Abcd1234', 'George', 'Harrison');
    expect(adminControlUserPasswordUpdate(controlUserId, 'Abcd1234', 'Qwerty123')).toEqual({});
    const res = adminControlUserPasswordUpdate(controlUserId, 'Qwerty123', 'Abcd1234');
    expect(res.errorCategory).toBe('BAD_INPUT');
  });
});
