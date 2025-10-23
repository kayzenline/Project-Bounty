import { clearRequest, adminMissionCreateRequest, SpaceMissionInfo as SpaceMissionInfo, adminAuthUserRegisterRequest, createAstronaut, assignAstronaut } from './requestHelpers';


const ERROR = { error: expect.any(String) };
let missionId: number;
let token: string;
let astronautId: number;
let astronautNameFirst: string;
let astronautNameLast: string;
let rank: string;
beforeEach(() => {
  const clearRes = clearRequest();
  expect(clearRes.statusCode).toBe(200);
  const registerRes = adminAuthUserRegisterRequest('test@example.com', 'ValidPass123', 'John', 'Doe');
  expect(registerRes.statusCode).toBe(200);
  token = registerRes.body.controlUserSessionId;

  const res = adminMissionCreateRequest(token, "Mission 1", "Description", "Target");
  expect(res.statusCode).toBe(200);
  missionId = res.body.missionId;
  astronautNameFirst = 'NameFirst';
  astronautNameLast = 'NameLast';
  rank = 'rankOfAstronaut';
  const age = 20;
  const weight = 70;
  const height = 170;
  const createAstronautRes = createAstronaut(
    token,
    astronautNameFirst,
    astronautNameLast,
    rank,
    age,
    weight,
    height
  );
  expect(createAstronautRes.statusCode).toBe(200);
  astronautId = createAstronautRes.body;
})

afterAll(() => {
  const clearRes = clearRequest();
  expect(clearRes.statusCode).toBe(200);
});

describe.skip(`/v1/admin/mission/{missionId}`, () => {
  describe('valid cases', () => {
    // status code 200 If any of the following are true:
    test('successful get the Space mission info without assign astronaut', () => {
      const res = SpaceMissionInfo(token, missionId);
      // expect(res.statusCode).toBe(200);
      expect(res.body).toStrictEqual({
        "missionId": missionId,
        "name": "Mission 1",
        "timeCreated": expect.any(Number),
        "timeLastEdited": expect.any(Number),
        "description": "Description",
        "target": "Target",
        "assignedAstronauts": []
      })
    })
    test('successful get the Space mission info with assign astronaut', () => {
      assignAstronaut(token, astronautId, missionId);
      const res = SpaceMissionInfo(token, missionId);
      expect(res.statusCode).toBe(200);
      expect(res.body).toStrictEqual({
        "missionId": missionId,
        "name": "Mission 1",
        "timeCreated": expect.any(Number),
        "timeLastEdited": expect.any(Number),
        "description": "Description",
        "target": "Target",
        "assignedAstronauts": [
          {
            "astronautId": astronautId,
            "designation": rank + ' ' + astronautNameFirst + ' ' + astronautNameLast
          }
        ]
      })
    })

  })

  describe.skip('invalid cases', () => {
    // status code 401 If any of the following are true:
    test('ControlUserSessionId is empty or invalid (does not refer to valid logged in user session)', () => {
      const res = SpaceMissionInfo('', missionId);
      expect(res.statusCode).toBe(401);
      expect(res.body).toStrictEqual(ERROR);
    })
    // status code 403 If any of the following are true:
    test('Valid controlUserSessionId is provided, but the control user is not an owner of this mission or the specified missionId does not exist', () => {
      const otherUser = adminAuthUserRegisterRequest('other@example.com', 'ValidPass123', 'Alice', 'Smith');
      expect(otherUser.statusCode).toBe(200);
      const otherToken = otherUser.body.controlUserSessionId;

      const resNotOwner = SpaceMissionInfo(otherToken, missionId);
      expect(resNotOwner.statusCode).toBe(403);
      expect(resNotOwner.body).toStrictEqual(ERROR);

      const resMissingMission = SpaceMissionInfo(token, missionId + 9999);
      expect(resMissingMission.statusCode).toBe(403);
      expect(resMissingMission.body).toStrictEqual(ERROR);
    })
  })
})
