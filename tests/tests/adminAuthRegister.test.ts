import { adminAuthRegister } from '../../src/auth';
import { clear } from '../../src/other';
describe('adminAuthRegister', () => {
  beforeEach(() => {
    clear();
  });

  test('successful registration', () => {
    const result = adminAuthRegister('test@example.com', 'password123', 'John', 'Doe');
    expect(result).toEqual({ controlUserSessionId: expect.any(String) });
    expect(result.controlUserSessionId).toBeDefined();
  });

  test('invalid email format', () => {
    const result = adminAuthRegister('invalid-email', 'password123', 'John', 'Doe');
    expect(result).toEqual({ error: 'Invalid email format', errorCategory: 'BAD_INPUT' });
  });

  test('password too short', () => {
    const result = adminAuthRegister('test@example.com', 'short', 'John', 'Doe');
    expect(result).toEqual({ error: 'Password must be at least 8 characters long', errorCategory: 'BAD_INPUT' });
  });

  test('invalid first name', () => {
    const result = adminAuthRegister('test@example.com', 'password123', '', 'Doe');
    expect(result).toEqual({ error: 'Invalid first name content', errorCategory: 'BAD_INPUT' });
  });

  test('invalid last name', () => {
    const result = adminAuthRegister('test@example.com', 'password123', 'John', '');
    expect(result).toEqual({ error: 'Invalid last name content', errorCategory: 'BAD_INPUT' });
  });

  test('email already registered', () => {
    adminAuthRegister('test@example.com', 'password123', 'John', 'Doe');
    const result = adminAuthRegister('test@example.com', 'password456', 'Jane', 'Smith');
    expect(result).toEqual({ error: 'Email already registered', errorCategory: 'BAD_INPUT' });
  });
});
