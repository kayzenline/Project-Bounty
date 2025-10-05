import { adminMissionCreate, adminMissionInfo } from '../../src/mission.js';
import { adminAuthRegister } from '../../src/auth.js';
import { clear } from '../../src/other.js';
import { errorCategories as EC } from '../../src/testSamples.js';

describe('adminMissionInfo', () => {
  let controlUserId;

  beforeEach(() => {
    clear();
    const reg = adminAuthRegister('testo@example.com', 'password123', 'John', 'Glenn');
    controlUserId = reg.controlUserId;
  });

  test('returns info for a created mission', () => {
    const created = adminMissionCreate(controlUserId, 'Mercury', 'Orbit the Earth', 'Earth orbit');
    const res = adminMissionInfo(controlUserId, created.missionId);
    expect(res).toEqual(expect.objectContaining({
      missionId: created.missionId,
      name: 'Mercury',
      description: 'Orbit the Earth',
      target: 'Earth orbit',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
    }));
    expect(res.timeLastEdited).toBeGreaterThanOrEqual(res.timeCreated);
  });

  test('fails when missionId does not exist', () => {
    const res = adminMissionInfo(controlUserId, 99999);
    expect(res).toEqual(expect.objectContaining({
      error: expect.any(String),
      errorCategory: EC.INACCESSIBLE_VALUE,
    }));
  });

  test('fails when controlUserId is invalid', () => {
    const res = adminMissionInfo('abc', 1);
    expect(res).toStrictEqual({
      error: expect.any(String),
      errorCategory: EC.BAD_INPUT,
    });
  });

  test('fails when mission belongs to another user', () => {
    const a = adminAuthRegister('a@b.com', 'pass1234', 'Alice', 'User');
    const b = adminAuthRegister('b@b.com', 'pass1234', 'Bob', 'User');
    const { missionId } = adminMissionCreate(a.controlUserId, 'Apollo', 'Moon mission', 'Moon');
    const res = adminMissionInfo(b.controlUserId, missionId);
    expect(res).toStrictEqual({
      error: expect.any(String),
      errorCategory: EC.INACCESSIBLE_VALUE
    })


  });

});
