import { v4 as uuid } from 'uuid';
import { AstronautResponse, AssignedMission } from '../../src/astronaut';
import { adminAuthUserRegisterRequest, adminMissionCreateRequest, adminAstronautCreateRequest, adminAstronautInfoRequest, clearRequest, adminAstronautAssignRequest } from './requestHelpers';

function uniqueEmail(prefix = 'user') {
  return `${prefix}.${uuid().split('-').pop() || ''}@example.com`;
}

describe('GET /v1/admin/astronaut/{astronautid}', () => {
  let controlUserSessionId: string;
  let astronautId: number;
  let missionId: number;
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
    const mission = {
      name: 'Mercury',
      description: 'Place a manned spacecraft in orbital flight around the earth. Investigate a persons performance capabilities and their ability to function in the environment of space. Recover the person and the spacecraft safely',
      target: 'Earth orbit',
    };
    const missionRes = adminMissionCreateRequest(controlUserSessionId, mission.name, mission.description, mission.target);
    expect(missionRes.statusCode).toBe(200);
    missionId = missionRes.body.missionId;

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
      InfoResCheck(response);
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
      const assignRes = adminAstronautAssignRequest(controlUserSessionId, astronautId, missionId);
      expect(assignRes.statusCode).toBe(200);
      const response = adminAstronautInfoRequest(controlUserSessionId, astronautId);
      InfoResCheck(response);

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
      const response = adminAstronautInfoRequest(controlUserSessionId, astronautId);
      InfoResCheck(response);

      // Get info for second astronaut
      const response2 = adminAstronautInfoRequest(controlUserSessionId, astronautId2);
      console.log('response', response2);
      InfoResCheck(response2);
    });
  });
});

function InfoResCheck(response: { statusCode: number, body: any }) {
  expect(response.statusCode).toBe(200);
  if (response.body.assignedMission.missionId !== null) {
    expect(response.body).toMatchObject({
      astronautId: expect.any(Number),
      designation: expect.any(String),
      timeAdded: expect.any(Number),
      timeLastEdited: expect.any(Number),
      age: expect.any(Number),
      weight: expect.any(Number),
      height: expect.any(Number),
      assignedMission: {
        missionId: expect.any(Number),
        objective: expect.any(String)
      }
    });
  } else {
    expect(response.body.astronautId).toStrictEqual(expect.any(Number));
    expect(response.body.designation).toStrictEqual(expect.any(String));
    expect(response.body.timeAdded).toStrictEqual(expect.any(Number));
    expect(response.body.timeLastEdited).toStrictEqual(expect.any(Number));
    expect(response.body.age).toStrictEqual(expect.any(Number));
    expect(response.body.weight).toStrictEqual(expect.any(Number));
    expect(response.body.height).toStrictEqual(expect.any(Number));
  }
}