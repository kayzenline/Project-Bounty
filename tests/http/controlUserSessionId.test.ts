import { afterAll, beforeEach, describe, expect, test } from '@jest/globals';
import { clear } from '../../src/other';
import { controlUserSessionId as missionCreate, userRegister } from './requestHelpers';

beforeEach(() => {
  clear();
  //register a user and get the token
  const res = userRegister('test@example.com', 'ValidPass123', 'John', 'Doe');
  expect(res.statusCode).toBe(200);
  token = res.body.controlUserSessionId;
});

afterAll(() => {
  clear();
});
const ERROR = { error: expect.any(String) };
let token: string;
/**
 * This is test for CUS
 */
describe('POST /v1/admin/mission', () => {

  describe('valid cases', () => {
    test('successful create a new space mission', () => {
      const res = missionCreate(token, 'Test mission', 'A test session', 'Low Earth Orbit');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('missionId', expect.any(Number));
    });
  });
  // status code 400 If any of the following are true:
  describe('invalid cases', () => {
    test('Name contains invalid characters. Valid characters are alphanumeric and spaces', () => {
      const res = missionCreate(token, 'Invalid@Name', 'Invalid characters test', 'Low Earth Orbit');
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual(ERROR);
    });

    test.each([
      ['less than 3 characters long', 'Hi'],
      ['more than 30 characters long', 'A'.repeat(31)],
    ])('Name is %s', (_, name) => {
      const res = missionCreate(token, name, 'Mission name length test', 'Mars');
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual(ERROR);
    });

    test('Name is already used by the current logged in user for another space mission', () => {
      const first = missionCreate(token, 'Unique Mission', 'Original description', 'Mars orbit');
      expect(first.statusCode).toBe(200);
      expect(first.body).toHaveProperty('missionId', expect.any(Number));

      const duplicate = missionCreate(token, 'Unique Mission', 'Duplicate name attempt', 'Mars orbit');
      expect(duplicate.statusCode).toBe(400);
      expect(duplicate.body).toEqual(ERROR);
    });

    test('Description is more than 400 characters in length (note: empty strings are OK)', () => {
      const longDescription = 'a'.repeat(401);
      const res = missionCreate(token, 'Mission Name', longDescription, 'Mars orbit');
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual(ERROR);
    });

    test('Target is more than 100 characters in length (note: empty strings are OK)', () => {
      const longTarget = 't'.repeat(101);
      const res = missionCreate(token, 'Mission Target Test', 'Valid description', longTarget);
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual(ERROR);
    });
  });

  // status code 401 If any of the following are true:
  describe('ControlUserSessionId is empty or invalid', () => {
    test.each(['', 'invalid-session-id'])(
      'ControlUserSessionId "%s" is empty or invalid (does not refer to valid logged in user session)',
      (invalidSessionId) => {
        const res = missionCreate(invalidSessionId, 'Mission Name', 'Valid description', 'Mars');
        expect(res.statusCode).toBe(401);
        expect(res.body).toEqual(ERROR);
      }
    );
  });
});
