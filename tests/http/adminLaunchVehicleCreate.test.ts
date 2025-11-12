import { adminLaunchVehicleCreateRequest, adminLaunchVehicleDetailsRequest } from './newRequestHelpers';
import { adminAuthUserRegisterRequest } from './requestHelpers';
import { clearRequest } from './requestHelpers';
import { sampleUser1, sampleLaunchVehicle1, sampleLaunchVehicle2 } from './sampleTestData';
import { generateSessionId } from '../../src/logic/helper';

describe('POST /v1/admin/launchvehicle', () => {
  let controlUserSessionId: string;
  let launchVehicleId: number;
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
  });

  afterAll(() => {
    const clearRes = clearRequest();
    expect(clearRes.statusCode).toBe(200);
  });

  test('Create a Launch Vehicle successfully', () => {
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
    launchVehicleId = createRes.body.launchVehicleId;

    expect(createRes.statusCode).toBe(200);
    expect(launchVehicleId).toStrictEqual(expect.any(Number));
    
    const detailRes = adminLaunchVehicleDetailsRequest(controlUserSessionId);
    expect(detailRes.statusCode).toBe(200);
    expect(detailRes.body).toStrictEqual({
      launchVehicles: [
        {
          launchVehicleId: 1,
          name: "Saturn V",
          assigned: false
        }
      ]
    });
  });

  test('Create two Launch Vehicles successfully', () => {
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
    launchVehicleId = createRes.body.launchVehicleId;
    expect(createRes.statusCode).toBe(200);
    expect(launchVehicleId).toStrictEqual(expect.any(Number));

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
    launchVehicleId = createRes2.body.launchVehicleId;
    expect(createRes2.statusCode).toBe(200);
    expect(launchVehicleId).toStrictEqual(expect.any(Number));
    
    const detailRes = adminLaunchVehicleDetailsRequest(controlUserSessionId);
    expect(detailRes.statusCode).toBe(200);
    expect(detailRes.body).toStrictEqual({
      launchVehicles: [
        {
          launchVehicleId: 1,
          name: "Saturn V",
          assigned: false
        },
        {
          launchVehicleId: 2,
          name: "Saturn VI",
          assigned: false
        }
      ]
    });
  });

  // create launch vehicle but get an invalid LaunchavaehicleName!
  // Name contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes
  // Name is less than 2 characters or more than 20 characters
  const invalidLaunchVehicleName = [
    { name: sampleLaunchVehicle1.name + '@' },
    { name: '' },
    { name: 'N'.repeat(21) }
  ];
  test.each(invalidLaunchVehicleName)('Get a invalid name', ({ name }) => {
    const createRes = adminLaunchVehicleCreateRequest(
      controlUserSessionId,
      name,
      sampleLaunchVehicle1.description,
      sampleLaunchVehicle1.maxCrewWeight,
      sampleLaunchVehicle1.maxPayloadWeight,
      sampleLaunchVehicle1.launchVehicleWeight,
      sampleLaunchVehicle1.thrustCapacity,
      sampleLaunchVehicle1.maneuveringFuel
    );
    expect(createRes.statusCode).toBe(400);
    expect(createRes.body).toStrictEqual({ error: expect.any(String)});
  });

  // create launch vehicle but get an invalid LaunchavaehicleDescription!
  // Description contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes
  // Description is less than 2 characters or more than 50 characters
  const invalidLaunchVehicleDescription = [
    { description: sampleLaunchVehicle1.description + '@' },
    { description: '' },
    { description: 'D'.repeat(51) }
  ];
  test.each(invalidLaunchVehicleDescription)('Get a invalid name', ({ description }) => {
    const createRes = adminLaunchVehicleCreateRequest(
      controlUserSessionId,
      sampleLaunchVehicle1.name,
      description,
      sampleLaunchVehicle1.maxCrewWeight,
      sampleLaunchVehicle1.maxPayloadWeight,
      sampleLaunchVehicle1.launchVehicleWeight,
      sampleLaunchVehicle1.thrustCapacity,
      sampleLaunchVehicle1.maneuveringFuel
    );
    expect(createRes.statusCode).toBe(400);
    expect(createRes.body).toStrictEqual({ error: expect.any(String)});
  });

  // create launch vehicle but get an invalid maximumCrewWeight!
  // maximumCrewWeight < 100 or > 1000
  const invalidLaunchVehicleMaxCrewWeight = [
    { maxCrewWeight: 99 },
    { maxCrewWeight: 1001 }
  ];
  test.each(invalidLaunchVehicleMaxCrewWeight)('Get a invalid maximumCrewWeight', ({ maxCrewWeight }) => {
    const createRes = adminLaunchVehicleCreateRequest(
      controlUserSessionId,
      sampleLaunchVehicle1.name,
      sampleLaunchVehicle1.description,
      maxCrewWeight,
      sampleLaunchVehicle1.maxPayloadWeight,
      sampleLaunchVehicle1.launchVehicleWeight,
      sampleLaunchVehicle1.thrustCapacity,
      sampleLaunchVehicle1.maneuveringFuel
    );
    expect(createRes.statusCode).toBe(400);
    expect(createRes.body).toStrictEqual({ error: expect.any(String)});
  });

  // create launch vehicle but get an invalid maximumPayloadWeight!
  // maximumPayloadWeight < 100 or > 1000
  const invalidLaunchVehicleMaximumPayloadWeight = [
    { maxPayloadWeight: 99 },
    { maxPayloadWeight: 1001 }
  ];
  test.each(invalidLaunchVehicleMaximumPayloadWeight)('Get a invalid maximumPayloadWeight', ({ maxPayloadWeight }) => {
    const createRes = adminLaunchVehicleCreateRequest(
      controlUserSessionId,
      sampleLaunchVehicle1.name,
      sampleLaunchVehicle1.description,
      sampleLaunchVehicle1.maxCrewWeight,
      maxPayloadWeight,
      sampleLaunchVehicle1.launchVehicleWeight,
      sampleLaunchVehicle1.thrustCapacity,
      sampleLaunchVehicle1.maneuveringFuel
    );
    expect(createRes.statusCode).toBe(400);
    expect(createRes.body).toStrictEqual({ error: expect.any(String)});
  });

  // create launch vehicle but get an invalid launchVehicleWeight!
  // launchVehicleWeight < 1000 or > 100000
  const invalidLaunchVehicleWeight = [
    { launchVehicleWeight: 999 },
    { launchVehicleWeight: 100001 }
  ];
  test.each(invalidLaunchVehicleWeight)('Get a invalid launchVehicleWeight', ({ launchVehicleWeight }) => {
    const createRes = adminLaunchVehicleCreateRequest(
      controlUserSessionId,
      sampleLaunchVehicle1.name,
      sampleLaunchVehicle1.description,
      sampleLaunchVehicle1.maxCrewWeight,
      sampleLaunchVehicle1.maxPayloadWeight,
      launchVehicleWeight,
      sampleLaunchVehicle1.thrustCapacity,
      sampleLaunchVehicle1.maneuveringFuel
    );
    expect(createRes.statusCode).toBe(400);
    expect(createRes.body).toStrictEqual({ error: expect.any(String)});
  });

  // create launch vehicle but get an invalid thrustCapacity!
  // thrustCapacity < 100000 or > 10000000
  const invalidLaunchVehicleThrustCapacity = [
    { thrustCapacity: 99999 },
    { thrustCapacity: 10000001 }
  ];
  test.each(invalidLaunchVehicleThrustCapacity)('Get a invalid thrustCapacity', ({ thrustCapacity }) => {
    const createRes = adminLaunchVehicleCreateRequest(
      controlUserSessionId,
      sampleLaunchVehicle1.name,
      sampleLaunchVehicle1.description,
      sampleLaunchVehicle1.maxCrewWeight,
      sampleLaunchVehicle1.maxPayloadWeight,
      sampleLaunchVehicle1.launchVehicleWeight,
      thrustCapacity,
      sampleLaunchVehicle1.maneuveringFuel
    );
    expect(createRes.statusCode).toBe(400);
    expect(createRes.body).toStrictEqual({ error: expect.any(String)});
  });

  // create launch vehicle but get an invalid maneuveringFuel!
  // maneuveringFuel < 10 or > 100
  const invalidLaunchavaehicleManeuveringFuel = [
    { maneuveringFuel: 9 },
    { maneuveringFuel: 101 }
  ];
  test.each(invalidLaunchavaehicleManeuveringFuel)('Get a invalid maneuveringFuel', ({ maneuveringFuel }) => {
    const createRes = adminLaunchVehicleCreateRequest(
      controlUserSessionId,
      sampleLaunchVehicle1.name,
      sampleLaunchVehicle1.description,
      sampleLaunchVehicle1.maxCrewWeight,
      sampleLaunchVehicle1.maxPayloadWeight,
      sampleLaunchVehicle1.launchVehicleWeight,
      sampleLaunchVehicle1.thrustCapacity,
      maneuveringFuel
    );
    expect(createRes.statusCode).toBe(400);
    expect(createRes.body).toStrictEqual({ error: expect.any(String)});
  });

  // create launch vehicle but get an invalid controlUserSessionId!
  // controlUserSessionId is empty or invalid (does not refer to valid logged in user session)
  const invalidLaunchavaehicleControlUserSessionId = [
    { sessionId: '' },
    { sessionId: generateSessionId() }
  ];
  test.each(invalidLaunchavaehicleControlUserSessionId)('Get a invalid maneuveringFuel', ({ sessionId }) => {
    const createRes = adminLaunchVehicleCreateRequest(
      sessionId,
      sampleLaunchVehicle1.name,
      sampleLaunchVehicle1.description,
      sampleLaunchVehicle1.maxCrewWeight,
      sampleLaunchVehicle1.maxPayloadWeight,
      sampleLaunchVehicle1.launchVehicleWeight,
      sampleLaunchVehicle1.thrustCapacity,
      sampleLaunchVehicle1.maneuveringFuel
    );
    expect(createRes.statusCode).toBe(401);
    expect(createRes.body).toStrictEqual({ error: expect.any(String)});
  });
});
