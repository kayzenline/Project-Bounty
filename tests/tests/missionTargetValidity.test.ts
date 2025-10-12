import { missionTargetValidity } from '../../src/helper';

describe('missionTargetValidity (spec: string, empty allowed, <= 100 chars)', () => {
  test('valid short target returns as-is', () => {
    expect(missionTargetValidity('Mars')).toBe('Mars');
    expect(missionTargetValidity('Low Earth Orbit')).toBe('Low Earth Orbit');
  });

  test('empty string is allowed', () => {
    expect(missionTargetValidity('')).toBe('');
  });

  test('too long (> 100) throws', () => {
    const longTarget = 'x'.repeat(101);
    expect(() => missionTargetValidity(longTarget)).toThrow('target is too long');
  });

  test('non-string throws', () => {
    expect(() =>
      // @ts-expect-error testing invalid number argument
      missionTargetValidity(456)).toThrow('target must be a string');
    expect(() => missionTargetValidity(undefined)).toThrow('target must be a string');
  });
});
