import { adminAstronautInfo, adminAstronautCreate } from '../../src/astronaut';
import { getData, setData, DataStore } from '../../src/dataStore';

describe('adminAstronautInfo', () => {
  beforeEach(() => {
    // Reset data to initial state
    const initialData: DataStore = {
      controlUsers: [],
      spaceMissions: [],
      astronauts: [],
      nextControlUserId: 1,
      nextMissionId: 1,
      nextAstronautId: 1,
      sessions: []
    };
    setData(initialData);
  });

  test('success: returns astronaut info', () => {
    // Create an astronaut first
    const createResult = adminAstronautCreate('James', 'Kirk', 'Captain', 30, 70, 180);
    expect(createResult).toEqual({ astronautId: 1 });

    const result = adminAstronautInfo(1);
    expect(result).toEqual({
      astronautId: 1,
      designation: 'Captain James Kirk',
      timeAdded: expect.any(Number),
      timeLastEdited: expect.any(Number),
      age: 30,
      weight: 70,
      height: 180,
      assignedMission: null
    });
  });

  test('error: invalid astronaut ID - negative number', () => {
    const result = adminAstronautInfo(-1);
    expect(result.error).toBeDefined();
    expect(result.errorCategory).toBe('BAD_INPUT');
  });

  test('error: invalid astronaut ID - zero', () => {
    const result = adminAstronautInfo(0);
    expect(result.error).toBeDefined();
    expect(result.errorCategory).toBe('BAD_INPUT');
  });

  test('error: astronaut not found', () => {
    const result = adminAstronautInfo(999);
    expect(result.error).toBeDefined();
    expect(result.errorCategory).toBe('BAD_INPUT');
  });

  test('success: astronaut with special characters in name', () => {
    const createResult = adminAstronautCreate('Jean-Luc', 'O\'Connor', 'Captain (Ret.)', 30, 70, 180);
    expect(createResult).toEqual({ astronautId: 1 });

    const result = adminAstronautInfo(1);
    expect(result.designation).toBe('Captain (Ret.) Jean-Luc O\'Connor');
  });

  test('success: multiple astronauts', () => {
    // Create first astronaut
    const createResult1 = adminAstronautCreate('James', 'Kirk', 'Captain', 30, 70, 180);
    expect(createResult1).toEqual({ astronautId: 1 });

    // Create second astronaut
    const createResult2 = adminAstronautCreate('Spock', 'Vulcan', 'Commander', 35, 75, 185);
    expect(createResult2).toEqual({ astronautId: 2 });

    // Get first astronaut
    const result1 = adminAstronautInfo(1);
    expect(result1.designation).toBe('Captain James Kirk');

    // Get second astronaut
    const result2 = adminAstronautInfo(2);
    expect(result2.designation).toBe('Commander Spock Vulcan');
  });

  test('success: astronaut with boundary values', () => {
    const createResult = adminAstronautCreate('Test', 'User', 'Captain', 20, 100, 150);
    expect(createResult).toEqual({ astronautId: 1 });

    const result = adminAstronautInfo(1);
    expect(result).toEqual({
      astronautId: 1,
      designation: 'Captain Test User',
      timeAdded: expect.any(Number),
      timeLastEdited: expect.any(Number),
      age: 20,
      weight: 100,
      height: 150,
      assignedMission: null
    });
  });

  test('success: verify timestamps are reasonable', () => {
    const beforeCreate = Math.floor(Date.now() / 1000);

    const createResult = adminAstronautCreate('James', 'Kirk', 'Captain', 30, 70, 180);
    expect(createResult).toEqual({ astronautId: 1 });

    const afterCreate = Math.floor(Date.now() / 1000);
    const result = adminAstronautInfo(1);

    expect(result.timeAdded).toBeGreaterThanOrEqual(beforeCreate);
    expect(result.timeAdded).toBeLessThanOrEqual(afterCreate);
    expect(result.timeLastEdited).toBeGreaterThanOrEqual(beforeCreate);
    expect(result.timeLastEdited).toBeLessThanOrEqual(afterCreate);
  });

  test('success: astronaut with assigned mission', () => {
    // Create an astronaut
    const createResult = adminAstronautCreate('James', 'Kirk', 'Captain', 30, 70, 180);
    expect(createResult).toEqual({ astronautId: 1 });

    // Manually assign a mission to the astronaut
    const data = getData();
    data.astronauts[0].assignedMissionId = 1;

    // Create a mock mission
    data.spaceMissions.push({
      missionId: 1,
      controlUserId: 1,
      name: 'Mercury',
      description: 'Test mission',
      target: 'Earth Orbit',
      timeCreated: Math.floor(Date.now() / 1000),
      timeLastEdited: Math.floor(Date.now() / 1000)
    });
    setData(data);

    const result = adminAstronautInfo(1);
    expect(result.assignedMission).toEqual({
      missionId: 1,
      objective: '[Earth Orbit] Mercury'
    });
  });
});
