import { v4 as uuid } from 'uuid';
import { adminAuthUserRegisterRequest, adminAstronautEditRequest, clearRequest, adminAstronautCreateRequest } from './requestHelpers';
import { getData } from '../../src/dataStore';
import { generateSessionId } from '../../src/helper';

function uniqueEmail(prefix = 'user') {
  return `${prefix}.${uuid().split('-').pop() || ''}@example.com`;
}

describe('PUT /v1/admin/astronaut/{astronautid}', () => {
  let controlUserSessionId: string;
  let astronautId: number;
  beforeEach(() => {
    const clearRes = clearRequest();
    expect(clearRes.statusCode).toBe(200);

    const email = uniqueEmail('success');
    const password = 'password123';
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

  const dataCase = [
    {
      newAstronautNameFirst: 'newNameFirst',
      newAstronautNameLast: 'newNameLast',
      newRank: 'newRankOfAstronaut',
      newAge: 25,
      newWeight: 75,
      newHeight: 175,
    },
    {
      newAstronautNameFirst: 'newNameFirst',
      newAstronautNameLast: 'NameLast',
      newRank: 'RankOfAstronaut',
      newAge: 20,
      newWeight: 70,
      newHeight: 170,
    },
    {
      newAstronautNameFirst: 'NameFirst',
      newAstronautNameLast: 'newNameLast',
      newRank: 'RankOfAstronaut',
      newAge: 20,
      newWeight: 70,
      newHeight: 170,
    },
    {
      newAstronautNameFirst: 'NameFirst',
      newAstronautNameLast: 'NameLast',
      newRank: 'newRankOfAstronaut',
      newAge: 20,
      newWeight: 70,
      newHeight: 170,
    },
    {
      newAstronautNameFirst: 'NameFirst',
      newAstronautNameLast: 'NameLast',
      newRank: 'RankOfAstronaut',
      newAge: 25,
      newWeight: 70,
      newHeight: 170,
    },
    {
      newAstronautNameFirst: 'NameFirst',
      newAstronautNameLast: 'NameLast',
      newRank: 'RankOfAstronaut',
      newAge: 20,
      newWeight: 75,
      newHeight: 170,
    },
    {
      newAstronautNameFirst: 'NameFirst',
      newAstronautNameLast: 'NameLast',
      newRank: 'RankOfAstronaut',
      newAge: 20,
      newWeight: 70,
      newHeight: 175,
    },
  ];
  test.each(dataCase)('edit astronaut successfully', ({ newAstronautNameFirst, newAstronautNameLast, newRank, newAge, newWeight, newHeight }) => {

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
    expect(editAstronautRes.body).toStrictEqual({});

    const astronaut = getData().astronauts.find(a => a.astronautId === astronautId);
    if (astronaut) {
      expect(astronaut.nameFirst).toBe(newAstronautNameFirst);
      expect(astronaut.nameLast).toBe(newAstronautNameLast);
      expect(astronaut.age).toBe(newAge);
      expect(astronaut.weight).toBe(newWeight);
      expect(astronaut.height).toBe(newHeight);
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
