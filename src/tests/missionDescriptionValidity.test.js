import { missionDescriptionValidity } from '../helper.js';

describe('missionDescriptionValidity (spec: string, empty allowed, <= 400 chars)', () => {
  test('valid short description returns as-is', () => {
    expect(missionDescriptionValidity('This is fine')).toBe('This is fine');
  });

  test('empty string is allowed', () => {
    expect(missionDescriptionValidity('')).toBe('');
  });

  test('too long (> 400) throws', () => {
    const longDesc = 'a'.repeat(401);
    expect(() => missionDescriptionValidity(longDesc)).toThrow('description is too long');
  });

  test('non-string throws', () => {
    expect(() => missionDescriptionValidity(123)).toThrow('description must be a string');
    expect(() => missionDescriptionValidity(null)).toThrow('description must be a string');
  });
});