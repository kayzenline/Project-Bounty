import { adminAstronautCreate } from '../../src/astronaut';
import { getData, setData, DataStore } from '../../src/dataStore';

describe('adminAstronautCreate', () => {
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

  test('success: creates astronaut with valid data', () => {
    const result = adminAstronautCreate('James', 'Kirk', 'Captain', 30, 70, 180);
    expect(result).toEqual({ astronautId: 1 });

    const data = getData();
    expect(data.astronauts).toHaveLength(1);
    expect(data.astronauts[0]).toEqual({
      astronautId: 1,
      nameFirst: 'James',
      nameLast: 'Kirk',
      rank: 'Captain',
      age: 30,
      weight: 70,
      height: 180,
      timeAdded: expect.any(Number),
      timeLastEdited: expect.any(Number)
    });
  });

  test('error: invalid first name - too short', () => {
    const result = adminAstronautCreate('J', 'Kirk', 'Captain', 30, 70, 180);
    expect(result.error).toBeDefined();
    expect(result.errorCategory).toBe('BAD_INPUT');
  });

  test('error: invalid first name - too long', () => {
    const result = adminAstronautCreate('A'.repeat(21), 'Kirk', 'Captain', 30, 70, 180);
    expect(result.error).toBeDefined();
    expect(result.errorCategory).toBe('BAD_INPUT');
  });

  test('error: invalid first name - invalid characters', () => {
    const result = adminAstronautCreate('James123', 'Kirk', 'Captain', 30, 70, 180);
    expect(result.error).toBeDefined();
    expect(result.errorCategory).toBe('BAD_INPUT');
  });

  test('error: invalid last name - too short', () => {
    const result = adminAstronautCreate('James', 'K', 'Captain', 30, 70, 180);
    expect(result.error).toBeDefined();
    expect(result.errorCategory).toBe('BAD_INPUT');
  });

  test('error: invalid last name - too long', () => {
    const result = adminAstronautCreate('James', 'K'.repeat(21), 'Captain', 30, 70, 180);
    expect(result.error).toBeDefined();
    expect(result.errorCategory).toBe('BAD_INPUT');
  });

  test('error: invalid last name - invalid characters', () => {
    const result = adminAstronautCreate('James', 'Kirk123', 'Captain', 30, 70, 180);
    expect(result.error).toBeDefined();
    expect(result.errorCategory).toBe('BAD_INPUT');
  });

  test('error: invalid rank - too short', () => {
    const result = adminAstronautCreate('James', 'Kirk', 'Cap', 30, 70, 180);
    expect(result.error).toBeDefined();
    expect(result.errorCategory).toBe('BAD_INPUT');
  });

  test('error: invalid rank - too long', () => {
    const result = adminAstronautCreate('James', 'Kirk', 'A'.repeat(51), 30, 70, 180);
    expect(result.error).toBeDefined();
    expect(result.errorCategory).toBe('BAD_INPUT');
  });

  test('error: invalid rank - invalid characters', () => {
    const result = adminAstronautCreate('James', 'Kirk', 'Captain123', 30, 70, 180);
    expect(result.error).toBeDefined();
    expect(result.errorCategory).toBe('BAD_INPUT');
  });

  test('error: invalid age - too young', () => {
    const result = adminAstronautCreate('James', 'Kirk', 'Captain', 19, 70, 180);
    expect(result.error).toBeDefined();
    expect(result.errorCategory).toBe('BAD_INPUT');
  });

  test('error: invalid age - too old', () => {
    const result = adminAstronautCreate('James', 'Kirk', 'Captain', 61, 70, 180);
    expect(result.error).toBeDefined();
    expect(result.errorCategory).toBe('BAD_INPUT');
  });

  test('error: invalid age - not integer', () => {
    const result = adminAstronautCreate('James', 'Kirk', 'Captain', 30.5, 70, 180);
    expect(result.error).toBeDefined();
    expect(result.errorCategory).toBe('BAD_INPUT');
  });

  test('error: invalid weight - too heavy', () => {
    const result = adminAstronautCreate('James', 'Kirk', 'Captain', 30, 101, 180);
    expect(result.error).toBeDefined();
    expect(result.errorCategory).toBe('BAD_INPUT');
  });

  test('error: invalid weight - negative', () => {
    const result = adminAstronautCreate('James', 'Kirk', 'Captain', 30, -1, 180);
    expect(result.error).toBeDefined();
    expect(result.errorCategory).toBe('BAD_INPUT');
  });

  test('error: invalid height - too short', () => {
    const result = adminAstronautCreate('James', 'Kirk', 'Captain', 30, 70, 149);
    expect(result.error).toBeDefined();
    expect(result.errorCategory).toBe('BAD_INPUT');
  });

  test('error: invalid height - too tall', () => {
    const result = adminAstronautCreate('James', 'Kirk', 'Captain', 30, 70, 201);
    expect(result.error).toBeDefined();
    expect(result.errorCategory).toBe('BAD_INPUT');
  });

  test('error: duplicate astronaut name', () => {
    // Create first astronaut
    const result1 = adminAstronautCreate('James', 'Kirk', 'Captain', 30, 70, 180);
    expect(result1).toEqual({ astronautId: 1 });

    // Try to create duplicate
    const result2 = adminAstronautCreate('James', 'Kirk', 'Commander', 35, 75, 185);
    expect(result2.error).toBeDefined();
    expect(result2.errorCategory).toBe('BAD_INPUT');
  });

  test('success: valid rank with parentheses and apostrophes', () => {
    const result = adminAstronautCreate('James', 'O\'Connor', 'Captain (Ret.)', 30, 70, 180);
    expect(result).toEqual({ astronautId: 1 });
  });

  test('success: valid names with hyphens and apostrophes', () => {
    const result = adminAstronautCreate('Jean-Luc', 'O\'Brien', 'Captain', 30, 70, 180);
    expect(result).toEqual({ astronautId: 1 });
  });

  test('success: boundary values for age', () => {
    const result1 = adminAstronautCreate('James', 'Kirk', 'Captain', 20, 70, 180);
    expect(result1).toEqual({ astronautId: 1 });

    const result2 = adminAstronautCreate('James', 'Spock', 'Commander', 60, 70, 180);
    expect(result2).toEqual({ astronautId: 2 });
  });

  test('success: boundary values for weight', () => {
    const result = adminAstronautCreate('James', 'Kirk', 'Captain', 30, 100, 180);
    expect(result).toEqual({ astronautId: 1 });
  });

  test('success: boundary values for height', () => {
    const result1 = adminAstronautCreate('James', 'Kirk', 'Captain', 30, 70, 150);
    expect(result1).toEqual({ astronautId: 1 });

    const result2 = adminAstronautCreate('James', 'Spock', 'Commander', 30, 70, 200);
    expect(result2).toEqual({ astronautId: 2 });
  });

  test('success: multiple astronauts with different names', () => {
    const result1 = adminAstronautCreate('James', 'Kirk', 'Captain', 30, 70, 180);
    expect(result1).toEqual({ astronautId: 1 });

    const result2 = adminAstronautCreate('Spock', 'Vulcan', 'Commander', 35, 75, 185);
    expect(result2).toEqual({ astronautId: 2 });

    const data = getData();
    expect(data.astronauts).toHaveLength(2);
  });
});
