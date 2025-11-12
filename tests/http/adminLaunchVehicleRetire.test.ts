import {
  adminLaunchVehicleCreateRequest,
  adminLaunchVehicleRetireRequest,
  adminLaunchVehicleInfoRequest,
  adminMissionLaunchOrganiseRequest
} from './newRequestHelpers';
import {
  adminAuthUserRegisterRequest,
  adminMissionCreateRequest,
  clearRequest
} from './requestHelpers';
import {
  sampleUser1,
  sampleMission1,
  sampleLaunchVehicle1,
  samplePayload1,
  sampleLaunchParameters1
} from './sampleTestData';
import { generateSessionId } from '../../src/logic/helper';

describe('DELETE /v1/admin/launchvehicle/{launchvehicleid}', () => {
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

  test('Successfully retires an idle launch vehicle', () => {
    const retireRes = adminLaunchVehicleRetireRequest(
      controlUserSessionId,
      launchVehicleId
    );
    expect(retireRes.statusCode).toBe(200);
    expect(retireRes.body).toStrictEqual({});

    const infoRes = adminLaunchVehicleInfoRequest(controlUserSessionId, launchVehicleId);
    expect(infoRes.statusCode).toBe(200);
    expect(infoRes.body).toMatchObject({
      launchVehicleId,
      retired: true
    });
  });

  test('Returns 401 when ControlUserSessionId is missing or invalid', () => {
    const missingRes = adminLaunchVehicleRetireRequest(
      '',
      launchVehicleId
    );
    expect(missingRes.statusCode).toBe(401);
    expect(missingRes.body).toStrictEqual({ error: expect.any(String) });

    const invalidRes = adminLaunchVehicleRetireRequest(
      generateSessionId(),
      launchVehicleId
    );
    expect(invalidRes.statusCode).toBe(401);
    expect(invalidRes.body).toStrictEqual({ error: expect.any(String) });
  });

  test('Returns 400 for invalid launchvehicleid', () => {
    const retireRes = adminLaunchVehicleRetireRequest(
      controlUserSessionId,
      launchVehicleId + 999
    );
    expect(retireRes.statusCode).toBe(400);
    expect(retireRes.body).toStrictEqual({ error: expect.any(String) });
  });

  test('Returns 400 if launch vehicle is allocated to an active launch', () => {
    const missionRes = adminMissionCreateRequest(
      controlUserSessionId,
      sampleMission1.name,
      sampleMission1.description,
      sampleMission1.target
    );
    expect(missionRes.statusCode).toBe(200);
    const missionId = missionRes.body.missionId;

    const launchRes = adminMissionLaunchOrganiseRequest(
      controlUserSessionId,
      missionId,
      launchVehicleId,
      samplePayload1,
      sampleLaunchParameters1
    );
    expect(launchRes.statusCode).toBe(200);

    const retireRes = adminLaunchVehicleRetireRequest(
      controlUserSessionId,
      launchVehicleId
    );
    expect(retireRes.statusCode).toBe(400);
    expect(retireRes.body).toStrictEqual({ error: expect.any(String) });
  });
});
