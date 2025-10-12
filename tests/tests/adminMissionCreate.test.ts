import { adminMissionCreate } from '../../src/mission';
import { adminAuthRegister } from '../../src/auth';
import { clear } from '../../src/other';
import { errorCategories as EC } from '../../src/testSamples';

describe('adminMissionCreate', () => {
  let controlUserId: number;
  // Each test starts from a clean state and a new user
  beforeEach(() => {
    clear();
    const reg = adminAuthRegister('test@example.com', 'password123', 'Neil', 'Armstrong');
    controlUserId = reg.controlUserId;
  });

  test('creates a mission and returns missionId', () => {
    const result = adminMissionCreate(controlUserId, 'Mercury', 'Orbit the Earth', 'Earth orbit');
    expect(result).toEqual(expect.objectContaining({ missionId: expect.any(Number) }));
    expect(result.missionId).toStrictEqual(1);
  });

  test('creating multiple missions yields distinct ids', () => {
    const a = adminMissionCreate(controlUserId, 'Mercury', 'First mission', 'Earth orbit');
    const b = adminMissionCreate(controlUserId, 'Apollo', 'Moon mission', 'Moon');
    expect(a.missionId).not.toBe(b.missionId);
  });

  test('fails if controlUserId does not exist', () => {
    const res = adminMissionCreate(9999, 'Apollo', 'Moon mission', 'Moon');
    expect(res).toStrictEqual({
      error: expect.any(String),
      errorCategory: EC.INVALID_CREDENTIALS
    });
  });
  test('fails if controlUserId is not an integer', () => {
    // @ts-expect-error intentional invalid argument for validation coverage
    const res = adminMissionCreate('abc', 'Apollo', 'Moon mission', 'Moon');
    expect(res).toEqual(expect.objectContaining({
      error: expect.any(String),
      errorCategory: EC.BAD_INPUT,
    }));
  });

  test('fails when mission name already exists for the user', () => {
    adminMissionCreate(controlUserId, 'Mercury', 'First mission', 'Earth orbit');
    const res = adminMissionCreate(controlUserId, 'Mercury', 'Duplicate mission', 'Mars');
    expect(res).toEqual({
      error: 'mission name already exists',
      errorCategory: EC.BAD_INPUT,
    });
  });
});
