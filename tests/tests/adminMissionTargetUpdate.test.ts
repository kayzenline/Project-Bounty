import { clear } from '../../src/other';
import { adminMissionTargetUpdate } from '../../src/mission';
import { getData, Mission, MissionControlUser } from '../../src/dataStore';

describe('adminMissionTargetUpdate', () => {
  beforeEach(() => {
    clear();
    const missionOrigin: Mission = {
      missionId: 1,
      controlUserId: 1,
      name: 'Mercury',
      description: 'Place a manned spacecraft in orbital flight around the earth. Investigate a persons performance capabilities and their ability to function in the environment of space. Recover the person and the spacecraft safely',
      target: 'Earth orbit',
      timeCreated: 1683125870,
      timeLastEdited: 1683125871,
    };
    const controlUser: MissionControlUser = {
      controlUserId: 1,
      email: 'strongbeard@starfleet.com.au',
      password: 'xxxxxxxxx',
      nameFirst: 'Bill',
      nameLast: 'Ryker',
      numSuccessfulLogins: 3,
      numFailedPasswordsSinceLastLogin: 1,
      passwordHistory: ['xxxxxxxxx'],
    };
    const data = getData();
    data.controlUsers.push(controlUser);
    data.spaceMissions.push(missionOrigin);
  });

  test('check function get a invalid controlUserId', () => {
    const controlUserId1 = 'abc';
    const controlUserId2 = 2;
    const missionId = 1;
    const target = 'xxxxxx';

    // @ts-expect-error intentional invalid type to test validation path
    const result1 = adminMissionTargetUpdate(controlUserId1, missionId, target);
    if (!('error' in result1)) {
      throw new Error('Expected error for non-integer controlUserId');
    }
    expect(result1.error).toContain('controlUserId must be integer');

    const result2 = adminMissionTargetUpdate(controlUserId2, missionId, target);
    if (!('error' in result2)) {
      throw new Error('Expected error for unknown controlUserId');
    }
    expect(result2.error).toContain('controlUserId not found');
  });
  test('check function get a invalid missionId', () => {
    const controlUserId = 1;
    const missionId1 = '1';
    const missionId2 = 2;
    const target = 'xxxxxx';
    // @ts-expect-error intentional invalid type to test validation path
    const result1 = adminMissionTargetUpdate(controlUserId, missionId1, target);
    if (!('error' in result1)) {
      throw new Error('Expected error for non-integer missionId');
    }
    expect(result1.error).toContain('missionId must be integer');

    const result2 = adminMissionTargetUpdate(controlUserId, missionId2, target);
    if (!('error' in result2)) {
      throw new Error('Expected error for unknown missionId');
    }
    expect(result2.error).toContain('missionId not found');
  });

  test('check function get a invalid target', () => {
    const controlUserId = 1;
    const missionId = 1;
    const target1 = 'x'.repeat(101);
    const target2 = 1;

    const result1 = adminMissionTargetUpdate(controlUserId, missionId, target1);
    if (!('error' in result1)) {
      throw new Error('Expected error for long target');
    }
    expect(result1.error).toContain('target is too long');

    // @ts-expect-error intentional invalid type to test validation path
    const result2 = adminMissionTargetUpdate(controlUserId, missionId, target2);
    if (!('error' in result2)) {
      throw new Error('Expected error for non-string target');
    }
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
    if (!updatedMission) {
      throw new Error('Expected mission to exist after update');
    }
    expect(updatedMission.target).toBe(target);
  });
});
