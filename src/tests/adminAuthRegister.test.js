import { adminAuthRegister } from '../auth.js';
import { clear } from '../other.js';
describe('adminAuthRegister', () => {
  beforeEach(() => {
    clear();
  });

  test('successful registration', () => {
    const result = adminAuthRegister('test@example.com', 'password123', 'John', 'Doe');
    expect(result).toEqual({ controlUserId: expect.any(Number) });
    expect(result.controlUserId).toBeGreaterThan(0);
  });

  test('invalid email format', () => {
    const result = adminAuthRegister('invalid-email', 'password123', 'John', 'Doe');
    expect(result).toEqual({ error: 'Invalid email format' });
  });

  test('password too short', () => {
    const result = adminAuthRegister('test@example.com', 'short', 'John', 'Doe');
    expect(result).toEqual({ error: 'Password must be at least 8 characters long' });
  });

  test('invalid first name', () => {
    const result = adminAuthRegister('test@example.com', 'password123', '', 'Doe');
    expect(result).toEqual({ error: 'Invalid first name' });
  });

  test('invalid last name', () => {
    const result = adminAuthRegister('test@example.com', 'password123', 'John', '');
    expect(result).toEqual({ error: 'Invalid last name' });
  });

  test('email already registered', () => {
    adminAuthRegister('test@example.com', 'password123', 'John', 'Doe');
    const result = adminAuthRegister('test@example.com', 'password456', 'Jane', 'Smith');
    expect(result).toEqual({ error: 'Email already registered' });
  });
});
