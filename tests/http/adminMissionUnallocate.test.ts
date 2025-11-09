import {
  clearRequest,
  adminAuthUserRegisterRequest,
  adminMissionCreateRequest,
  adminAstronautCreateRequest,
} from './requestHelpers'; 

import {
  adminMissionLaunchOrganiseRequest,
  adminMissionLaunchDetailsRequest,
  adminMissionLaunchAllocateRequest,
  adminMissionLaunchRemoveRequest,
} from './newRequestHelpers';

import {
  sampleUser1,
  sampleUser2,
  sampleMission1,
  sampleAstronaut,
} from './sampleTestData';

describe.skip('DELETE /v1/admin/mission/:missionid/launch/:launchid/allocate/:astronautid', () => {
  let controlUserSessionId: string;
  let missionId: number;
  let launchId: number;
  let astronautId: number;

  beforeEach(() => {
    const clearRes = clearRequest();
    expect(clearRes.statusCode).toBe(200);

    // Register a new user and get session
    const registerRes = adminAuthUserRegisterRequest(
      sampleUser1.email,
      sampleUser1.password,
      sampleUser1.nameFirst,
      sampleUser1.nameLast
    );
    expect(registerRes.statusCode).toBe(200);
    controlUserSessionId = registerRes.body.controlUserSessionId;

    // Create a mission
    const missionRes = adminMissionCreateRequest(
      controlUserSessionId,
      sampleMission1.name,
      sampleMission1.description,
      sampleMission1.target
    );
    expect(missionRes.statusCode).toBe(200);
    missionId = missionRes.body.missionId;
    expect(missionId).toStrictEqual(expect.any(Number));

    // Create an astronaut
    const astroRes = adminAstronautCreateRequest(
      controlUserSessionId,
      sampleAstronaut.nameFirst,
      sampleAstronaut.nameLast,
      sampleAstronaut.rank,
      sampleAstronaut.age,
      sampleAstronaut.weight,
      sampleAstronaut.height
    );
    expect(astroRes.statusCode).toBe(200);
    astronautId = astroRes.body.astronautId;
    expect(astronautId).toStrictEqual(expect.any(Number));

    // Organize a launch
    const organiseRes = adminMissionLaunchOrganiseRequest(
      controlUserSessionId,
      missionId,
      { description: 'Test payload', weight: 10 },
      {
        targetDistance: 1000,
        fuelBurnRate: 5,
        thrustFuel: 200,
        activeGravityForce: 9.8,
        maneuveringDelay: 0,
      }
    );
    expect(organiseRes.statusCode).toBe(200);
    launchId = organiseRes.body.launchId;
    expect(launchId).toStrictEqual(expect.any(Number));

    // Assign astronaut to this launch
    const allocateRes = adminMissionLaunchAllocateRequest(
      controlUserSessionId,
      astronautId,
      missionId,
      launchId
    );
    expect(allocateRes.statusCode).toBe(200);
  });

  afterAll(() => {
    const clearRes = clearRequest();
    expect(clearRes.statusCode).toBe(200);
  });

  test('Valid: Successfully unassign astronaut (200, empty object)', () => {
    const removeRes = adminMissionLaunchRemoveRequest(
      controlUserSessionId,
      astronautId,
      missionId,
      launchId
    );
    expect(removeRes.statusCode).toBe(200);
    expect(removeRes.body).toStrictEqual({});

    // Optional: Verify astronaut is no longer assigned
    const detailsRes = adminMissionLaunchDetailsRequest(
      controlUserSessionId,
      missionId,
      launchId
    );
    expect(detailsRes.statusCode).toBe(200);
    if (detailsRes.body && Array.isArray(detailsRes.body.allocatedAstronauts)) {
      const exists = detailsRes.body.allocatedAstronauts.some(
        (a: any) => a.astronautId === astronautId
      );
      expect(exists).toBe(false);
    }
  });

  test('401: ControlUserSessionId missing or invalid', () => {
    const emptyRes = adminMissionLaunchRemoveRequest(
      '',
      astronautId,
      missionId,
      launchId
    );
    expect(emptyRes.statusCode).toBe(401);
    expect(emptyRes.body).toStrictEqual({ error: expect.any(String) });

    const invalidRes = adminMissionLaunchRemoveRequest(
      controlUserSessionId + '_invalid',
      astronautId,
      missionId,
      launchId
    );
    expect(invalidRes.statusCode).toBe(401);
    expect(invalidRes.body).toStrictEqual({ error: expect.any(String) });
  });

  test('403: Another user tries to remove astronaut (not mission owner)', () => {
    const reg2 = adminAuthUserRegisterRequest(
      sampleUser2.email,
      sampleUser2.password,
      sampleUser2.nameFirst,
      sampleUser2.nameLast
    );
    expect(reg2.statusCode).toBe(200);
    const otherSessionId = reg2.body.controlUserSessionId;

    const res = adminMissionLaunchRemoveRequest(
      otherSessionId,
      astronautId,
      missionId,
      launchId
    );
    expect(res.statusCode).toBe(403);
    expect(res.body).toStrictEqual({ error: expect.any(String) });
  });

  test('400: Removing astronaut who is not assigned / invalid IDs', () => {
    const first = adminMissionLaunchRemoveRequest(
      controlUserSessionId,
      astronautId,
      missionId,
      launchId
    );
    expect(first.statusCode).toBe(200);

    const second = adminMissionLaunchRemoveRequest(
      controlUserSessionId,
      astronautId,
      missionId,
      launchId
    );
    expect(second.statusCode).toBe(400);
    expect(second.body).toStrictEqual({ error: expect.any(String) });

    const bad1 = adminMissionLaunchRemoveRequest(
      controlUserSessionId,
      999999,
      missionId,
      launchId
    );
    expect(bad1.statusCode).toBe(400);

    const bad2 = adminMissionLaunchRemoveRequest(
      controlUserSessionId,
      astronautId,
      999999,
      launchId
    );
    expect(bad2.statusCode).toBe(400);

    const bad3 = adminMissionLaunchRemoveRequest(
      controlUserSessionId,
      astronautId,
      missionId,
      999999
    );
    expect(bad3.statusCode).toBe(400);
  });
});