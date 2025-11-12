import {
  adminLaunchVehicleCreateRequest,
  adminLaunchVehicleEditRequest,
  adminLaunchVehicleInfoRequest
} from './newRequestHelpers';
import {
  adminAuthUserRegisterRequest,
  clearRequest
} from './requestHelpers';
import {
  sampleUser1,
  sampleLaunchVehicle1,
  sampleLaunchVehicle2
} from './sampleTestData';
import { generateSessionId } from '../../src/logic/helper';

describe('PUT /v1/admin/launchvehicle/{launchvehicleid}', () => {
  let controlUserSessionId: string;
  let launchVehicleId: number;

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
  });

  afterAll(() => {
    const clearRes = clearRequest();
    expect(clearRes.statusCode).toBe(200);
  });

  const validPayload = {
    name: sampleLaunchVehicle2.name,
    description: sampleLaunchVehicle2.description,
    maxCrewWeight: sampleLaunchVehicle2.maxCrewWeight,
    maxPayloadWeight: sampleLaunchVehicle2.maxPayloadWeight,
    launchVehicleWeight: sampleLaunchVehicle2.launchVehicleWeight,
    thrustCapacity: sampleLaunchVehicle2.thrustCapacity,
    maneuveringFuel: sampleLaunchVehicle2.maneuveringFuel
  };

  test('Successfully edit existing launch vehicle', () => {
    const editRes = adminLaunchVehicleEditRequest(
      controlUserSessionId,
      launchVehicleId,
      validPayload.name,
      validPayload.description,
      validPayload.maxCrewWeight,
      validPayload.maxPayloadWeight,
      validPayload.launchVehicleWeight,
      validPayload.thrustCapacity,
      validPayload.maneuveringFuel
    );
    expect(editRes.statusCode).toBe(200);
    expect(editRes.body).toStrictEqual({});

    const infoRes = adminLaunchVehicleInfoRequest(controlUserSessionId, launchVehicleId);
    expect(infoRes.statusCode).toBe(200);
    expect(infoRes.body).toMatchObject({
      launchVehicleId,
      name: validPayload.name,
      description: validPayload.description,
      maxCrewWeight: validPayload.maxCrewWeight,
      maxPayloadWeight: validPayload.maxPayloadWeight,
      launchVehicleWeight: validPayload.launchVehicleWeight,
      thrustCapacity: validPayload.thrustCapacity,
      startingManeuveringFuel: validPayload.maneuveringFuel,
      retired: false
    });
  });

  test('Returns 401 when controlUserSessionId is invalid', () => {
    const editRes = adminLaunchVehicleEditRequest(
      generateSessionId(),
      launchVehicleId,
      validPayload.name,
      validPayload.description,
      validPayload.maxCrewWeight,
      validPayload.maxPayloadWeight,
      validPayload.launchVehicleWeight,
      validPayload.thrustCapacity,
      validPayload.maneuveringFuel
    );
    expect(editRes.statusCode).toBe(401);
    expect(editRes.body).toStrictEqual({ error: expect.any(String) });
  });

  test('Returns 400 when launchvehicleid is invalid', () => {
    const invalidId = launchVehicleId + 999;
    const editRes = adminLaunchVehicleEditRequest(
      controlUserSessionId,
      invalidId,
      validPayload.name,
      validPayload.description,
      validPayload.maxCrewWeight,
      validPayload.maxPayloadWeight,
      validPayload.launchVehicleWeight,
      validPayload.thrustCapacity,
      validPayload.maneuveringFuel
    );
    expect(editRes.statusCode).toBe(400);
    expect(editRes.body).toStrictEqual({ error: expect.any(String) });
  });

  const invalidPayloads = [
    {
      name: `${sampleLaunchVehicle2.name}@`,
      description: validPayload.description,
      maxCrewWeight: validPayload.maxCrewWeight,
      maxPayloadWeight: validPayload.maxPayloadWeight,
      launchVehicleWeight: validPayload.launchVehicleWeight,
      thrustCapacity: validPayload.thrustCapacity,
      maneuveringFuel: validPayload.maneuveringFuel,
      desc: 'name has invalid characters'
    },
    {
      name: validPayload.name,
      description: '',
      maxCrewWeight: validPayload.maxCrewWeight,
      maxPayloadWeight: validPayload.maxPayloadWeight,
      launchVehicleWeight: validPayload.launchVehicleWeight,
      thrustCapacity: validPayload.thrustCapacity,
      maneuveringFuel: validPayload.maneuveringFuel,
      desc: 'description too short'
    },
    {
      name: validPayload.name,
      description: validPayload.description,
      maxCrewWeight: 50,
      maxPayloadWeight: validPayload.maxPayloadWeight,
      launchVehicleWeight: validPayload.launchVehicleWeight,
      thrustCapacity: validPayload.thrustCapacity,
      maneuveringFuel: validPayload.maneuveringFuel,
      desc: 'maxCrewWeight below minimum'
    },
    {
      name: validPayload.name,
      description: validPayload.description,
      maxCrewWeight: validPayload.maxCrewWeight,
      maxPayloadWeight: 5000,
      launchVehicleWeight: validPayload.launchVehicleWeight,
      thrustCapacity: validPayload.thrustCapacity,
      maneuveringFuel: validPayload.maneuveringFuel,
      desc: 'maxPayloadWeight above maximum'
    },
    {
      name: validPayload.name,
      description: validPayload.description,
      maxCrewWeight: validPayload.maxCrewWeight,
      maxPayloadWeight: validPayload.maxPayloadWeight,
      launchVehicleWeight: 999,
      thrustCapacity: validPayload.thrustCapacity,
      maneuveringFuel: validPayload.maneuveringFuel,
      desc: 'launchVehicleWeight below minimum'
    },
    {
      name: validPayload.name,
      description: validPayload.description,
      maxCrewWeight: validPayload.maxCrewWeight,
      maxPayloadWeight: validPayload.maxPayloadWeight,
      launchVehicleWeight: validPayload.launchVehicleWeight,
      thrustCapacity: 50_000,
      maneuveringFuel: validPayload.maneuveringFuel,
      desc: 'thrustCapacity below minimum'
    },
    {
      name: validPayload.name,
      description: validPayload.description,
      maxCrewWeight: validPayload.maxCrewWeight,
      maxPayloadWeight: validPayload.maxPayloadWeight,
      launchVehicleWeight: validPayload.launchVehicleWeight,
      thrustCapacity: validPayload.thrustCapacity,
      maneuveringFuel: 5,
      desc: 'maneuveringFuel below minimum'
    }
  ];

  test.each(invalidPayloads)('Returns 400 when $desc', ({
    name,
    description,
    maxCrewWeight,
    maxPayloadWeight,
    launchVehicleWeight,
    thrustCapacity,
    maneuveringFuel
  }) => {
    const editRes = adminLaunchVehicleEditRequest(
      controlUserSessionId,
      launchVehicleId,
      name,
      description,
      maxCrewWeight,
      maxPayloadWeight,
      launchVehicleWeight,
      thrustCapacity,
      maneuveringFuel
    );
    expect(editRes.statusCode).toBe(400);
    expect(editRes.body).toStrictEqual({ error: expect.any(String) });
  });
});
