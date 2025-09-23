import { clear } from '../other.js';
import { getData } from '../data.js';
import { adminAuthRegister } from '../auth.js';
import { adminMissionCreate } from '../mission.js';

describe('clear', () => {
  test('returns an empty object', () => {
    const res = clear();
    expect(res).toEqual({});
  });

  test('clears all users and missions and resets counters', () => {
    // Start from a clean state
    clear();
    // Create a user and a mission to populate state
    const { controlUserId } = adminAuthRegister('astro@example.com', 'password123', 'Neil', 'Armstrong');
    expect(controlUserId).toEqual(1);
    const created = adminMissionCreate(controlUserId, 'Mercury', 'Orbit the Earth', 'LEO');
    expect(created).toHaveProperty('missionId');
    // Ensure state is populated
    let data = getData();
    expect(data.missionControlUsers.length).toEqual(1);
    expect(data.spaceMissions.length).toEqual(1);
    expect(data.nextControlUserId).toEqual(2);
    expect(data.nextMissionId).toEqual(2);
    // Clear and verify reset
    clear();
    data = getData();
    expect(data.missionControlUsers).toEqual([]);
    expect(data.spaceMissions).toEqual([]);
    expect(data.nextControlUserId).toBe(1);
    expect(data.nextMissionId).toBe(1);
  })
});
