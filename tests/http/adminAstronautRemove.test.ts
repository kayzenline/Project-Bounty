import { v4 as uuid } from 'uuid';
import { adminAuthUserRegisterRequest, userLogin, deleteAstronaut, clearRequest, createAstronaut, assignAstronaut, adminMissionCreateRequest } from './requestHelpers';
import { getData } from '../../src/dataStore';
import { generateSessionId } from '../../src/helper';

function uniqueEmail(prefix = 'user') {
  return `${prefix}.${uuid()}@example.com`;
}

describe.skip('DELETE /v1/admin/astronaut/{astronautid}', () => {
  let controlUserSessionId:string;
  let astronautId: number;
  beforeEach(() => {
    const clearRes = clearRequest();
    expect(clearRes.statusCode).toBe(200);

    const email = uniqueEmail('success');
    const password = 'password';
    const nameFirst = 'namefirst';
    const nameLast = 'nameLast';
    const registerRes = adminAuthUserRegisterRequest(email, password, nameFirst, nameLast);
    expect(registerRes.statusCode).toBe(200);

    const loginRes = userLogin(email, password);
    expect(loginRes.statusCode).toBe(200);
    controlUserSessionId = loginRes.body;

    const astronautNameFirst = 'NameFirst';
    const astronautNameLat = 'NameLast';
    const rank = 'rankOfAstronaut';
    const age = 20;
    const weight = 70;
    const height = 170;
    const createAstronautRes = createAstronaut(
      controlUserSessionId,
      astronautNameFirst,
      astronautNameLat,
      rank,
      age,
      weight,
      height
    );
    expect(createAstronautRes.statusCode).toBe(200);
    astronautId = createAstronautRes.body;
  });
  test('delete an astronaut successfully', () => {
    const deleteAstronautRes = deleteAstronaut(
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
    const deleteAstronautRes = deleteAstronaut(
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

    const assignAstronautRes = assignAstronaut(controlUserSessionId, astronautId, createMissionRes.body);
    expect(assignAstronautRes).toBe(200);

    const deleteAstronautRes = deleteAstronaut(
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
    const deleteAstronautRes = deleteAstronaut(
      invalidSessionId,
      astronautId
    );

    expect(deleteAstronautRes.statusCode).toBe(401);
    expect(deleteAstronautRes.body).toEqual({ error: expect.any(String) });
  });
});
