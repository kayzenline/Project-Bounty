import { v4 as uuid } from 'uuid';
import { adminAuthUserRegisterRequest, adminAuthUserLoginRequest, adminAstronautEditRequest, clearRequest, adminAstronautCreateRequest } from './requestHelpers';
import { getData } from '../../src/dataStore';
import { generateSessionId } from '../../src/helper';

function uniqueEmail(prefix = 'user') {
  return `${prefix}.${uuid()}@example.com`;
}

describe.skip('PUT /v1/admin/astronaut/{astronautid}', () => {
  let controlUserSessionId: string;
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

    const loginRes = adminAuthUserLoginRequest(email, password);
    expect(loginRes.statusCode).toBe(200);
    controlUserSessionId = loginRes.body;

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
    astronautId = createAstronautRes.body;
  });

  test('edit astronaut successfully', () => {
    const newAstronautNameFirst = 'newNameFirst';
    const newAstronautNameLast = 'newNameLast';
    const newRank = 'newRankOfAstronaut';
    const newAge = 25;
    const newWeight = 75;
    const newHeight = 175;

    const editAstronautRes = adminAstronautEditRequest(
      controlUserSessionId,
      astronautId,
      newAstronautNameFirst,
      newAstronautNameLast,
      newRank,
      newAge,
      newWeight,
      newHeight
    );
    expect(editAstronautRes.statusCode).toBe(200);
    expect(editAstronautRes.body).toBe({});

    const astronaut = getData().astronauts.find(a => a.astronautId === astronautId);
    if (astronaut) {
      expect(astronaut.nameFirst).toBe('newNameFirst');
      expect(astronaut.nameLast).toBe('newNameLast');
      expect(astronaut.age).toBe(25);
      expect(astronaut.weight).toBe(75);
      expect(astronaut.height).toBe(175);
    }
  });

  test('astronautId is invalid', () => {
    const invalidId = astronautId + 1;
    const newAstronautNameFirst = 'newNameFirst';
    const newAstronautNameLast = 'newNameLast';
    const newRank = 'newRankOfAstronaut';
    const newAge = 25;
    const newWeight = 75;
    const newHeight = 175;

    const editAstronautRes = adminAstronautEditRequest(
      controlUserSessionId,
      invalidId,
      newAstronautNameFirst,
      newAstronautNameLast,
      newRank,
      newAge,
      newWeight,
      newHeight
    );

    expect(editAstronautRes.statusCode).toBe(400);
    expect(editAstronautRes.body).toEqual({ error: expect.any(String) });
  });

  const invalidNameValue = [
    {
      newAstronautNameFirst: '',
      newAstronautNameLast: 'newNameLast',
      newRank: 'newRankOfAstronaut',
      newAge: 25,
      newWeight: 75,
      newHeight: 175
    },
    {
      newAstronautNameFirst: 'newNameFirst'.repeat(10),
      newAstronautNameLast: 'newNameLast',
      newRank: 'newRankOfAstronaut',
      newAge: 25,
      newWeight: 75,
      newHeight: 175
    },
    {
      newAstronautNameFirst: 'newNameFirst',
      newAstronautNameLast: '',
      newRank: 'newRankOfAstronaut',
      newAge: 25,
      newWeight: 75,
      newHeight: 175
    },
    {
      newAstronautNameFirst: 'newNameFirst',
      newAstronautNameLast: 'newNameLast'.repeat(10),
      newRank: 'newRankOfAstronaut',
      newAge: 25,
      newWeight: 75,
      newHeight: 175
    },
    {
      newAstronautNameFirst: 'newName@First',
      newAstronautNameLast: 'newNameLast',
      newRank: 'newRankOfAstronaut',
      newAge: 25,
      newWeight: 75,
      newHeight: 175
    },
    {
      newAstronautNameFirst: 'newNameFirst',
      newAstronautNameLast: 'newName@Last',
      newRank: 'newRankOfAstronaut',
      newAge: 25,
      newWeight: 75,
      newHeight: 175
    }
  ];
  test.each(invalidNameValue)('astronaut name is invalid', ({
    newAstronautNameFirst,
    newAstronautNameLast,
    newRank,
    newAge,
    newWeight,
    newHeight
  }) => {
    const editAstronautRes = adminAstronautEditRequest(
      controlUserSessionId,
      astronautId,
      newAstronautNameFirst,
      newAstronautNameLast,
      newRank,
      newAge,
      newWeight,
      newHeight
    );

    expect(editAstronautRes.statusCode).toBe(400);
    expect(editAstronautRes.body).toEqual({ error: expect.any(String) });
  });

  const invalidRankValue = [
    {
      newAstronautNameFirst: 'newNameFirst',
      newAstronautNameLast: 'newNameLast',
      newRank: 'newRankOfAstronaut'.repeat(10),
      newAge: 25,
      newWeight: 75,
      newHeight: 175
    },
    {
      newAstronautNameFirst: 'newNameFirst',
      newAstronautNameLast: 'newNameLast',
      newRank: '',
      newAge: 25,
      newWeight: 75,
      newHeight: 175
    },
    {
      newAstronautNameFirst: 'newNameFirst',
      newAstronautNameLast: 'newNameLast',
      newRank: 'newRank@Astronaut',
      newAge: 25,
      newWeight: 75,
      newHeight: 175
    }
  ];
  test.each(invalidRankValue)('astronaut rank is invalid', ({
    newAstronautNameFirst,
    newAstronautNameLast,
    newRank,
    newAge,
    newWeight,
    newHeight
  }) => {
    const editAstronautRes = adminAstronautEditRequest(
      controlUserSessionId,
      astronautId,
      newAstronautNameFirst,
      newAstronautNameLast,
      newRank,
      newAge,
      newWeight,
      newHeight
    );

    expect(editAstronautRes.statusCode).toBe(400);
    expect(editAstronautRes.body).toEqual({ error: expect.any(String) });
  });

  const invalidAgeValue = [
    {
      newAstronautNameFirst: 'newNameFirst',
      newAstronautNameLast: 'newNameLast',
      newRank: 'newRankOfAstronaut',
      newAge: 19,
      newWeight: 75,
      newHeight: 175
    },
    {
      newAstronautNameFirst: 'newNameFirst',
      newAstronautNameLast: 'newNameLast',
      newRank: 'newRankOfAstronaut',
      newAge: 61,
      newWeight: 75,
      newHeight: 175
    }
  ];
  test.each(invalidAgeValue)('astronaut age is not meet the requirement', ({
    newAstronautNameFirst,
    newAstronautNameLast,
    newRank,
    newAge,
    newWeight,
    newHeight
  }) => {
    const editAstronautRes = adminAstronautEditRequest(
      controlUserSessionId,
      astronautId,
      newAstronautNameFirst,
      newAstronautNameLast,
      newRank,
      newAge,
      newWeight,
      newHeight
    );

    expect(editAstronautRes.statusCode).toBe(400);
    expect(editAstronautRes.body).toEqual({ error: expect.any(String) });
  });

  test('astronaut weight is not meet the requirement', () => {
    const newAstronautNameFirst = 'newNameFirst';
    const newAstronautNameLast = 'newNameLast';
    const newRank = 'newRankOfAstronaut';
    const newAge = 25;
    const newWeight = 101;
    const newHeight = 175;

    const editAstronautRes = adminAstronautEditRequest(
      controlUserSessionId,
      astronautId,
      newAstronautNameFirst,
      newAstronautNameLast,
      newRank,
      newAge,
      newWeight,
      newHeight
    );

    expect(editAstronautRes.statusCode).toBe(400);
    expect(editAstronautRes.body).toEqual({ error: expect.any(String) });
  });

  const invalidHeightValue = [
    {
      newAstronautNameFirst: 'newNameFirst',
      newAstronautNameLast: 'newNameLast',
      newRank: 'newRankOfAstronaut',
      newAge: 25,
      newWeight: 75,
      newHeight: 149
    },
    {
      newAstronautNameFirst: 'newNameFirst',
      newAstronautNameLast: 'newNameLast',
      newRank: 'newRankOfAstronaut',
      newAge: 25,
      newWeight: 75,
      newHeight: 201
    }
  ];
  test.each(invalidHeightValue)('astronaut height is not meet the requirement', ({
    newAstronautNameFirst,
    newAstronautNameLast,
    newRank,
    newAge,
    newWeight,
    newHeight
  }) => {
    const editAstronautRes = adminAstronautEditRequest(
      controlUserSessionId,
      astronautId,
      newAstronautNameFirst,
      newAstronautNameLast,
      newRank,
      newAge,
      newWeight,
      newHeight
    );

    expect(editAstronautRes.statusCode).toBe(400);
    expect(editAstronautRes.body).toEqual({ error: expect.any(String) });
  });

  const invalidSessionIdValue = [
    {
      invalidSessionId: '',
      newAstronautNameFirst: 'newNameFirst',
      newAstronautNameLast: 'newNameLast',
      newRank: 'newRankOfAstronaut',
      newAge: 25,
      newWeight: 75,
      newHeight: 175
    },
    {
      invalidSessionId: generateSessionId(),
      newAstronautNameFirst: 'newNameFirst',
      newAstronautNameLast: 'newNameLast',
      newRank: 'newRankOfAstronaut',
      newAge: 25,
      newWeight: 75,
      newHeight: 175
    }
  ];
  test.each(invalidSessionIdValue)('controlUserSessionId is invalid', ({
    invalidSessionId,
    newAstronautNameFirst,
    newAstronautNameLast,
    newRank,
    newAge,
    newWeight,
    newHeight
  }) => {
    const editAstronautRes = adminAstronautEditRequest(
      invalidSessionId,
      astronautId,
      newAstronautNameFirst,
      newAstronautNameLast,
      newRank,
      newAge,
      newWeight,
      newHeight
    );

    expect(editAstronautRes.statusCode).toBe(401);
    expect(editAstronautRes.body).toEqual({ error: expect.any(String) });
  });
});
