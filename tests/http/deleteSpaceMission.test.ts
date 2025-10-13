import { afterAll, beforeEach, describe, expect, test } from '@jest/globals';
import { v4 as uuid } from 'uuid';
import {
  clearRequest,
  controlUserSessionId as missionCreate,
  missionDelete,
  userRegister,
} from './requestHelpers';

let token: string;

function uniqueEmail(prefix: string) {
  return `${prefix}.${uuid()}@example.com`;
}

beforeEach(() => {
  const clearRes = clearRequest();
  expect(clearRes.statusCode).toBe(200);

  const registerRes = userRegister(uniqueEmail('deletemission'), 'ValidPass123', 'John', 'Doe');
  expect(registerRes.statusCode).toBe(200);
  token = registerRes.body.controlUserSessionId;
});

afterAll(() => {
  clearRequest();
});

describe('/v1/admin/mission/{missionid}', () => {
  // status code 200 If any of the following are true:
  describe('valid cases', () => {
    test('successful delete a space mission', () => {
      const createRes = missionCreate(token, 'Mission To Delete', 'Disposable mission', 'Mars orbit');
      expect(createRes.statusCode).toBe(200);

      const missionId = createRes.body.missionId;
      const deleteRes = missionDelete(token, missionId);
      expect(deleteRes.statusCode).toBe(200);
      expect(deleteRes.body).toEqual({});
    });
  });

  describe('invalid cases', () => {
    // status code 400 If any of the following are true:
    test.skip('Astronauts have been assigned to this mission', () => {
      // TODO: Enable once mission assignment functionality is implemented.
      expect(true).toBe(false);
    });
    // status code 401 If any of the following are true:
    test('ControlUserSessionId is empty or invalid (does not refer to valid logged in user session)', () => {
      const createRes = missionCreate(token, 'Mission Invalid Session', 'Check 401', 'Low Earth Orbit');
      expect(createRes.statusCode).toBe(200);

      const missionId = createRes.body.missionId;
      const missingSession = missionDelete('', missionId);
      expect(missingSession.statusCode).toBe(401);
      expect(missingSession.body).toEqual({ error: expect.any(String) });

      const invalidSession = missionDelete('invalid-session-id', missionId);
      expect(invalidSession.statusCode).toBe(401);
      expect(invalidSession.body).toEqual({ error: expect.any(String) });
    });
    // status code 403 If any of the following are true:
    test('Valid controlUserSessionId is provided, but control user is not an owner of this space mission or the space mission does not exist', () => {
      const ownerMission = missionCreate(token, 'Mission Owned', 'Owner mission', 'Moon base');
      expect(ownerMission.statusCode).toBe(200);

      const missionId = ownerMission.body.missionId;
      const otherUser = userRegister(uniqueEmail('deletemission-other'), 'ValidPass123', 'Jane', 'Smith');
      expect(otherUser.statusCode).toBe(200);

      const otherToken = otherUser.body.controlUserSessionId;
      const notOwnerDelete = missionDelete(otherToken, missionId);
      expect(notOwnerDelete.statusCode).toBe(403);
      expect(notOwnerDelete.body).toEqual({ error: expect.any(String) });

      const nonExistentDelete = missionDelete(token, missionId + 999);
      expect(nonExistentDelete.statusCode).toBe(403);
      expect(nonExistentDelete.body).toEqual({ error: expect.any(String) });
    });
  });
});
