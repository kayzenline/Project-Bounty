import { adminAuthRegister, adminAuthLogin } from '../auth.js';
import { clear } from '../data.js';

describe('adminAuthLogin', () => {
  beforeEach(() => {
    clear();
    adminAuthRegister('test@example.com', 'password123', 'John', 'Doe');
  });

  test('successful login', () => {
    const result = adminAuthLogin('test@example.com', 'password123');
    expect(result).toEqual({ controlUserId: expect.any(Number) });
    expect(result.controlUserId).toBeGreaterThan(0);
  });

  test('invalid email format', () => {
    const result = adminAuthLogin('invalid-email', 'password123');
    expect(result).toEqual({ error: 'Invalid email format' });
  });

  test('missing password', () => {
    const result = adminAuthLogin('test@example.com', '');
    expect(result).toEqual({ error: 'Password is required' });
  });

  test('user not found', () => {
    const result = adminAuthLogin('nonexistent@example.com', 'password123');
    expect(result).toEqual({ error: 'User not found' });
  });

  test('incorrect password', () => {
    const result = adminAuthLogin('test@example.com', 'wrongpassword');
    expect(result).toEqual({ error: 'Incorrect password' });
  });
});