import { v4 as uuid } from 'uuid';
import { adminAstronautUnassignRequest, clearRequest, adminAuthUserRegisterRequest, adminMissionCreateRequest, adminAstronautCreateRequest, adminAstronautAssignRequest } from './requestHelpers';

function uniqueEmail(prefix = 'user') {
  return `${prefix}.${uuid().split('-').pop() || ''}@example.com`;
}

const ERROR = { error: expect.any(String) };
let missionId: number;
let controlUserSessionId: string;
let astronautId: number;
let astronautNameFirst: string;
let astronautNameLast: string;
let rank: string;



describe.skip('DELETE /v1/admin/mission/{missionid}/assign/{astronautid}', () => {
  const email = uniqueEmail('test');
  beforeEach(() => {
    const clearRes = clearRequest();
    expect(clearRes.statusCode).toBe(200);
    const registerRes = adminAuthUserRegisterRequest(email, 'ValidPass123', 'John', 'Doe');
    expect(registerRes.statusCode).toBe(200);
    controlUserSessionId = registerRes.body.controlUserSessionId;

    const res = adminMissionCreateRequest(controlUserSessionId, "Mission 1", "Description", "Target");
    expect(res.statusCode).toBe(200);
    missionId = res.body.missionId;

    astronautNameFirst = 'NameFirst';
    astronautNameLast = 'NameLast';
    rank = 'rankOfAstronaut';
    const age = 20;
    const weight = 70;
    const height = 170;
    const createAstronautRes = adminAstronautCreateRequest(
      controlUserSessionId,
      astronautNameFirst,
      astronautNameLast,
      rank,
      age,
      weight,
      height
    );
    expect(createAstronautRes.statusCode).toBe(200);
    astronautId = createAstronautRes.body.astronautId;
  });

  afterAll(() => {
    const clearRes = clearRequest();
    expect(clearRes.statusCode).toBe(200);
  });
  describe('valid cases', () => {
    // status code 200 If any of the following are true:
    test('successful unassign an astronaut', () => {
      adminAstronautAssignRequest(controlUserSessionId, astronautId, missionId);
      const res = adminAstronautUnassignRequest(controlUserSessionId, astronautId, missionId);
      expect(res.statusCode).toBe(200);
      expect(res.body).toStrictEqual({})
    });
  })

  describe('invalid cases', () => {
    // status code 400 If any of the following are true:
    test('astronautId is invalid', () => {
      adminAstronautAssignRequest(controlUserSessionId, astronautId, missionId);
      const res = adminAstronautUnassignRequest(controlUserSessionId, astronautId + 9999, missionId);
      expect(res.statusCode).toBe(400);
      expect(res.body).toStrictEqual(ERROR)
    })

    test('The astronaut not assigned to this space mission.', () => {
      const res = adminAstronautUnassignRequest(controlUserSessionId, astronautId, missionId);
      expect(res.statusCode).toBe(400);
      expect(res.body).toStrictEqual(ERROR)
    })

    // status code 401 If any of the following are true:
    test('ControlUserSessionId is empty or invalid (does not refer to valid logged in user session)', () => {
      // ControlUserSessionId is empty 
      adminAstronautAssignRequest(controlUserSessionId, astronautId, missionId);
      const res1 = adminAstronautUnassignRequest('', astronautId, missionId);
      expect(res1.statusCode).toBe(401);
      expect(res1.body).toStrictEqual(ERROR)

      // ControlUserSessionId is invalid
      adminAstronautAssignRequest(controlUserSessionId, astronautId, missionId);
      const res2 = adminAstronautUnassignRequest('invalid token', astronautId, missionId);
      expect(res2.statusCode).toBe(401);
      expect(res2.body).toStrictEqual(ERROR)
    })

    // status code 403 If any of the following are true:
    test('Valid controlUserSessionId is provided, but the control user is not an owner of this mission or the specified missionId does not exist', () => {
      // The control user is not an owner of this mission
      adminAstronautAssignRequest(controlUserSessionId, astronautId, missionId);
      const otherEmail = uniqueEmail('otherEmail');
      const otherUser = adminAuthUserRegisterRequest(otherEmail, 'ValidPass123', 'Alice', 'Smith');
      expect(otherUser.statusCode).toBe(200);
      const otherSessionId = otherUser.body.controlUserSessionId;
      const notOwnerRes = adminAstronautUnassignRequest(otherSessionId, astronautId, missionId);
      expect(notOwnerRes.statusCode).toBe(403);
      expect(notOwnerRes.body).toStrictEqual(ERROR);

      // Mission does not exist
      const missingMissionRes = adminAstronautUnassignRequest(controlUserSessionId, astronautId, missionId + 9999);
      expect(missingMissionRes.statusCode).toBe(403);
      expect(missingMissionRes.body).toStrictEqual(ERROR);
    })
  })
})