import { clearRequest, controlUserSessionId as missionCreate, missionList, userRegister } from "./requestHelpers"
const ERROR = { error: expect.any(String) };

let missionId: number;
let token: string;
beforeEach(() => {
  const clearRes = clearRequest();
  expect(clearRes.statusCode).toBe(200);
  const registerRes = userRegister('test@example.com', 'ValidPass123', 'John', 'Doe');
  expect(registerRes.statusCode).toBe(200);
  token = registerRes.body.controlUserSessionId;

  const res = missionCreate(token, "Mission 1", "Description", "Target");
  expect(res.statusCode).toBe(200);
  missionId = res.body.missionId;
});

afterAll(() => {
  const clearRes = clearRequest();
  expect(clearRes.statusCode).toBe(200);
});

describe('/v1/admin/mission/list', () => {
  describe('valid cases', () => {
    // status code 200 If any of the following are true:
    test('successful list a single mission', () => {
      const res = missionList(token);
      expect(res.statusCode).toBe(200);
      expect(res.body).toStrictEqual({
        missions: [
          {
            missionId,
            name: 'Mission 1'
          }
        ]
      });
    })

    test('successful list multiple missions', () => {
      const res2 = missionCreate(token, "Mission 2", "Description2", "Target2");
      expect(res2.statusCode).toBe(200);
      const missionId2 = res2.body.missionId;
      const res3 = missionCreate(token, "Mission 3", "Description3", "Target3");
      expect(res3.statusCode).toBe(200);
      const missionId3 = res3.body.missionId;
      const res = missionList(token);
      expect(res.statusCode).toBe(200);
      expect(res.body).toStrictEqual({
        missions: [
          {
            missionId,
            name: 'Mission 1'
          },
          {
            missionId: missionId2,
            name: 'Mission 2'
          },
          {
            missionId: missionId3,
            name: 'Mission 3'
          }
        ]
      });
    })
  })

  describe('invalid cases', () => {
    // status code 401 If any of the following are true:
    test('ControlUserSessionId is empty or invalid (does not refer to valid logged in user session)', () => {
      for (const invalidSessionId of ['', 'invalid-session-id']) {
        const res = missionList(invalidSessionId);
        expect(res.statusCode).toBe(401);
        expect(res.body).toEqual(ERROR);
      }
    });
  });
});
