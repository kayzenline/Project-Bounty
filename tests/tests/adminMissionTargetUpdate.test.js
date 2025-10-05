import { clear } from '../../src/other.js';
import { adminMissionTargetUpdate } from '../../src/mission.js';
import { getData } from '../../src/dataStore.js';

describe('adminMissionTargetUpdate', () => {
  beforeEach(() => {
    clear();
    const missionOrigin = {
      missionId: 1,
      ownerId: 1,
      name: 'Mercury',
      description: "Place a manned spacecraft in orbital flight around the earth. Investigate a persons performance capabilities and their ability to function in the environment of space. Recover the person and the spacecraft safely",
      target: 'Earth orbit',
      timeCreated: 1683125870,
      timeLastEdited: 1683125871,
    };
    const controlUser = {
      controlUserId: 1,
      name: 'Bill Ryker ',
      email: 'strongbeard@starfleet.com.au',
      numSuccessfulLogins: 3,
      numFailedPasswordsSinceLastLogin: 1,
    };
    const data = getData();
    data.missionControlUsers.push(controlUser);
    data.spaceMissions.push(missionOrigin);
  });

  test('check function get a invalid controlUserId', () => {
    const controlUserId1 = 'abc';
    const controlUserId2 = 2;
    const missionId = 1;
    const target = 'xxxxxx';

    const result1 = adminMissionTargetUpdate(controlUserId1, missionId, target);
    expect(result1.error).toContain('controlUserId must be integer');

    const result2 = adminMissionTargetUpdate(controlUserId2, missionId, target);
    expect(result2.error).toContain('controlUserId not found');
  });
  test('check function get a invalid missionId', () => {
    const controlUserId = 1;
    const missionId1 = '1';
    const missionId2 = 2;
    const target = 'xxxxxx';
    const result1 = adminMissionTargetUpdate(controlUserId, missionId1, target);
    expect(result1.error).toContain('missionId must be integer');

    const result2 = adminMissionTargetUpdate(controlUserId, missionId2, target);
    expect(result2.error).toContain('missionId not found');
  });

  test('check function get a invalid target', () => {
    const controlUserId = 1;
    const missionId = 1;
    const target1 = 'x'.repeat(101);
    const target2 = 1;

    const result1 = adminMissionTargetUpdate(controlUserId, missionId, target1);
    expect(result1.error).toContain('target is too long');

    const result2 = adminMissionTargetUpdate(controlUserId, missionId, target2);
    expect(result2.error).toContain('target must be a string');
  });

  test('check function returns correctly', () => {
    const controlUserId = 1;
    const missionId = 1;
    const target = 'xxxxxx';

    const result = adminMissionTargetUpdate(controlUserId, missionId, target);
    expect(result).toEqual({});

    const data = getData();
    const updatedMission = data.spaceMissions.find(m => m.missionId === missionId);
    expect(updatedMission.target).toBe(target);
  });
});