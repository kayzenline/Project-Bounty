import {
  adminLaunchVehicleCreateRequest,
  adminMissionLaunchOrganiseRequest,
  adminMissionAstronautLaunchAllocateRequest,
  adminMissionLaunchDetailsRequest
} from './newRequestHelpers';
import { adminAuthUserRegisterRequest, adminAstronautCreateRequest, adminMissionCreateRequest, adminAstronautAssignRequest } from './requestHelpers';
import { clearRequest } from './requestHelpers';
import {
  sampleUser1,
  sampleUser2,
  sampleMission1,
  sampleMission2,
  sampleLaunchVehicle1,
  sampleLaunchVehicle3,
  samplePayload1,
  sampleLaunchParameters1,
} from './sampleTestData';
import { generateSessionId } from '../../src/logic/helper';

describe('POST /v1/admin/mission/{missionid}/launch', () => {
  let controlUserSessionId: string;
  let launchVehicleId: number;
  let astronautId: number;
  let missionId: number;
  let launchId: number;
  beforeEach(() => {
    // clear all the data
    const clearRes = clearRequest();
    expect(clearRes.statusCode).toBe(200);
    // register successfully
    const registerRes = adminAuthUserRegisterRequest(
      sampleUser1.email,
      sampleUser1.password,
      sampleUser1.nameFirst,
      sampleUser1.nameLast
    );
    expect(registerRes.statusCode).toBe(200);
    controlUserSessionId = registerRes.body.controlUserSessionId;
    // create a mission
    const missionCreateRes = adminMissionCreateRequest(
      controlUserSessionId,
      sampleMission1.name,
      sampleMission1.description,
      sampleMission1.target
    );
    expect(missionCreateRes.statusCode).toBe(200);
    missionId = missionCreateRes.body.missionId;
    // create an astronaut
    const astronautNameFirst = 'NameFirst';
    const astronautNameLast = 'NameLast';
    const rank = 'rankOfAstronaut';
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
    // create a launch vehicle
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
    expect(createRes.statusCode).toBe(200);
    launchVehicleId = createRes.body.launchVehicleId;
    // organise a launch
    const organiseRes = adminMissionLaunchOrganiseRequest(
      controlUserSessionId,
      missionId,
      launchVehicleId,
      samplePayload1,
      sampleLaunchParameters1
    );
    expect(organiseRes.statusCode).toBe(200);
    // assign an astronaut to a mission
    const assignRes = adminAstronautAssignRequest(
      controlUserSessionId,
      astronautId,
      missionId
    );
    expect(assignRes.statusCode).toBe(200);
    launchId = organiseRes.body.launchId;
  });

  afterAll(() => {
    const clearRes = clearRequest();
    expect(clearRes.statusCode).toBe(200);
  });

  test('allocate succesfully', () => {
    const allocateRes = adminMissionAstronautLaunchAllocateRequest(
      controlUserSessionId,
      astronautId,
      missionId,
      launchId
    );
    expect(allocateRes.statusCode).toBe(200);
    const infoRes = adminMissionLaunchDetailsRequest(
      controlUserSessionId,
      missionId,
      launchId
    );
    expect(infoRes.statusCode).toBe(200);
    expect(infoRes.body.allocatedAstronauts[0].astronautId).toStrictEqual(astronautId);
  });

  test('astronautid is invalid', () => {
    const allocateRes = adminMissionAstronautLaunchAllocateRequest(
      controlUserSessionId,
      astronautId + 1,
      missionId,
      launchId
    );
    expect(allocateRes.statusCode).toBe(400);
    expect(allocateRes.body).toStrictEqual({ error: expect.any(String) });
  });

  test('launchid is invalid', () => {
    const allocateRes = adminMissionAstronautLaunchAllocateRequest(
      controlUserSessionId,
      astronautId,
      missionId,
      launchId + 1
    );
    expect(allocateRes.statusCode).toBe(400);
    expect(allocateRes.body).toStrictEqual({ error: expect.any(String) });
  });

  test('The astronaut has not been assigned to the current mission', () => {
    // create another mission
    const missionCreateRes = adminMissionCreateRequest(
      controlUserSessionId,
      sampleMission2.name,
      sampleMission2.description,
      sampleMission2.target
    );
    expect(missionCreateRes.statusCode).toBe(200);
    const missionId2 = missionCreateRes.body.missionId;
    // create another astronaut
    const astronautNameFirst = 'newNameFirst';
    const astronautNameLast = 'newNameLast';
    const rank = 'rankOfAstronaut';
    const age = 20;
    const weight = 70;
    const height = 170;
    const astronautCreateRes = adminAstronautCreateRequest(
      controlUserSessionId,
      astronautNameFirst,
      astronautNameLast,
      rank,
      age,
      weight,
      height
    );
    expect(astronautCreateRes.statusCode).toBe(200);
    const newAstronautId = astronautCreateRes.body.astronautId;
    // assign another astronaut to mission2
    const assignRes = adminAstronautAssignRequest(
      controlUserSessionId,
      newAstronautId,
      missionId2
    );
    expect(assignRes.statusCode).toBe(200);

    const allocateRes = adminMissionAstronautLaunchAllocateRequest(
      controlUserSessionId,
      astronautId,
      missionId,
      launchId + 1
    );
    expect(allocateRes.statusCode).toBe(400);
    expect(allocateRes.body).toStrictEqual({ error: expect.any(String) });
  });

  test('The astronaut is already allocated to another launch that has not ended (not in the ON_EARTH state)', () => {
    const allocateRes = adminMissionAstronautLaunchAllocateRequest(
      controlUserSessionId,
      astronautId,
      missionId,
      launchId
    );
    expect(allocateRes.statusCode).toBe(200);
    const infoRes = adminMissionLaunchDetailsRequest(
      controlUserSessionId,
      missionId,
      launchId
    );
    expect(infoRes.statusCode).toBe(200);
    expect(infoRes.body.allocatedAstronauts[0].astronautId).toStrictEqual(astronautId);
    // The astronaut is already allocated to another launch
    const allocateRes2 = adminMissionAstronautLaunchAllocateRequest(
      controlUserSessionId,
      astronautId,
      missionId,
      launchId
    );
    expect(allocateRes2.statusCode).toBe(400);
    expect(allocateRes2.body).toStrictEqual({ error: expect.any(String) });
  });

  test('The total weight of all allocated astronauts including this astronaut would exceed the maxCrewWeight of the launchVehicle for this launch', () => {
    //create launch vehicle
    const vehicleCreateRes = adminLaunchVehicleCreateRequest(
      controlUserSessionId,
      sampleLaunchVehicle3.name,
      sampleLaunchVehicle3.description,
      sampleLaunchVehicle3.maxCrewWeight,
      sampleLaunchVehicle3.maxPayloadWeight,
      sampleLaunchVehicle3.launchVehicleWeight,
      sampleLaunchVehicle3.thrustCapacity,
      sampleLaunchVehicle3.maneuveringFuel
    );
    expect(vehicleCreateRes.statusCode).toBe(200);
    const newLaunchVehicleId = vehicleCreateRes.body.launchVehicleId;
    //create launch
    const launchcreateRes = adminMissionLaunchOrganiseRequest(
      controlUserSessionId,
      missionId,
      newLaunchVehicleId,
      samplePayload1,
      sampleLaunchParameters1
    );
    expect(launchcreateRes.statusCode).toBe(200);
    const newLaunchId = launchcreateRes.body.launchId;
    // allocate first astronaut
    const allocateRes = adminMissionAstronautLaunchAllocateRequest(
      controlUserSessionId,
      astronautId,
      missionId,
      newLaunchId
    );
    expect(allocateRes.statusCode).toBe(200);
    // create another astronaut
    const astronautNameFirst = 'newNameFirst';
    const astronautNameLast = 'newNameLast';
    const rank = 'rankOfAstronaut';
    const age = 20;
    const weight = 70;
    const height = 170;
    const astronautCreateRes = adminAstronautCreateRequest(
      controlUserSessionId,
      astronautNameFirst,
      astronautNameLast,
      rank,
      age,
      weight,
      height
    );
    expect(astronautCreateRes.statusCode).toBe(200);
    const newAstronautId = astronautCreateRes.body.astronautId;
    // assign another astronaut to the same mission
    const assignRes = adminAstronautAssignRequest(
      controlUserSessionId,
      newAstronautId,
      missionId
    );
    expect(assignRes.statusCode).toBe(200);
    // exceed the maxCrewWeight of the launchVehicle (weight 70)
    const allocateRes2 = adminMissionAstronautLaunchAllocateRequest(
      controlUserSessionId,
      newAstronautId,
      missionId,
      launchId
    );
    expect(allocateRes2.statusCode).toBe(400);
    expect(allocateRes2.body).toStrictEqual({ error: expect.any(String) });
  });

  const invalidControlUserSessionId = [
    { sessionId: '' },
    { sessionId: generateSessionId() }
  ];
  test.each(invalidControlUserSessionId)('ControlUserSessionId is empty or invalid', ({ sessionId }) => {
    const organiseRes = adminMissionLaunchOrganiseRequest(
      sessionId,
      missionId,
      launchVehicleId,
      samplePayload1,
      sampleLaunchParameters1
    );
    expect(organiseRes.statusCode).toBe(401);
    expect(organiseRes.body).toStrictEqual({ error: expect.any(String)});
  });

  const invalidMissionIdCases = [
    { missionId: null },
    { missionId: -1 }
  ];
  test.each(invalidMissionIdCases)('MissionId is empty or invalid', ({ missionId }) => {
    const organiseRes = adminMissionLaunchOrganiseRequest(
      controlUserSessionId,
      missionId,
      launchVehicleId,
      samplePayload1,
      sampleLaunchParameters1
    );
    expect(organiseRes.statusCode).toBe(403);
    expect(organiseRes.body).toStrictEqual({ error: expect.any(String) });
  });

  test('MissionId is not associated with the current controlUser', () => {
    const registerRes2 = adminAuthUserRegisterRequest(
      sampleUser2.email,
      sampleUser2.password,
      sampleUser2.nameFirst,
      sampleUser2.nameLast
    );
    expect(registerRes2.statusCode).toBe(200);
    const controlUserSessionId2 = registerRes2.body.controlUserSessionId;

    const missionCreateRes2 = adminMissionCreateRequest(
      controlUserSessionId2,
      sampleMission2.name,
      sampleMission2.description,
      sampleMission2.target
    );
    expect(missionCreateRes2.statusCode).toBe(200);
    const missionId2 = missionCreateRes2.body.missionId;

    const organiseRes = adminMissionLaunchOrganiseRequest(
      controlUserSessionId,
      missionId2,
      launchVehicleId,
      samplePayload1,
      sampleLaunchParameters1
    );
    expect(organiseRes.statusCode).toBe(403);
    expect(organiseRes.body).toStrictEqual({ error: expect.any(String) });
  });
});
