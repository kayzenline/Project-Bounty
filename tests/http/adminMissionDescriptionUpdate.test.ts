import { v4 as uuid } from 'uuid';
import { adminMissionCreate, adminMissionInfo } from '../../src/mission';
import { adminAuthRegister, adminAuthLogin } from '../../src/auth';
import { findSessionFromSessionId, generateSessionId } from '../../src/helper';
import { missionDescriptionUpdate, clearRequest } from './requestHelpers';
import { getData } from '../../src/dataStore';

const { promisify } = require('util');
const missionCreateAsync = promisify(adminMissionCreate);


function uniqueEmail(prefix = 'user') {
  return `${prefix}.${uuid()}@example.com`;
}

describe('HTTP tests for MissionDescriptionUpdate', () => {
  let missionId: number;

  // use async...await (use the missionId in the test) <-- solve this problem
  beforeEach (async () => {
    const res = clearRequest();
    expect(res.statusCode).toBe(200);
    const email = uniqueEmail('success');
    adminAuthRegister(email, 'abc12345', 'John', 'Doe');
    const controlUserSessionId = adminAuthLogin(email, 'abc12345').controlUserSessionId;
    if (controlUserSessionId) {
      const session = findSessionFromSessionId(controlUserSessionId);
      if (session) {
        const mission = {
          name: 'Mercury',
          description: 'Place a manned spacecraft in orbital flight around the earth. Investigate a persons performance capabilities and their ability to function in the environment of space. Recover the person and the spacecraft safely',
          target: 'Earth orbit',
        };
        missionId = await missionCreateAsync(session.controlUserId, mission.name, mission.description, mission.target).missionId;
      }
    }
  });

  test('mission description updated successfully', () => {
    const data = getData();
    const controlUserSessionId = data.sessions[0].controlUserSessionId;
    const controlUserId = data.sessions[0].controlUserId;

    const newDescription = 'Land humans on the Moon and bring them safely back to Earth';
    const res = missionDescriptionUpdate(controlUserSessionId, missionId, newDescription);
    const resultBody = JSON.parse(res.body.toString());
    expect(res.statusCode).toBe(200);
    expect(resultBody).toBe({});
    const newTarget = adminMissionInfo(controlUserId, missionId).target;
    expect(newTarget).toStrictEqual('Jupiter moons');
  });

  test('get an invalid description', () => {
    const data = getData();
    const controlUserSessionId = data.sessions[0].controlUserSessionId;

    const longDescription = 'J'.repeat(401);
    const res = missionDescriptionUpdate(controlUserSessionId, missionId, longDescription);
    const resultBody = JSON.parse(res.body.toString());
    expect(res.statusCode).toBe(400);
    expect(resultBody.error).toBe({ error: expect.any(String) });
    expect(resultBody.errorCategory).toBe('BAD_INPUT');
  });

  test('ControlUserSessionId is empty or invalid', () => {
    const newSessionId = generateSessionId();

    const newDescription = 'Land humans on the Moon and bring them safely back to Earth';
    const res = missionDescriptionUpdate(newSessionId, missionId, newDescription);
    const resultBody = JSON.parse(res.body.toString());
    expect(res.statusCode).toBe(401);
    expect(resultBody.error).toBe({ error: expect.any(String) });
    expect(resultBody.errorCategory).toBe('INVALID_CREDENTIALS');

    const res1 = missionDescriptionUpdate('', missionId, newDescription);
    const resultBody1 = JSON.parse(res1.body.toString());
    expect(res1.statusCode).toBe(401);
    expect(resultBody.error).toBe({ error: expect.any(String) });
    expect(resultBody1.errorCategory).toBe('INVALID_CREDENTIALS');
  });

  test('control user is not an owner of this mission or the specified missionId does not exist', () => {
    const email = uniqueEmail('success');

    // creat a new mission belongs to a new user Tony Stark
    adminAuthRegister(email, 'abc12345', 'Tony', 'Stark');
    const newUserSessionId = adminAuthLogin(email, 'abc12345').controlUserSessionId;
    if (newUserSessionId) {
      const newSession = findSessionFromSessionId(newUserSessionId);
      if (newSession) {
        const newMission = {
          name: 'Venus',
          description: 'Explore atmosphere',
          target: 'Venus orbit'
        };
        adminMissionCreate(newSession.controlUserId, newMission.name, newMission.description, newMission.target);
      }
    }

    if (newUserSessionId) {
      const newDescription = 'Land humans on the Moon and bring them safely back to Earth';
      const res = missionDescriptionUpdate(newUserSessionId, missionId, newDescription);
      const resultBody = JSON.parse(res.body.toString());
      expect(res.statusCode).toBe(403);
      expect(resultBody.error).toBe({ error: expect.any(String) });
      expect(resultBody.errorCategory).toBe('INACCESSIBLE_VALUE');
    }

    const data = getData();
    const controlUserSessionId = data.sessions[0].controlUserSessionId;
    const newDescription = 'Land humans on the Moon and bring them safely back to Earth';
    const res = missionDescriptionUpdate(controlUserSessionId, missionId + 1, newDescription);
    const resultBody = JSON.parse(res.body.toString());
    expect(res.statusCode).toBe(403);
    expect(resultBody.error).toBe({ error: expect.any(String) });
    expect(resultBody.errorCategory).toBe('INACCESSIBLE_VALUE');
  });
});
