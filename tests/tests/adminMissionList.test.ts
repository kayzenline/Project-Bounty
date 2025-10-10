import { adminAuthRegister } from '../../src/auth';
import { getData } from '../../src/dataStore';
import { adminMissionCreate, adminMissionList } from '../../src/mission';
import { clear } from '../../src/other';
import { errorCategories as EC } from '../../src/testSamples';

beforeEach(() => clear());

describe('adminMissionList', () => {
  test('happy path: list missions for a user', () => {
    const { controlUserId } = adminAuthRegister('a@b.com', 'Abcd1234', 'Amy', 'Pond');

    const m1 = adminMissionCreate(controlUserId, 'Mars Mission', 'desc1', 'Mars');
    const m2 = adminMissionCreate(controlUserId, 'Venus Mission', 'desc2', 'Venus');

    const res = adminMissionList(controlUserId);
    if (!('missions' in res)) {
      throw new Error(`Expected missions list but received error: ${JSON.stringify(res)}`);
    }
    expect(res.missions).toEqual(
      expect.arrayContaining([
        { missionId: m1.missionId, name: 'Mars Mission' },
        { missionId: m2.missionId, name: 'Venus Mission' },
      ])
    );
  });

  test('INVALID_CREDENTIALS: user not found', () => {
    const res = adminMissionList(999999);
    if (!('errorCategory' in res)) {
      throw new Error('Expected error response for invalid controlUserId');
    }
    expect(res.errorCategory).toBe('INVALID_CREDENTIALS');
  });

  test('empty list when user has no missions', () => {
    const { controlUserId } = adminAuthRegister('x@y.com', 'Abcd1234', 'River', 'Song');
    const res = adminMissionList(controlUserId);
    if (!('missions' in res)) {
      throw new Error(`Expected empty missions list but received error: ${JSON.stringify(res)}`);
    }
    expect(res.missions).toEqual([]);
  });

  test('unknown error when data store is corrupted', () => {
    const { controlUserId } = adminAuthRegister('glitch@example.com', 'Abcd1234', 'Rose', 'Tyler');
    const data = getData();
    // @ts-expect-error intentional invalid type for validation check
    data.spaceMissions = {};
    const res = adminMissionList(controlUserId);
    if (!('errorCategory' in res)) {
      throw new Error('Expected error response when data store corrupted');
    }
    expect(res).toEqual({
      error: expect.stringContaining('filter'),
      errorCategory: EC.UNKNOWN,
    });
  });
});
