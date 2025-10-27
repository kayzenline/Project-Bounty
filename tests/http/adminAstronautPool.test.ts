import { v4 as uuid } from 'uuid';
import { adminAuthUserRegisterRequest, adminAuthUserLoginRequest, adminAstronautDeleteRequest, clearRequest, adminAstronautCreateRequest, adminAstronautAssignRequest, adminMissionCreateRequest, adminAstronautPoolRequest } from './requestHelpers';
import { getData } from '../../src/dataStore';
import { generateSessionId } from '../../src/helper';

function uniqueEmail(prefix = 'user') {
  return `${prefix}.${uuid().split('-').pop() || ''}@example.com`;
}

describe('GET /v1/admin/astronaut/pool', () => {
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

    const astronautNameFirst2 = 'NameSecond';
    const astronautNameLast2 = 'NameOther';
    const rank2 = 'rankOfAstronautTwo';
    const age2 = 25;
    const weight2 = 75;
    const height2 = 175;
    const createAstronautRes2 = adminAstronautCreateRequest(
      controlUserSessionId,
      astronautNameFirst2,
      astronautNameLast2,
      rank2,
      age2,
      weight2,
      height2
    );
    expect(createAstronautRes2.statusCode).toBe(200);
  });
  test('list all astronauts in the pool successfully', () => {
    // assign the fitst astronaut to a misison
    const mission = {
      name: 'Mercury',
      description: 'Place a manned spacecraft in orbital flight around the earth. Investigate a persons performance capabilities and their ability to function in the environment of space. Recover the person and the spacecraft safely',
      target: 'Earth orbit',
    };
    const createMissionRes = adminMissionCreateRequest(controlUserSessionId, mission.name, mission.description, mission.target);
    expect(createMissionRes.statusCode).toBe(200);
    const assignAstronautRes = adminAstronautAssignRequest(controlUserSessionId, astronautId, createMissionRes.body.missionId);
    expect(assignAstronautRes.statusCode).toBe(200);

    const astronautPoolRes = adminAstronautPoolRequest(controlUserSessionId);

    // check the number of listed astronauts
    expect(astronautPoolRes.statusCode).toBe(200);
    const astronauts = getData().astronauts;
    expect(astronautPoolRes.body).toHaveLength(astronauts.length);

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
    const astronautPoolRes = adminAstronautPoolRequest( invalidSessionId );

    expect(astronautPoolRes.statusCode).toBe(401);
    expect(astronautPoolRes.body).toEqual({ error: expect.any(String) });
  });

  afterEach(() => {
    const clearRes = clearRequest();
    expect(clearRes.statusCode).toBe(200);
  });
});
