import { adminAuthRegister } from '../../src/auth.js';
import { getData } from '../../src/data.js';
import { adminMissionCreate, adminMissionList } from '../../src/mission.js';
import { clear } from '../../src/other.js';
import { errorCategories as EC } from '../../src/testSamples.js';

beforeEach(() => clear());

describe('adminMissionList', () => {
  test('happy path: list missions for a user', () => {
    const { controlUserId } = adminAuthRegister('a@b.com', 'Abcd1234', 'Amy', 'Pond');

    const m1 = adminMissionCreate(controlUserId, 'Mars Mission', 'desc1', 'Mars');
    const m2 = adminMissionCreate(controlUserId, 'Venus Mission', 'desc2', 'Venus');

    const res = adminMissionList(controlUserId);

    expect(res.missions).toEqual(
      expect.arrayContaining([
        { missionId: m1.missionId, name: 'Mars Mission' },
        { missionId: m2.missionId, name: 'Venus Mission' },
      ])
    );
  });

  test('INVALID_CREDENTIALS: user not found', () => {
    const res = adminMissionList(999999);
    expect(res.errorCategory).toBe('INVALID_CREDENTIALS');
  });

  test('empty list when user has no missions', () => {
    const { controlUserId } = adminAuthRegister('x@y.com', 'Abcd1234', 'River', 'Song');
    const res = adminMissionList(controlUserId);
    expect(res.missions).toEqual([]);
  });

  test('unknown error when data store is corrupted', () => {
    const { controlUserId } = adminAuthRegister('glitch@example.com', 'Abcd1234', 'Rose', 'Tyler');
    const data = getData();
    data.spaceMissions = {};
    const res = adminMissionList(controlUserId);
    expect(res).toEqual({
      error: expect.stringContaining('filter'),
      errorCategory: EC.UNKNOWN,
    });
  });
});
