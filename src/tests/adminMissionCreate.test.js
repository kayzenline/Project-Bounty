import { adminMissionCreate } from '../mission.js';
import { adminAuthRegister } from '../auth.js';
import { clear } from '../data.js';
import { errorCategories as EC } from '../testSamples.js';

describe('adminMissionCreate', () => {
  let controlUserId;
// Each test starts from a clean state and a new user
  beforeEach(() => {
    clear();
    const reg = adminAuthRegister('test@example.com', 'password123', 'Neil', 'Armstrong');
    controlUserId = reg.controlUserId;
  });
  test('creates a mission and returns missionId', () => {
    const result = adminMissionCreate(controlUserId, 'Mercury', 'Orbit the Earth', 'Earth orbit');
    expect(result).toEqual(expect.objectContaining({ missionId: expect.any(Number) }));
    expect(result.missionId).toBeGreaterThan(0);
  });
  
  test('creating multiple missions yields distinct ids', () => {
    const a = adminMissionCreate(controlUserId, 'Mercury', 'First mission', 'Earth orbit');
    const b = adminMissionCreate(controlUserId, 'Apollo', 'Moon mission', 'Moon');
    expect(a.missionId).not.toBe(b.missionId);
  });

  test('fails if controlUserId does not exist', () => {
    const res = adminMissionCreate(9999, 'Apollo', 'Moon mission', 'Moon');
    expect(res).toEqual(expect.objectContaining({
      error: expect.any(String),
      errorCategory: EC.INACCESSIBLE_VALUE,
    }));
  });

  test('fails if controlUserId is not an integer', () => {
    const res = adminMissionCreate('abc', 'Apollo', 'Moon mission', 'Moon');
    expect(res).toEqual(expect.objectContaining({
      error: expect.any(String),
      errorCategory: EC.BAD_INPUT,
    }));
  });

});
