import { adminLaunchVehicleCreateRequest, adminLaunchVehicleDetailsRequest } from './newRequestHelpers';
import { adminAuthUserRegisterRequest } from './requestHelpers';
import { clearRequest } from './requestHelpers';
import { sampleUser1, sampleLaunchVehicle1, sampleLaunchVehicle2 } from './sampleTestData';

describe.skip('Need to write a description', () => {
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

  test('Create a Launch Vehicale successfully', () => {
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
    expect(detailRes).toStrictEqual({
      launchVehicles: [
        {
          launchVehicleId: 1,
          name: "Saturn V",
          assigned: false
        }
      ]
    });
  });

  test('Create two Launch Vehicales successfully', () => {
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
  // Name contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes
  // Name is less than 2 characters or more than 20 characters
  // Description contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes
  // Description is less than 2 characters or more than 50 characters
  // maximumCrewWeight < 100 or > 1000
  // maximumPayloadWeight < 100 or > 1000
  // launchVehicleWeight < 1000 or > 100000
  // thrustCapacity < 100000 or > 10000000
  // maneuveringFuel < 10 or > 100

  // create launch vehicle but get an invalidLaunchavaehicleName!
  const invalidLaunchavaehicleName = [
    { name: sampleLaunchVehicle1.name + '@' },
    { name: '' },
    { name: 'N'.repeat(21) }
  ];
  test.each(invalidLaunchavaehicleName)('Get a invalid name', ({name}) => {
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

  // create launch vehicle but get an invalidLaunchavaehicleDescription!
  const invalidLaunchavaehicleDescription = [
    { description: sampleLaunchVehicle1.description + '@' },
    { description: '' },
    { description: 'D'.repeat(51) }
  ];
  test.each(invalidLaunchavaehicleDescription)('Get a invalid name', ({description}) => {
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
});
