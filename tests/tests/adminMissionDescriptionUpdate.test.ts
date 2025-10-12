import { clear } from '../../src/other';
import { adminMissionDescriptionUpdate } from '../../src/mission';
import { getData, Mission } from '../../src/dataStore';

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
    const controlUser = {
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
    const description = 'xxxxxx';
    // @ts-expect-error intentional invalid type for validation
    const result1 = adminMissionDescriptionUpdate(controlUserId1, missionId, description);
    expect(result1.error).toContain('controlUserId must be integer');
    const result2 = adminMissionDescriptionUpdate(controlUserId2, missionId, description);
    expect(result2.error).toContain('controlUserId not found');
  });
  test('check function get a invalid missionId', () => {
    const controlUserId = 1;
    const missionId1 = '1';
    const missionId2 = 2;
    const description = 'xxxxxx';
    // @ts-expect-error intentional invalid type for validation
    const result1 = adminMissionDescriptionUpdate(controlUserId, missionId1, description);
    expect(result1.error).toContain('missionId must be integer');

    const result2 = adminMissionDescriptionUpdate(controlUserId, missionId2, description);
    expect(result2.error).toContain('missionId not found');
  });

  test('check function get a invalid description', () => {
    const controlUserId = 1;
    const missionId = 1;
    const description1 = 'x'.repeat(401);
    const description2 = 1;
    const result1 = adminMissionDescriptionUpdate(controlUserId, missionId, description1);
    expect(result1.error).toContain('description is too long');
    // @ts-expect-error intentional invalid type for validation
    const result2 = adminMissionDescriptionUpdate(controlUserId, missionId, description2);
    expect(result2.error).toContain('description must be a string');
  });

  test('check function returns correctly', () => {
    const controlUserId = 1;
    const missionId = 1;
    const description = 'xxxxxx';
    const result = adminMissionDescriptionUpdate(controlUserId, missionId, description);
    expect(result).toEqual({});
    const data = getData();
    const updatedMission = data.spaceMissions.find(m => m.missionId === missionId);
    if (!updatedMission) {
      throw new Error('Expected mission to exist in test setup');
    }
    expect(updatedMission.description).toBe(description);
  });
});
