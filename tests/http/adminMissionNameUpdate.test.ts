import { v4 as uuid } from 'uuid';
import { adminMissionCreate, adminMissionInfo } from '../../src/mission';
import { adminAuthRegister, adminAuthLogin } from '../../src/auth';
import { findSessionFromSessionId, generateSessionId } from '../../src/helper';
import { missionNameUpdate, clearRequest, controlUserSessionId } from './requestHelpers';
import { getData } from '../../src/dataStore';
import { stringify } from 'querystring';

const { promisify } = require('util');
const missionCreateAsync = promisify(adminMissionCreate);


function uniqueEmail(prefix = 'user') {
  return `${prefix}.${uuid()}@example.com`;
}

describe('HTTP tests for MissionNameUpdate', () => {
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

  test('mission name updated successfully', () => {
    const data = getData();
    const controlUserSessionId = data.sessions[0].controlUserSessionId;
    const controlUserId = data.sessions[0].controlUserId;

    const res = missionNameUpdate(controlUserSessionId, missionId, 'Mars');
    const resultBody = JSON.parse(res.body.toString());
    expect(res.statusCode).toBe(200);
    expect(resultBody).toBe({});
    const newName = adminMissionInfo(controlUserId, missionId).name;
    expect(newName).toStrictEqual('Mars');
  });

  const testCases = [
    'Mars1',
    'Mar s',
    'M',
    'M'.repeat(31)
  ]
  test.each(testCases)('get an invalid name', (name) => {
    const data = getData();
    const controlUserSessionId = data.sessions[0].controlUserSessionId;
    const res = missionNameUpdate(controlUserSessionId, missionId, name);
    const resultBody = JSON.parse(res.body.toString());
    expect(res.statusCode).toBe(400);
    expect(resultBody.error).toBe({ error: expect.any(String) });
    expect(resultBody.errorCategory).toBe('BAD_INPUT');
  });

  test('ControlUserSessionId is empty or invalid', () => {
    const newSessionId = generateSessionId();

    const res = missionNameUpdate(newSessionId, missionId, 'Mars');
    const resultBody = JSON.parse(res.body.toString());
    expect(res.statusCode).toBe(401);
    expect(resultBody.error).toBe({ error: expect.any(String) });
    expect(resultBody.errorCategory).toBe('INVALID_CREDENTIALS');

    const res1 = missionNameUpdate('', missionId, 'Mars');
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
      const res = missionNameUpdate(newUserSessionId, missionId, 'Mars');
      const resultBody = JSON.parse(res.body.toString());
      expect(res.statusCode).toBe(403);
      expect(resultBody.error).toBe({ error: expect.any(String) });
      expect(resultBody.errorCategory).toBe('INACCESSIBLE_VALUE');
    }

    const data = getData();
    const controlUserSessionId = data.sessions[0].controlUserSessionId;
    const res = missionNameUpdate(controlUserSessionId, missionId + 1, 'Mars');
    const resultBody = JSON.parse(res.body.toString());
    expect(res.statusCode).toBe(403);
    expect(resultBody.error).toBe({ error: expect.any(String) });
    expect(resultBody.errorCategory).toBe('INACCESSIBLE_VALUE');
  });
});
