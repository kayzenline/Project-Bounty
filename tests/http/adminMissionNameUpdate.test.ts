import { v4 as uuid } from 'uuid';
import { adminMissionInfo } from '../../src/mission';
import { findSessionFromSessionId, generateSessionId } from '../../src/helper';
import { missionNameUpdate, clearRequest, adminMissionCreateRequest, adminAuthUserRegisterRequest, userLogin } from './requestHelpers';

function uniqueEmail(prefix = 'user') {
  return `${prefix}.${uuid()}@example.com`;
}

describe('HTTP tests for MissionNameUpdate', () => {
  let missionId: number;
  let controlUserSessionId: string;
  // use async...await (use the missionId in the test) <-- solve this problem
  beforeEach(async () => {
    const clearRes = clearRequest();
    expect(clearRes.statusCode).toBe(200);
    const email = uniqueEmail('success');
    const registerRes = adminAuthUserRegisterRequest(email, 'abc12345', 'John', 'Doe');
    expect(registerRes.statusCode).toBe(200);
    controlUserSessionId = registerRes.body.controlUserSessionId;
    const loginRes = userLogin(email, 'abc12345');
    expect(loginRes.statusCode).toBe(200);
    const mission = {
      name: 'Mercury',
      description: 'Place a manned spacecraft in orbital flight around the earth. Investigate a persons performance capabilities and their ability to function in the environment of space. Recover the person and the spacecraft safely',
      target: 'Earth orbit',
    };
    const res = adminMissionCreateRequest(controlUserSessionId, mission.name, mission.description, mission.target);
    expect(res.statusCode).toBe(200);
    missionId = res.body.missionId;
  });

  test('mission name updated successfully', () => {
    const session = findSessionFromSessionId(controlUserSessionId);
    if (session) {
      const controlUserId = session.controlUserId;
      const res = missionNameUpdate(controlUserSessionId, missionId, 'Mars');
      const resultBody = res.body;
      expect(res.statusCode).toBe(200);
      expect(resultBody).toBe({});
      const newName = adminMissionInfo(controlUserId, missionId).name;
      expect(newName).toStrictEqual('Mars');
    }
  });

  const testCases = [
    'Mars1',
    'Mar s',
    'M',
    'M'.repeat(31)
  ];
  test.each(testCases)('get an invalid name', (name) => {
    const session = findSessionFromSessionId(controlUserSessionId);
    if (session) {
      const res = missionNameUpdate(controlUserSessionId, missionId, name);
      const resultBody = res.body;
      expect(res.statusCode).toBe(400);
      expect(resultBody).toEqual({ error: expect.any(String) });
    }
  });

  test('ControlUserSessionId is empty or invalid', () => {
    const newSessionId = generateSessionId();

    const res = missionNameUpdate(newSessionId, missionId, 'Mars');
    const resultBody = res.body;
    expect(res.statusCode).toBe(401);
    expect(resultBody).toEqual({ error: expect.any(String) });

    const res1 = missionNameUpdate('', missionId, 'Mars');
    const resultBody1 = res1.body;
    expect(res1.statusCode).toBe(401);
    expect(resultBody1).toEqual({ error: expect.any(String) });
  });

  test('control user is not an owner of this mission or the specified missionId does not exist', () => {
    // creat a new mission belongs to a new user Tony Stark
    const newEmail = uniqueEmail('success');
    const newRegisterRes = adminAuthUserRegisterRequest(newEmail, 'abc12345', 'Tony', 'Stark');
    expect(newRegisterRes.statusCode).toBe(200);
    const newSessionId = newRegisterRes.body.controlUserSessionId;
    const newLoginRes = userLogin(newEmail, 'abc12345');
    expect(newLoginRes.statusCode).toBe(200);
    const newMission = {
      name: 'Venus',
      description: 'Explore atmosphere',
      target: 'Venus orbit'
    };
    const newRes = adminMissionCreateRequest(newSessionId, newMission.name, newMission.description, newMission.target);
    expect(newRes.statusCode).toBe(200);
    const newMissionId = newRes.body.missionId;

    const res = missionNameUpdate(newSessionId, missionId, 'Mars');
    const resultBody = res.body;
    expect(res.statusCode).toBe(403);
    expect(resultBody).toEqual({ error: expect.any(String) });

    const res1 = missionNameUpdate(controlUserSessionId, newMissionId + 1, 'Mars');
    const resultBody1 = res1.body;
    expect(res1.statusCode).toBe(403);
    expect(resultBody1).toEqual({ error: expect.any(String) });
  });
});
