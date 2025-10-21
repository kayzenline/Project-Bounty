import { v4 as uuid } from 'uuid';
import { adminMissionInfo } from '../../src/mission';
import { findSessionFromSessionId, generateSessionId } from '../../src/helper';
import { missionDescriptionUpdate, clearRequest, controlUserSessionId as missionCreate, userRegister, userLogin } from './requestHelpers';

function uniqueEmail(prefix = 'user') {
  return `${prefix}.${uuid()}@example.com`;
}

let missionId: number;
let controlUserSessionId: string;

describe('HTTP tests for MissionDescriptionUpdate', () => {

  // use async...await (use the missionId in the test) <-- solve this problem
  beforeEach (() => {
    const clearRes = clearRequest();
    expect(clearRes.statusCode).toBe(200);
    const email = uniqueEmail('success');
    const registerRes = userRegister(email, 'abc12345', 'John', 'Doe');
    expect(registerRes.statusCode).toBe(200);
    controlUserSessionId = registerRes.body.controlUserSessionId;
    const loginRes = userLogin(email, 'abc12345');
    expect(loginRes.statusCode).toBe(200);
    const mission = {
      name: 'Mercury',
      description: 'Place a manned spacecraft in orbital flight around the earth. Investigate a persons performance capabilities and their ability to function in the environment of space. Recover the person and the spacecraft safely',
      target: 'Earth orbit',
    };
    const res = missionCreate(controlUserSessionId, mission.name, mission.description, mission.target);
    expect(res.statusCode).toBe(200);
    missionId = res.body.missionId;
  });

  test('mission description updated successfully', () => {
    const session = findSessionFromSessionId(controlUserSessionId);
    if (session) {
      const controlUserId = session.controlUserId;
      const newDescription = 'Land humans on the Moon and bring them safely back to Earth';
      const res = missionDescriptionUpdate(controlUserSessionId, missionId, newDescription);
      const resultBody = res.body;
      expect(res.statusCode).toBe(200);
      expect(resultBody).toBe({});
      const updatedDesc = adminMissionInfo(controlUserId, missionId).description;
      expect(updatedDesc).toStrictEqual('Land humans on the Moon and bring them safely back to Earth');
    }
  });

  test('get an invalid description', () => {
    const session = findSessionFromSessionId(controlUserSessionId);
    if (session) {
      const longDescription = 'J'.repeat(401);
      const res = missionDescriptionUpdate(controlUserSessionId, missionId, longDescription);
      const resultBody = res.body;
      expect(res.statusCode).toBe(400);
      expect(resultBody).toEqual({ error: expect.any(String) });
    }
  });

  test('ControlUserSessionId is empty or invalid', () => {
    const newSessionId = generateSessionId();
    const newDescription = 'Land humans on the Moon and bring them safely back to Earth';
    const res = missionDescriptionUpdate(newSessionId, missionId, newDescription);
    const resultBody = res.body
    expect(res.statusCode).toBe(401);
    expect(resultBody).toEqual({ error: expect.any(String) });

    const res1 = missionDescriptionUpdate('', missionId, newDescription);
    const resultBody1 = res1.body;
    expect(res1.statusCode).toBe(401);
    expect(resultBody1).toEqual({ error: expect.any(String) });
  });

  test('control user is not an owner of this mission or the specified missionId does not exist', () => {
    // creat a new mission belongs to a new user Tony Stark
    const newEmail = uniqueEmail('success');
    const newRegisterRes = userRegister(newEmail, 'abc12345', 'Tony', 'Stark');
    expect(newRegisterRes.statusCode).toBe(200);
    const newSessionId = newRegisterRes.body.controlUserSessionId;
    const newLoginRes = userLogin(newEmail, 'abc12345');
    expect(newLoginRes.statusCode).toBe(200);
    const newMission = {
      name: 'Venus',
      description: 'Explore atmosphere',
      target: 'Venus orbit'
    };
    const newRes = missionCreate(newSessionId, newMission.name, newMission.description, newMission.target);
    expect(newRes.statusCode).toBe(200);
    const newMissionId = newRes.body.missionId;
    console.log('the new session id:', newSessionId);

    const newDescription = 'Land humans on the Moon and bring them safely back to Earth';
    const res = missionDescriptionUpdate(newSessionId, missionId, newDescription);
    const resultBody = res.body;
    expect(res.statusCode).toBe(403);
    expect(resultBody).toEqual({ error: expect.any(String) });

    const res1 = missionDescriptionUpdate(controlUserSessionId, newMissionId + 1, newDescription);
    const resultBody1 = res1.body;
    expect(res1.statusCode).toBe(403);
    expect(resultBody1).toEqual({ error: expect.any(String) });
  });
});
