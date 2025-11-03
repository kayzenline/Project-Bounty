import { v4 as uuid } from 'uuid';
import { adminAuthUserRegisterRequest, adminAuthUserLoginRequest, adminAstronautDeleteRequest, clearRequest, adminAstronautCreateRequest, adminAstronautAssignRequest, adminMissionCreateRequest } from './requestHelpers';
import { getData } from '../../src/dataStore';
import { generateSessionId } from '../../src/helper';

function uniqueEmail(prefix = 'user') {
  return `${prefix}.${uuid().split('-').pop() || ''}@example.com`;
}

describe('DELETE /v1/admin/astronaut/{astronautid}', () => {
  let controlUserSessionId: string;
  let astronautId: number;
  beforeEach(() => {
    const clearRes = clearRequest();
    expect(clearRes.statusCode).toBe(200);

    const email = uniqueEmail('success');
    const password = 'ValidPass123';
    const nameFirst = 'namefirst';
    const nameLast = 'nameLast';
    const registerRes = adminAuthUserRegisterRequest(email, password, nameFirst, nameLast);
    expect(registerRes.statusCode).toBe(200);

    controlUserSessionId = registerRes.body.controlUserSessionId;

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
  });
  test('delete an astronaut successfully', () => {
    const deleteAstronautRes = adminAstronautDeleteRequest(
      controlUserSessionId,
      astronautId
    );

    expect(deleteAstronautRes.statusCode).toBe(200);
    expect(deleteAstronautRes.body).toEqual({});

    const astronaut = getData().astronauts.find(a => a.astronautId === astronautId);
    expect(astronaut).toBe(undefined);
  });

  test('astronaut id is invalid', () => {
    const invalAstronautId = astronautId + 1;
    const deleteAstronautRes = adminAstronautDeleteRequest(
      controlUserSessionId,
      invalAstronautId
    );

    expect(deleteAstronautRes.statusCode).toBe(400);
    expect(deleteAstronautRes.body).toEqual({ error: expect.any(String) });
  });

  test('delete an astronaut assgined to a mission', () => {
    const mission = {
      name: 'Mercury',
      description: 'Place a manned spacecraft in orbital flight around the earth. Investigate a persons performance capabilities and their ability to function in the environment of space. Recover the person and the spacecraft safely',
      target: 'Earth orbit',
    };
    const createMissionRes = adminMissionCreateRequest(controlUserSessionId, mission.name, mission.description, mission.target);
    expect(createMissionRes.statusCode).toBe(200);

    const assignAstronautRes = adminAstronautAssignRequest(controlUserSessionId, astronautId, createMissionRes.body.missionId);
    expect(assignAstronautRes.statusCode).toBe(200);

    const deleteAstronautRes = adminAstronautDeleteRequest(
      controlUserSessionId,
      astronautId
    );

    expect(deleteAstronautRes.statusCode).toBe(400);
    expect(deleteAstronautRes.body).toEqual({ error: expect.any(String) });
  });

  const invalidSessionIdValue = [
    {
      invalidSessionId: '',
    },
    {
      invalidSessionId: generateSessionId(),
    }
  ];
  test.each(invalidSessionIdValue)('controlUserSessionId is invalid', ({ invalidSessionId }) => {
    const deleteAstronautRes = adminAstronautDeleteRequest(
      invalidSessionId,
      astronautId
    );

    expect(deleteAstronautRes.statusCode).toBe(401);
    expect(deleteAstronautRes.body).toEqual({ error: expect.any(String) });
  });
});
