import { adminLaunchVehicleCreateRequest, adminLaunchVehicleRetireRequest, adminMissionLaunchOrganiseRequest } from './newRequestHelpers';
import { adminAuthUserRegisterRequest, adminMissionCreateRequest } from './requestHelpers';
import { clearRequest } from './requestHelpers';
import {
  sampleUser1,
  sampleUser2,
  sampleMission1,
  sampleMission2,
  sampleLaunchVehicle1,
  sampleLaunchVehicle2,
  samplePayload1,
  samplePayload2,
  sampleLaunchParameters1,
  sampleLaunchParameters2
} from './sampleTestData';
import { generateSessionId, missionIdCheck } from '../../src/logic/helper';

describe.skip('POST /v1/admin/mission/{missionid}/launch', () => {
  let controlUserSessionId: string;
  let controlUserSessionId2: string;
  let launchVehicleId: number;
  let launchVehicleId2: number;
  let missionId: number;
  let missionId2: number;

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
    // create a launch vehicle
    const vehicleCreateRes = adminLaunchVehicleCreateRequest(
      controlUserSessionId,
      sampleLaunchVehicle1.name,
      sampleLaunchVehicle1.description,
      sampleLaunchVehicle1.maxCrewWeight,
      sampleLaunchVehicle1.maxPayloadWeight,
      sampleLaunchVehicle1.launchVehicleWeight,
      sampleLaunchVehicle1.thrustCapacity,
      sampleLaunchVehicle1.maneuveringFuel
    );
    expect(vehicleCreateRes.statusCode).toBe(200);
    launchVehicleId = vehicleCreateRes.body.launchVehicleId;

    const registerRes2 = adminAuthUserRegisterRequest(
      sampleUser2.email,
      sampleUser2.password,
      sampleUser2.nameFirst,
      sampleUser2.nameLast
    );
    expect(registerRes2.statusCode).toBe(200);
    controlUserSessionId2 = registerRes2.body.controlUserSessionId;

    const missionCreateRes2 = adminMissionCreateRequest(
      controlUserSessionId2,
      sampleMission2.name,
      sampleMission2.description,
      sampleMission2.target
    );
    expect(missionCreateRes2.statusCode).toBe(200);
    missionId2 = missionCreateRes2.body.missionId;
  });

  afterAll(() => {
    const clearRes = clearRequest();
    expect(clearRes.statusCode).toBe(200);
  });
  
  test('organise a launch successfully', () => {
    const organiseRes = adminMissionLaunchOrganiseRequest(
      controlUserSessionId,
      missionId,
      launchVehicleId,
      samplePayload1,
      sampleLaunchParameters1
    );
    expect(organiseRes.statusCode).toBe(200);
    expect(organiseRes.body.launchId).toStrictEqual(expect.any(Number));
  });

  test('organise two launches successfully', () => {
    // create another launch vehicle
    const createRes2 = adminLaunchVehicleCreateRequest(
      controlUserSessionId,
      sampleLaunchVehicle2.name,
      sampleLaunchVehicle2.description,
      sampleLaunchVehicle2.maxCrewWeight,
      sampleLaunchVehicle2.maxPayloadWeight,
      sampleLaunchVehicle2.launchVehicleWeight,
      sampleLaunchVehicle2.thrustCapacity,
      sampleLaunchVehicle2.maneuveringFuel
    );
    launchVehicleId2 = createRes2.body.launchVehicleId;
    expect(createRes2.statusCode).toBe(200);

    const organiseRes1 = adminMissionLaunchOrganiseRequest(
      controlUserSessionId,
      missionId,
      launchVehicleId,
      samplePayload1,
      sampleLaunchParameters1
    );
    expect(organiseRes1.statusCode).toBe(200);
    expect(organiseRes1.body.launchId).toStrictEqual(expect.any(Number));

    const organiseRes2 = adminMissionLaunchOrganiseRequest(
      controlUserSessionId,
      missionId,
      launchVehicleId2,
      samplePayload2,
      sampleLaunchParameters2
    );
    expect(organiseRes2.statusCode).toBe(200);
    expect(organiseRes2.body.launchId).toStrictEqual(expect.any(Number));
  });

  test('launchvehicleid is invalid', () => {
    const organiseRes1 = adminMissionLaunchOrganiseRequest(
      controlUserSessionId,
      missionId,
      launchVehicleId + 1,
      samplePayload1,
      sampleLaunchParameters1
    );
    expect(organiseRes1.statusCode).toBe(400);
    expect(organiseRes1.body).toStrictEqual({ error: expect.any(String) });
  });

  test('launchvehicleid is currently in another active launch', () => {
    // organise a launch successfully
    const organiseRes1 = adminMissionLaunchOrganiseRequest(
      controlUserSessionId,
      missionId,
      launchVehicleId,
      samplePayload1,
      sampleLaunchParameters1
    );
    expect(organiseRes1.statusCode).toBe(200);
    expect(organiseRes1.body.launchId).toStrictEqual(expect.any(Number));
    // something wrong: launchvehicleid is currently in another active launch
    const organiseRes2 = adminMissionLaunchOrganiseRequest(
      controlUserSessionId,
      missionId,
      launchVehicleId,
      samplePayload2,
      sampleLaunchParameters2
    );
    expect(organiseRes2.statusCode).toBe(400);
    expect(organiseRes2.body).toStrictEqual({ error: expect.any(String) });
  });

  test('launchvehicleid refers to a Launch Vehicle that is retired', () => {
    const retiredRes = adminLaunchVehicleRetireRequest(controlUserSessionId, launchVehicleId);
    expect(retiredRes.statusCode).toBe(200);
    const organiseRes = adminMissionLaunchOrganiseRequest(
      controlUserSessionId,
      missionId,
      launchVehicleId,
      samplePayload1,
      sampleLaunchParameters1
    );
    expect(organiseRes.statusCode).toBe(400);
    expect(organiseRes.body).toStrictEqual({ error: expect.any(String) });
  });

  const invalidPayload = [
    { Payload: { description: 'M'.repeat(401), weight: 300 } },
    { Payload: { description: "MIT Cubesat", weight: 99999 } }
  ];
  test.each(invalidPayload)('Payload is invalid', ({ Payload }) => {
    const retiredRes = adminLaunchVehicleRetireRequest(controlUserSessionId, launchVehicleId);
    expect(retiredRes.statusCode).toBe(200);
    const organiseRes = adminMissionLaunchOrganiseRequest(
      controlUserSessionId,
      missionId,
      launchVehicleId,
      Payload,
      sampleLaunchParameters1
    );
    expect(organiseRes.statusCode).toBe(400);
    expect(organiseRes.body).toStrictEqual({ error: expect.any(String) });
  });

  interface LaunchParameters {
    LaunchPara: {
      targetDistance: number,
      fuelBurnRate: number,
      thrustFuel: number,
      activeGravityForce: number,
      maneuveringDelay: number
    }
  }
  const invalidLaunchParameters: LaunchParameters[] = [
    {
      LaunchPara:
      {
        targetDistance: -1,
        fuelBurnRate: sampleLaunchParameters1.fuelBurnRate,
        thrustFuel: sampleLaunchParameters1.thrustFuel,
        activeGravityForce: sampleLaunchParameters1.activeGravityForce,
        maneuveringDelay: sampleLaunchParameters1.maneuveringDelay 
      }
    },
    {
      LaunchPara:
      {
        targetDistance: sampleLaunchParameters1.targetDistance,
        fuelBurnRate: -1,
        thrustFuel: sampleLaunchParameters1.thrustFuel,
        activeGravityForce: sampleLaunchParameters1.activeGravityForce,
        maneuveringDelay: sampleLaunchParameters1.maneuveringDelay 
      }
    },
    {
      LaunchPara:
      {
        targetDistance: sampleLaunchParameters1.targetDistance,
        fuelBurnRate: sampleLaunchParameters1.fuelBurnRate,
        thrustFuel: -1,
        activeGravityForce: sampleLaunchParameters1.activeGravityForce,
        maneuveringDelay: sampleLaunchParameters1.maneuveringDelay 
      }
    },
    {
      LaunchPara:
      {
        targetDistance: sampleLaunchParameters1.targetDistance,
        fuelBurnRate: sampleLaunchParameters1.fuelBurnRate,
        thrustFuel: sampleLaunchParameters1.thrustFuel,
        activeGravityForce: -1,
        maneuveringDelay: sampleLaunchParameters1.maneuveringDelay 
      }
    },
    {
      LaunchPara:
      {
        targetDistance: sampleLaunchParameters1.targetDistance,
        fuelBurnRate: sampleLaunchParameters1.fuelBurnRate,
        thrustFuel: sampleLaunchParameters1.thrustFuel,
        activeGravityForce: sampleLaunchParameters1.activeGravityForce,
        maneuveringDelay: -1 
      }
    }
  ];
  test.each(invalidLaunchParameters)('Any LaunchCalculationParameters is < 0', ({ LaunchPara }) => {
    const organiseRes = adminMissionLaunchOrganiseRequest(
      controlUserSessionId,
      missionId,
      launchVehicleId,
      samplePayload1,
      LaunchPara
    );
    expect(organiseRes.statusCode).toBe(400);
    expect(organiseRes.body).toStrictEqual({ error: expect.any(String) });
  });

  const invalidManeuveringDelay: LaunchParameters[] = [
    {
      LaunchPara:
      {
        targetDistance: sampleLaunchParameters1.targetDistance,
        fuelBurnRate: sampleLaunchParameters1.fuelBurnRate,
        thrustFuel: sampleLaunchParameters1.thrustFuel,
        activeGravityForce: sampleLaunchParameters1.activeGravityForce,
        maneuveringDelay: -1
      }
    },
    {
      LaunchPara:
      {
        targetDistance: sampleLaunchParameters1.targetDistance,
        fuelBurnRate: sampleLaunchParameters1.fuelBurnRate,
        thrustFuel: sampleLaunchParameters1.thrustFuel,
        activeGravityForce: sampleLaunchParameters1.activeGravityForce,
        maneuveringDelay: 0
      }
    }
  ];
  test.each(invalidManeuveringDelay)('manueveringDelay is < 1', ({ LaunchPara }) => {
    const organiseRes = adminMissionLaunchOrganiseRequest(
      controlUserSessionId,
      missionId,
      launchVehicleId,
      samplePayload1,
      LaunchPara
    );
    expect(organiseRes.statusCode).toBe(400);
    expect(organiseRes.body).toStrictEqual({ error: expect.any(String) });
  });

  
  test('fuelBurnRate > thrustFuel',() => {
    const organiseRes = adminMissionLaunchOrganiseRequest(
      controlUserSessionId,
      missionId,
      launchVehicleId,
      samplePayload1,
      {
        targetDistance: sampleLaunchParameters1.targetDistance,
        fuelBurnRate: 500,
        thrustFuel: 400,
        activeGravityForce: sampleLaunchParameters1.activeGravityForce,
        maneuveringDelay: sampleLaunchParameters1.maneuveringDelay
      }
    );
    expect(organiseRes.statusCode).toBe(400);
    expect(organiseRes.body).toStrictEqual({ error: expect.any(String) });
  });

  test('An initial calculation with these LaunchCalculationParameters are invalid',() => {
    const organiseRes = adminMissionLaunchOrganiseRequest(
      controlUserSessionId,
      missionId,
      launchVehicleId,
      samplePayload1,
      {
        targetDistance: sampleLaunchParameters1.targetDistance * 1000,
        fuelBurnRate: sampleLaunchParameters1.fuelBurnRate,
        thrustFuel: sampleLaunchParameters1.thrustFuel,
        activeGravityForce: sampleLaunchParameters1.activeGravityForce,
        maneuveringDelay: sampleLaunchParameters1.maneuveringDelay
      }
    );
    expect(organiseRes.statusCode).toBe(400);
    expect(organiseRes.body).toStrictEqual({ error: expect.any(String) });
  });

  const invalidLaunchavaehicleControlUserSessionId = [
    { sessionId: '' },
    { sessionId: generateSessionId() }
  ];
  test.each(invalidLaunchavaehicleControlUserSessionId)('ControlUserSessionId is empty or invalid', ({ sessionId }) => {
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

  const invalidmissionId = [
    { missionId: null },
    { missionId: missionId2 },
    { missionId: -1 }
  ];
  test.each(invalidmissionId)('MissionId is empty invalid or not associated with the current controlUser', ({ missionId }) => {
    const organiseRes = adminMissionLaunchOrganiseRequest(
      controlUserSessionId,
      missionId,
      launchVehicleId,
      samplePayload1,
      sampleLaunchParameters1
    );
    expect(organiseRes.statusCode).toBe(401);
    expect(organiseRes.body).toStrictEqual({ error: expect.any(String)});
  });
});
