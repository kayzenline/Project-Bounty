import { adminAuthUserRegisterRequest } from './requestHelpers';
import { adminLaunchVehicleCreateRequest, adminLaunchVehicleInfoRequest } from './newRequestHelpers';
import { clearRequest } from './requestHelpers';
import { launchVehicleInfo, sampleLaunchVehicle1, sampleUser1 } from './sampleTestData';

describe.skip('/v1/admin/launchvehicle/{launchvehicleid}', () => {
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
    const VehicaleCreateRes = adminLaunchVehicleCreateRequest(
      controlUserSessionId,
      sampleLaunchVehicle1.name,
      sampleLaunchVehicle1.description,
      sampleLaunchVehicle1.maxCrewWeight,
      sampleLaunchVehicle1.maxPayloadWeight,
      sampleLaunchVehicle1.launchVehicleWeight,
      sampleLaunchVehicle1.thrustCapacity,
      sampleLaunchVehicle1.maneuveringFuel
    )
    launchVehicleId = VehicaleCreateRes.body.launchVehicleId;
    expect(VehicaleCreateRes.statusCode).toBe(200);
    expect(launchVehicleId).toStrictEqual(expect.any(Number));
  })
  afterAll(() => {
    const clearRes = clearRequest();
    expect(clearRes.statusCode).toBe(200);
  })

  test('Valid case, Get all of the relevant information about the current launch vehicle including launch history', () => {
    // OK : 200
    const infoRes = adminLaunchVehicleInfoRequest(controlUserSessionId, launchVehicleId);
    expect(infoRes.statusCode).toBe(200);
    expect(infoRes.body).toStrictEqual({
      ...launchVehicleInfo,
      launchVehicleId,
      timeAdded: expect.any(Number),
      timeLastEdited: expect.any(Number)
    });
  });

  test('Invalid case, launchvehicleid is invalid', () => {
    // launchvehicleid is invalid: 400
    const invalidLaunchVehicleId = launchVehicleId + 999;
    const infoRes = adminLaunchVehicleInfoRequest(controlUserSessionId, invalidLaunchVehicleId);
    expect(infoRes.statusCode).toBe(400);
    expect(infoRes.body).toStrictEqual({ error: expect.any(String) });
  })

  test('ControlUserSessionId is empty or invalid (does not refer to valid logged in user session)', () => {
    // ControlUserSessionId is empty(does not refer to valid logged in user session): 401
    const emptyControlUserSessionId = '';
    const infoRes1 = adminLaunchVehicleInfoRequest(emptyControlUserSessionId, launchVehicleId);
    expect(infoRes1.statusCode).toBe(401);
    expect(infoRes1.body).toStrictEqual({ error: expect.any(String) });

    // ControlUserSessionId is invalid (does not refer to valid logged in user session): 401

    const invalidControlUserSessionId = controlUserSessionId + 's';
    const infoRes2 = adminLaunchVehicleInfoRequest(invalidControlUserSessionId, launchVehicleId);
    expect(infoRes2.statusCode).toBe(401);
    expect(infoRes2.body).toStrictEqual({ error: expect.any(String) });
  })
});
