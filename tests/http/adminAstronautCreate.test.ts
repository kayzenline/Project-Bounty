import { v4 as uuid } from 'uuid';
import { adminAuthUserRegisterRequest, adminAstronautCreateRequest, clearRequest } from './requestHelpers';

function uniqueEmail(prefix = 'user') {
  return `${prefix}.${uuid().split('-').pop() || ''}@example.com`;
}

describe('POST /v1/admin/astronaut', () => {
  let controlUserSessionId: string;

  beforeEach(() => {
    const clearRes = clearRequest();
    expect(clearRes.statusCode).toBe(200);

    const email = uniqueEmail('success');
    const password = 'password123';
    const nameFirst = 'John';
    const nameLast = 'Doe';
    const registerRes = adminAuthUserRegisterRequest(email, password, nameFirst, nameLast);
    expect(registerRes.statusCode).toBe(200);
    controlUserSessionId = registerRes.body.controlUserSessionId;
  });

  describe('success: creates astronaut with valid data', () => {
    test('should create astronaut successfully', () => {
      const nameFirst = 'James';
      const nameLast = 'Kirk';
      const rank = 'Captain';
      const age = 30;
      const weight = 75;
      const height = 180;

      const response = adminAstronautCreateRequest(
        controlUserSessionId,
        nameFirst,
        nameLast,
        rank,
        age,
        weight,
        height
      );

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('astronautId');
      expect(typeof response.body.astronautId).toBe('number');
    });
  });

  describe('error: missing controlUserSessionId header', () => {
    test('should return 401 when header is missing', () => {
      const nameFirst = 'James';
      const nameLast = 'Kirk';
      const rank = 'Captain';
      const age = 30;
      const weight = 75;
      const height = 180;

      const response = adminAstronautCreateRequest(
        '', // Empty session ID
        nameFirst,
        nameLast,
        rank,
        age,
        weight,
        height
      );

      expect(response.statusCode).toBe(401);
      expect(response.body.error).toBe('ControlUserSessionId is empty or invalid');
    });
  });

  describe('error: invalid controlUserSessionId', () => {
    test('should return 401 when session ID is invalid', () => {
      const nameFirst = 'James';
      const nameLast = 'Kirk';
      const rank = 'Captain';
      const age = 30;
      const weight = 75;
      const height = 180;

      const response = adminAstronautCreateRequest(
        'invalid-session-id',
        nameFirst,
        nameLast,
        rank,
        age,
        weight,
        height
      );

      expect(response.statusCode).toBe(401);
      expect(response.body.error).toBe('ControlUserSessionId is empty or invalid');
    });
  });

  describe('error: duplicate astronaut name', () => {
    test('should return 400 when astronaut with same name already exists', () => {
      const nameFirst = 'James';
      const nameLast = 'Kirk';
      const rank = 'Captain';
      const age = 30;
      const weight = 75;
      const height = 180;

      // Create first astronaut
      const firstResponse = adminAstronautCreateRequest(
        controlUserSessionId,
        nameFirst,
        nameLast,
        rank,
        age,
        weight,
        height
      );
      expect(firstResponse.statusCode).toBe(200);

      // Try to create second astronaut with same name
      const secondResponse = adminAstronautCreateRequest(
        controlUserSessionId,
        nameFirst,
        nameLast,
        rank,
        age,
        weight,
        height
      );

      expect(secondResponse.statusCode).toBe(400);
      expect(secondResponse.body.error).toBe('another astronaut already exists');
    });
  });

  describe('error: invalid first name', () => {
    test('should return 400 when first name is too short', () => {
      const response = adminAstronautCreateRequest(
        controlUserSessionId,
        'A', // Too short
        'Kirk',
        'Captain',
        30,
        75,
        180
      );

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('get an invalid name');
    });

    test('should return 400 when first name is too long', () => {
      const response = adminAstronautCreateRequest(
        controlUserSessionId,
        'A'.repeat(21), // Too long
        'Kirk',
        'Captain',
        30,
        75,
        180
      );

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('get an invalid name');
    });

    test('should return 400 when first name has invalid characters', () => {
      const response = adminAstronautCreateRequest(
        controlUserSessionId,
        'James123', // Invalid characters
        'Kirk',
        'Captain',
        30,
        75,
        180
      );

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('get an invalid name');
    });
  });

  describe('error: invalid last name', () => {
    test('should return 400 when last name is too short', () => {
      const response = adminAstronautCreateRequest(
        controlUserSessionId,
        'James',
        'K', // Too short
        'Captain',
        30,
        75,
        180
      );

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('get an invalid name');
    });

    test('should return 400 when last name is too long', () => {
      const response = adminAstronautCreateRequest(
        controlUserSessionId,
        'James',
        'K'.repeat(21), // Too long
        'Captain',
        30,
        75,
        180
      );

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('get an invalid name');
    });

    test('should return 400 when last name has invalid characters', () => {
      const response = adminAstronautCreateRequest(
        controlUserSessionId,
        'James',
        'Kirk123', // Invalid characters
        'Captain',
        30,
        75,
        180
      );

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('get an invalid name');
    });
  });

  describe('error: invalid rank', () => {
    test('should return 400 when rank is too short', () => {
      const response = adminAstronautCreateRequest(
        controlUserSessionId,
        'James',
        'Kirk',
        'Cap', // Too short
        30,
        75,
        180
      );

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('get an invalid rank');
    });

    test('should return 400 when rank is too long', () => {
      const response = adminAstronautCreateRequest(
        controlUserSessionId,
        'James',
        'Kirk',
        'C'.repeat(51), // Too long
        30,
        75,
        180
      );

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('get an invalid rank');
    });

    test('should return 400 when rank has invalid characters', () => {
      const response = adminAstronautCreateRequest(
        controlUserSessionId,
        'James',
        'Kirk',
        'Captain123', // Invalid characters
        30,
        75,
        180
      );

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('get an invalid rank');
    });
  });

  describe('error: invalid age', () => {
    test('should return 400 when age is too young', () => {
      const response = adminAstronautCreateRequest(
        controlUserSessionId,
        'James',
        'Kirk',
        'Captain',
        19, // Too young
        75,
        180
      );

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('astronaut age is not meet the requirements');
    });

    test('should return 400 when age is too old', () => {
      const response = adminAstronautCreateRequest(
        controlUserSessionId,
        'James',
        'Kirk',
        'Captain',
        61, // Too old
        75,
        180
      );

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('astronaut age is not meet the requirements');
    });

    test('should return 400 when age is not integer', () => {
      const response = adminAstronautCreateRequest(
        controlUserSessionId,
        'James',
        'Kirk',
        'Captain',
        30.5, // Not integer
        75,
        180
      );

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('astronaut age is not meet the requirements');
    });
  });

  describe('error: invalid weight', () => {
    test('should return 400 when weight is too heavy', () => {
      const response = adminAstronautCreateRequest(
        controlUserSessionId,
        'James',
        'Kirk',
        'Captain',
        30,
        101, // Too heavy
        180
      );

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('astronaut overweight');
    });
  });

  describe('error: invalid height', () => {
    test('should return 400 when height is too short', () => {
      const response = adminAstronautCreateRequest(
        controlUserSessionId,
        'James',
        'Kirk',
        'Captain',
        30,
        75,
        149 // Too short
      );

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('astronaut height does not meet the requirements');
    });

    test('should return 400 when height is too tall', () => {
      const response = adminAstronautCreateRequest(
        controlUserSessionId,
        'James',
        'Kirk',
        'Captain',
        30,
        75,
        201 // Too tall
      );

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('astronaut height does not meet the requirements');
    });
  });

  describe('success: valid rank with parentheses and apostrophes', () => {
    test('should accept rank with parentheses and apostrophes', () => {
      const response = adminAstronautCreateRequest(
        controlUserSessionId,
        'James',
        'Kirk',
        'Captain (Senior)',
        30,
        75,
        180
      );

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('astronautId');
    });
  });

  describe('success: valid names with hyphens and apostrophes', () => {
    test('should accept names with hyphens and apostrophes', () => {
      const response = adminAstronautCreateRequest(
        controlUserSessionId,
        'Jean-Luc',
        "O'Connor",
        'Captain',
        30,
        75,
        180
      );

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('astronautId');
    });
  });

  describe('success: boundary values for age', () => {
    test('should accept minimum age', () => {
      const response = adminAstronautCreateRequest(
        controlUserSessionId,
        'James',
        'Kirk',
        'Captain',
        20, // Minimum age
        75,
        180
      );

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('astronautId');
    });

    test('should accept maximum age', () => {
      const response = adminAstronautCreateRequest(
        controlUserSessionId,
        'James',
        'Kirk',
        'Captain',
        60, // Maximum age
        75,
        180
      );

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('astronautId');
    });
  });

  describe('success: boundary values for weight', () => {
    test('should accept maximum weight', () => {
      const response = adminAstronautCreateRequest(
        controlUserSessionId,
        'James',
        'Kirk',
        'Captain',
        30,
        100, // Maximum weight
        180
      );

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('astronautId');
    });
  });

  describe('success: boundary values for height', () => {
    test('should accept minimum height', () => {
      const response = adminAstronautCreateRequest(
        controlUserSessionId,
        'James',
        'Kirk',
        'Captain',
        30,
        75,
        150 // Minimum height
      );

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('astronautId');
    });

    test('should accept maximum height', () => {
      const response = adminAstronautCreateRequest(
        controlUserSessionId,
        'James',
        'Kirk',
        'Captain',
        30,
        75,
        200 // Maximum height
      );

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('astronautId');
    });
  });
});
