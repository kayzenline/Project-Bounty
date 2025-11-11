import {
  adminAstronautUnassignRequest,
  clearRequest,
  adminAuthUserRegisterRequest,
  adminMissionCreateRequest,
  adminAstronautCreateRequest,
  adminAstronautAssignRequest
} from './requestHelpers';
import {
  adminLaunchVehicleCreateRequest,
  adminMissionLaunchOrganiseRequest,
  adminMissionAstronautLaunchAllocateRequest
} from './newRequestHelpers';
import {
  sampleUser1,
  sampleUser2,
  sampleMission1,
  sampleLaunchVehicle1,
  samplePayload1,
  sampleLaunchParameters1,
} from './sampleTestData';

let missionId: number;
let controlUserSessionId: string;
let astronautId: number;
let astronautNameFirst: string;
let astronautNameLast: string;
let rank: string;

describe('DELETE /v1/admin/mission/{missionid}/assign/{astronautid}', () => {
  beforeEach(() => {
    const clearRes = clearRequest();
    expect(clearRes.statusCode).toBe(200);
    const registerRes = adminAuthUserRegisterRequest(
      sampleUser1.email,
      sampleUser1.password,
      sampleUser1.nameFirst,
      sampleUser1.nameLast
    );
    expect(registerRes.statusCode).toBe(200);
    controlUserSessionId = registerRes.body.controlUserSessionId;

    const res = adminMissionCreateRequest(
      controlUserSessionId,
      sampleMission1.name,
      sampleMission1.description,
      sampleMission1.target
    );
    expect(res.statusCode).toBe(200);
    missionId = res.body.missionId;

    astronautNameFirst = 'NameFirst';
    astronautNameLast = 'NameLast';
    rank = 'rankOfAstronaut';
    const age = 20;
    const weight = 70;
    const height = 170;
    const createAstronautRes = adminAstronautCreateRequest(
      controlUserSessionId,
      astronautNameFirst,
      astronautNameLast,
      rank,
      age,
      weight,
      height
    );
    expect(createAstronautRes.statusCode).toBe(200);
    astronautId = createAstronautRes.body.astronautId;
  });

  afterAll(() => {
    const clearRes = clearRequest();
    expect(clearRes.statusCode).toBe(200);
  });

  test('successful unassign an astronaut', () => {
    adminAstronautAssignRequest(controlUserSessionId, astronautId, missionId);
    const res = adminAstronautUnassignRequest(controlUserSessionId, astronautId, missionId);
    expect(res.statusCode).toBe(200);
    expect(res.body).toStrictEqual({});
  });

  test('astronautId is invalid', () => {
    adminAstronautAssignRequest(controlUserSessionId, astronautId, missionId);
    const res = adminAstronautUnassignRequest(controlUserSessionId, astronautId + 9999, missionId);
    expect(res.statusCode).toBe(400);
    expect(res.body).toStrictEqual({ error: expect.any(String) });
  });

  test('The astronaut not assigned to this space mission.', () => {
    const res = adminAstronautUnassignRequest(controlUserSessionId, astronautId, missionId);
    expect(res.statusCode).toBe(400);
    expect(res.body).toStrictEqual({ error: expect.any(String) });
  });

  test('The astronaut is allocated to a launch', () => {
    // create launch vehicle successfully
    const createRes = adminLaunchVehicleCreateRequest(
      controlUserSessionId,
      sampleLaunchVehicle1.name,
      sampleLaunchVehicle1.description,
      sampleLaunchVehicle1.maxCrewWeight,
      sampleLaunchVehicle1.maxPayloadWeight,
      sampleLaunchVehicle1.launchVehicleWeight,
      sampleLaunchVehicle1.thrustCapacity,
      sampleLaunchVehicle1.maneuveringFuel
    );
    const launchVehicleId = createRes.body.launchVehicleId;
    const organiseRes = adminMissionLaunchOrganiseRequest(
      controlUserSessionId,
      missionId,
      launchVehicleId,
      samplePayload1,
      sampleLaunchParameters1
    );
    expect(organiseRes.statusCode).toBe(200);
    const assignRes = adminAstronautAssignRequest(
      controlUserSessionId,
      astronautId,
      missionId
    );
    expect(assignRes.statusCode).toBe(200);
    const launchId = assignRes.body.launchId;
    const allocateRes = adminMissionAstronautLaunchAllocateRequest(
      controlUserSessionId,
      astronautId,
      missionId,
      launchId
    );
    expect(allocateRes.statusCode).toBe(200);

    const unassignRes = adminAstronautUnassignRequest(
      controlUserSessionId,
      astronautId,
      missionId
    );
    expect(unassignRes.statusCode).toBe(400);
    expect(unassignRes.body).toStrictEqual({ error: expect.any(String) });
  });

  // status code 401 If any of the following are true:
  test('ControlUserSessionId is empty or invalid (does not refer to valid logged in user session)', () => {
    // ControlUserSessionId is empty 
    adminAstronautAssignRequest(controlUserSessionId, astronautId, missionId);
    const res1 = adminAstronautUnassignRequest('', astronautId, missionId);
    expect(res1.statusCode).toBe(401);
    expect(res1.body).toStrictEqual({ error: expect.any(String) });

    // ControlUserSessionId is invalid
    adminAstronautAssignRequest(controlUserSessionId, astronautId, missionId);
    const res2 = adminAstronautUnassignRequest('invalid token', astronautId, missionId);
    expect(res2.statusCode).toBe(401);
    expect(res2.body).toStrictEqual({ error: expect.any(String) });
  });

  // status code 403 If any of the following are true:
  test('Valid controlUserSessionId is provided, but the control user is not an owner of this mission or the specified missionId does not exist', () => {
    // The control user is not an owner of this mission
    adminAstronautAssignRequest(controlUserSessionId, astronautId, missionId);
    const otherUser = adminAuthUserRegisterRequest(
      sampleUser2.email,
      sampleUser2.password,
      sampleUser2.nameFirst,
      sampleUser2.nameLast
    );
    expect(otherUser.statusCode).toBe(200);
    const otherSessionId = otherUser.body.controlUserSessionId;
    const notOwnerRes = adminAstronautUnassignRequest(otherSessionId, astronautId, missionId);
    expect(notOwnerRes.statusCode).toBe(403);
    expect(notOwnerRes.body).toStrictEqual({ error: expect.any(String) });

    // Mission does not exist
    const missingMissionRes = adminAstronautUnassignRequest(controlUserSessionId, astronautId, missionId + 9999);
    expect(missingMissionRes.statusCode).toBe(403);
    expect(missingMissionRes.body).toStrictEqual({ error: expect.any(String) });
  });
})

