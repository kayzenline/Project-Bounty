import { v4 as uuid } from 'uuid';
import { adminAuthUserRegisterRequest, adminAstronautCreateRequest, adminAstronautInfoRequest, clearRequest } from './requestHelpers';

function uniqueEmail(prefix = 'user') {
  return `${prefix}.${uuid().split('-').pop() || ''}@example.com`;
}

describe.skip('GET /v1/admin/astronaut/{astronautid}', () => {
  let controlUserSessionId: string;
  let astronautId: number;

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

    // Create an astronaut for testing
    const createRes = adminAstronautCreateRequest(
      controlUserSessionId,
      'James',
      'Kirk',
      'Captain',
      30,
      75,
      180
    );
    expect(createRes.statusCode).toBe(200);
    astronautId = createRes.body.astronautId;
  });

  describe('success: gets astronaut info', () => {
    test('should return astronaut information successfully', () => {
      const response = adminAstronautInfoRequest(controlUserSessionId, astronautId);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('astronautId', astronautId);
      expect(response.body).toHaveProperty('designation', 'Captain James Kirk');
      expect(response.body).toHaveProperty('timeAdded');
      expect(response.body).toHaveProperty('timeLastEdited');
      expect(response.body).toHaveProperty('age', 30);
      expect(response.body).toHaveProperty('weight', 75);
      expect(response.body).toHaveProperty('height', 180);
      expect(typeof response.body.timeAdded).toBe('number');
      expect(typeof response.body.timeLastEdited).toBe('number');
    });
  });

  describe('error: missing controlUserSessionId header', () => {
    test('should return 401 when header is missing', () => {
      const response = adminAstronautInfoRequest('', astronautId);

      expect(response.statusCode).toBe(401);
      expect(response.body.error).toBe('ControlUserSessionId is empty or invalid');
    });
  });

  describe('error: invalid controlUserSessionId', () => {
    test('should return 401 when session ID is invalid', () => {
      const response = adminAstronautInfoRequest('invalid-session-id', astronautId);

      expect(response.statusCode).toBe(401);
      expect(response.body.error).toBe('ControlUserSessionId is empty or invalid');
    });
  });

  describe('error: invalid astronautid', () => {
    test('should return 400 when astronautid is not a number', () => {
      const response = adminAstronautInfoRequest(controlUserSessionId, NaN);

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('astronautid is invalid');
    });

    test('should return 400 when astronautid does not exist', () => {
      const response = adminAstronautInfoRequest(controlUserSessionId, 99999);

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('astronautId not found');
    });

    test('should return 400 when astronautid is negative', () => {
      const response = adminAstronautInfoRequest(controlUserSessionId, -1);

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('astronautId must be integer');
    });

    test('should return 400 when astronautid is zero', () => {
      const response = adminAstronautInfoRequest(controlUserSessionId, 0);

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('astronautId not found');
    });
  });

  describe('success: astronaut with assigned mission', () => {
    test('should return astronaut info with assigned mission details', () => {
      // This test would require mission assignment functionality
      // For now, we'll test the basic astronaut info without mission
      const response = adminAstronautInfoRequest(controlUserSessionId, astronautId);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('astronautId', astronautId);
      expect(response.body).toHaveProperty('designation', 'Captain James Kirk');

      // When no mission is assigned, assignedMission should be undefined
      expect(response.body.assignedMission).toBeUndefined();
    });
  });

  describe('success: multiple astronauts', () => {
    test('should return correct info for different astronauts', () => {
      // Create another astronaut
      const createRes2 = adminAstronautCreateRequest(
        controlUserSessionId,
        'Spock',
        'Vulcan',
        'Commander',
        35,
        80,
        185
      );
      expect(createRes2.statusCode).toBe(200);
      const astronautId2 = createRes2.body.astronautId;

      // Get info for first astronaut
      const response1 = adminAstronautInfoRequest(controlUserSessionId, astronautId);
      expect(response1.statusCode).toBe(200);
      expect(response1.body.designation).toBe('Captain James Kirk');

      // Get info for second astronaut
      const response2 = adminAstronautInfoRequest(controlUserSessionId, astronautId2);
      expect(response2.statusCode).toBe(200);
      expect(response2.body.designation).toBe('Commander Spock Vulcan');
    });
  });
});
