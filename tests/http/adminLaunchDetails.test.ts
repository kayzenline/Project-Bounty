import {
  adminLaunchVehicleCreateRequest,
  adminLaunchDetailsRequest,
  adminMissionLaunchOrganiseRequest,
  adminMissionLaunchStatusUpdateRequest
} from './newRequestHelpers';
import { adminAuthUserRegisterRequest, adminMissionCreateRequest, clearRequest } from './requestHelpers';
import {
  sampleMission1,
  sampleMission2,
  sampleLaunchVehicle1,
  sampleLaunchVehicle2,
  sampleLaunch1,
  sampleLaunchParameters2,
  samplePayload2,
  sampleUser1
} from './sampleTestData';

const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

jest.setTimeout(15000);

describe('GET /v1/admin/launch/list', () => {
  let controlUserSessionId: string;
  let missionIdActive: number;
  let missionIdCompleted: number;
  let launchIdActive: number;
  let launchIdCompleted: number;

  async function progressLaunchToMissionComplete(missionId: number, launchId: number) {
    const liftoffRes = adminMissionLaunchStatusUpdateRequest(
      controlUserSessionId,
      missionId,
      launchId,
      'LIFTOFF'
    );
    expect(liftoffRes.statusCode).toBe(200);

    await delay(3200);

    const fireThrustersRes = adminMissionLaunchStatusUpdateRequest(
      controlUserSessionId,
      missionId,
      launchId,
      'FIRE_THRUSTERS'
    );
    expect(fireThrustersRes.statusCode).toBe(200);

    const deployPayloadRes = adminMissionLaunchStatusUpdateRequest(
      controlUserSessionId,
      missionId,
      launchId,
      'DEPLOY_PAYLOAD'
    );
    expect(deployPayloadRes.statusCode).toBe(200);
  }

  beforeEach(async () => {
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

    const missionActiveRes = adminMissionCreateRequest(
      controlUserSessionId,
      sampleMission1.name,
      sampleMission1.description,
      sampleMission1.target
    );
    expect(missionActiveRes.statusCode).toBe(200);
    missionIdActive = missionActiveRes.body.missionId;

    const missionCompletedRes = adminMissionCreateRequest(
      controlUserSessionId,
      sampleMission2.name,
      sampleMission2.description,
      sampleMission2.target
    );
    expect(missionCompletedRes.statusCode).toBe(200);
    missionIdCompleted = missionCompletedRes.body.missionId;

    const launchVehicleActiveRes = adminLaunchVehicleCreateRequest(
      controlUserSessionId,
      sampleLaunchVehicle1.name,
      sampleLaunchVehicle1.description,
      sampleLaunchVehicle1.maxCrewWeight,
      sampleLaunchVehicle1.maxPayloadWeight,
      sampleLaunchVehicle1.launchVehicleWeight,
      sampleLaunchVehicle1.thrustCapacity,
      sampleLaunchVehicle1.maneuveringFuel
    );
    expect(launchVehicleActiveRes.statusCode).toBe(200);
    const launchVehicleIdActive = launchVehicleActiveRes.body.launchVehicleId;

    const launchVehicleCompletedRes = adminLaunchVehicleCreateRequest(
      controlUserSessionId,
      sampleLaunchVehicle2.name,
      sampleLaunchVehicle2.description,
      sampleLaunchVehicle2.maxCrewWeight,
      sampleLaunchVehicle2.maxPayloadWeight,
      sampleLaunchVehicle2.launchVehicleWeight,
      sampleLaunchVehicle2.thrustCapacity,
      sampleLaunchVehicle2.maneuveringFuel
    );
    expect(launchVehicleCompletedRes.statusCode).toBe(200);
    const launchVehicleIdCompleted = launchVehicleCompletedRes.body.launchVehicleId;

    const activeLaunchRes = adminMissionLaunchOrganiseRequest(
      controlUserSessionId,
      missionIdActive,
      launchVehicleIdActive,
      sampleLaunch1.payload,
      sampleLaunch1.launchParameters
    );
    expect(activeLaunchRes.statusCode).toBe(200);
    launchIdActive = activeLaunchRes.body.launchId;

    const completedLaunchRes = adminMissionLaunchOrganiseRequest(
      controlUserSessionId,
      missionIdCompleted,
      launchVehicleIdCompleted,
      samplePayload2,
      sampleLaunchParameters2
    );
    expect(completedLaunchRes.statusCode).toBe(200);
    launchIdCompleted = completedLaunchRes.body.launchId;

    await progressLaunchToMissionComplete(missionIdCompleted, launchIdCompleted);
  });

  afterAll(() => {
    const clearRes = clearRequest();
    expect(clearRes.statusCode).toBe(200);
  });

  test('lists active and completed launches for a valid control user session', () => {
    const listRes = adminLaunchDetailsRequest(controlUserSessionId);
    expect(listRes.statusCode).toBe(200);
    expect(listRes.body).toStrictEqual({
      activeLaunches: [launchIdActive],
      completedLaunches: [launchIdCompleted]
    });
  });

  test('returns 401 when the control user session id is invalid', () => {
    const listRes = adminLaunchDetailsRequest('bad-session-id');
    expect(listRes.statusCode).toBe(401);
    expect(listRes.body).toStrictEqual({ error: expect.any(String) });
  });
});
