import { adminAuthUserRegisterRequest } from './requestHelpers';
import { adminLaunchVehicleCreateRequest, adminLaunchVehicleDetailsRequest } from './newRequestHelpers';
import { clearRequest } from './requestHelpers';
import { sampleLaunchVehicle1, sampleLaunchVehicle2, sampleUser1 } from './sampleTestData';

// Show all launch vehicles that are not retired currently in our system along with their assigned statuses
describe('GET /v1/admin/launchvehicle/list', () => {
  let controlUserSessionId: string;
  let firstLaunchVehicleId: number;
  let secondLaunchVehicleId: number;
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

    const createFirstRes = adminLaunchVehicleCreateRequest(
      controlUserSessionId,
      sampleLaunchVehicle1.name,
      sampleLaunchVehicle1.description,
      sampleLaunchVehicle1.maxCrewWeight,
      sampleLaunchVehicle1.maxPayloadWeight,
      sampleLaunchVehicle1.launchVehicleWeight,
      sampleLaunchVehicle1.thrustCapacity,
      sampleLaunchVehicle1.maneuveringFuel
    );
    expect(createFirstRes.statusCode).toBe(200);
    firstLaunchVehicleId = createFirstRes.body.launchVehicleId;
    expect(firstLaunchVehicleId).toStrictEqual(expect.any(Number));

    const createSecondRes = adminLaunchVehicleCreateRequest(
      controlUserSessionId,
      sampleLaunchVehicle2.name,
      sampleLaunchVehicle2.description,
      sampleLaunchVehicle2.maxCrewWeight,
      sampleLaunchVehicle2.maxPayloadWeight,
      sampleLaunchVehicle2.launchVehicleWeight,
      sampleLaunchVehicle2.thrustCapacity,
      sampleLaunchVehicle2.maneuveringFuel
    );
    expect(createSecondRes.statusCode).toBe(200);
    secondLaunchVehicleId = createSecondRes.body.launchVehicleId;
    expect(secondLaunchVehicleId).toStrictEqual(expect.any(Number));
  });

  afterAll(() => {
    const clearRes = clearRequest();
    expect(clearRes.statusCode).toBe(200);
  });

  test('Valid case, list all non-retired launch vehicles with their assignment status', () => {
    const detailRes = adminLaunchVehicleDetailsRequest(controlUserSessionId);
    expect(detailRes.statusCode).toBe(200);
    expect(detailRes.body).toStrictEqual({
      launchVehicles: [
        {
          launchVehicleId: firstLaunchVehicleId,
          name: sampleLaunchVehicle1.name,
          assigned: false
        },
        {
          launchVehicleId: secondLaunchVehicleId,
          name: sampleLaunchVehicle2.name,
          assigned: false
        }
      ]
    });
  });

  test('ControlUserSessionId is empty or invalid (does not refer to valid logged in user session)', () => {
    const emptySessionId = '';
    const emptyRes = adminLaunchVehicleDetailsRequest(emptySessionId);
    expect(emptyRes.statusCode).toBe(401);
    expect(emptyRes.body).toStrictEqual({ error: expect.any(String) });

    const invalidSessionId = controlUserSessionId + 'invalid';
    const invalidRes = adminLaunchVehicleDetailsRequest(invalidSessionId);
    expect(invalidRes.statusCode).toBe(401);
    expect(invalidRes.body).toStrictEqual({ error: expect.any(String) });
  });
});
