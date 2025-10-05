import { adminAuthRegister, adminAuthLogin } from '../../src/auth.js';
import { clear } from '../../src/other.js';

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
    expect(result).toEqual({ error: 'User not found', errorCategory: 'BAD_INPUT' });
  });

  test('missing password', () => {
    const result = adminAuthLogin('test@example.com', '');
    expect(result).toEqual({ error: 'Password is required', errorCategory: 'BAD_INPUT' });
  });

  test('user not found', () => {
    const result = adminAuthLogin('nonexistent@example.com', 'password123');
    expect(result).toEqual({ error: 'User not found', errorCategory: 'BAD_INPUT' });
  });

  test('incorrect password', () => {
    const result = adminAuthLogin('test@example.com', 'wrongpassword');
    expect(result).toEqual({ error: 'Incorrect password', errorCategory: 'BAD_INPUT' });
  });
});