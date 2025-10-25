import { v4 as uuid } from 'uuid';
import { adminMissionCreateRequest, adminAuthUserRegisterRequest, clearRequest, adminMissionDeleteRequest, adminAstronautCreateRequest, adminAstronautAssignRequest } from './requestHelpers';

function uniqueEmail(prefix = 'user') {
  return `${prefix}.${uuid().split('-').pop() || ''}@example.com`;
}

let missionId: number;
let token: string;
const ERROR = { error: expect.any(String) };
beforeEach(() => {
  const clearRes = clearRequest();
  expect(clearRes.statusCode).toBe(200);
  // register a user and get the token
  const registerRes = adminAuthUserRegisterRequest(uniqueEmail('test'), 'ValidPass123', 'John', 'Doe');
  expect(registerRes.statusCode).toBe(200);
  token = registerRes.body.controlUserSessionId;

  const res = adminMissionCreateRequest(token, 'Mission 1', 'Description', 'Target');
  expect(res.statusCode).toBe(200);
  missionId = res.body.missionId;
});

afterAll(() => {
  const clearRes = clearRequest();
  expect(clearRes.statusCode).toBe(200);
});

describe('/v1/admin/mission/{missionid}', () => {
  describe('valid cases', () => {
    // status code 200 If any of the following are true:
    test('successful delete a space mission', () => {
      const res = adminMissionDeleteRequest(token, missionId);
      expect(res.statusCode).toBe(200);
      expect(res.body).toStrictEqual({});
    });
  });
  describe('invalid cases', () => {
    // status code 400 If any of the following are true:
    test.skip('Astronauts have been assigned to this mission', () => {
      const astronautId = adminAstronautCreateRequest(token, 'Elon', 'Musk', 'string', 36, 75, 178).body.astronautId;
      adminAstronautAssignRequest(token, astronautId, missionId);
      const res = adminMissionDeleteRequest(token, missionId);
      expect(res.statusCode).toBe(400);
      expect(res.body).toStrictEqual(ERROR);
    });
    // status code 401 If any of the following are true:
    test('ControlUserSessionId is empty or invalid (does not refer to valid logged in user session)', () => {
      const invalidSession = token + 'awgaw';
      const resin = adminMissionDeleteRequest(invalidSession, missionId);
      expect(resin.statusCode).toBe(401);
      expect(resin.body).toStrictEqual(ERROR);
      const empty = '';
      const resem = adminMissionDeleteRequest(empty, missionId);
      expect(resem.statusCode).toBe(401);
      expect(resem.body).toStrictEqual(ERROR);
    });
    // status code 403 If any of the following are true:
    test('Valid controlUserSessionId is provided, but control user is not an owner of this space mission or the space mission does not exist', () => {
      const otherUser = adminAuthUserRegisterRequest('other@example.com', 'ValidPass123', 'Alice', 'Smith');
      expect(otherUser.statusCode).toBe(200);
      const otherToken = otherUser.body.controlUserSessionId;

      const notOwnerResponse = adminMissionDeleteRequest(otherToken, missionId);
      expect(notOwnerResponse.statusCode).toBe(403);
      expect(notOwnerResponse.body).toStrictEqual(ERROR);

      const missingMissionResponse = adminMissionDeleteRequest(token, missionId + 9999);
      expect(missingMissionResponse.statusCode).toBe(403);
      expect(missingMissionResponse.body).toStrictEqual(ERROR);
    });
  });
});
