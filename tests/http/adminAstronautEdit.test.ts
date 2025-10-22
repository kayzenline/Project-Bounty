import { v4 as uuid } from 'uuid';
import { userRegister, userLogin, editAstronaut, clearRequest, createAstronaut } from './requestHelpers';
import { getData } from '../../src/dataStore';
import { generateSessionId } from '../../src/helper';

function uniqueEmail(prefix = 'user') {
  return `${prefix}.${uuid()}@example.com`;
}

describe('PUT /v1/admin/astronaut/{astronautid}',() => {
  let controlUserSessionId: string;
  let astronautId: number;
  beforeEach(()=> {
    const clearRes = clearRequest();
    expect(clearRes.statusCode).toBe(200);

    const email = uniqueEmail('success');
    const password = 'password';
    const nameFirst = 'namefirst';
    const nameLast = 'nameLast';
    const registerRes = userRegister(email, password, nameFirst, nameLast);
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

  test('edit astronaut successfully',() => {
    const newAstronautNameFirst = 'newNameFirst';
    const newAstronautNameLat = 'newNameLast';
    const newRank = 'newRankOfAstronaut';
    const newAge = 25;
    const newWeight = 75;
    const newHeight = 175;

    const editAstronautRes = editAstronaut(
      controlUserSessionId,
      astronautId,
      newAstronautNameFirst,
      newAstronautNameLat,
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

  test('astronautId is invalid',() => {
    const invalidId = astronautId + 1;
    const newAstronautNameFirst = 'newNameFirst';
    const newAstronautNameLat = 'newNameLast';
    const newRank = 'newRankOfAstronaut';
    const newAge = 25;
    const newWeight = 75;
    const newHeight = 175;

    const editAstronautRes = editAstronaut(
      controlUserSessionId,
      invalidId,
      newAstronautNameFirst,
      newAstronautNameLat,
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
      newAstronautNameLat: 'newNameLast',
      newRank: 'newRankOfAstronaut',
      newAge: 25,
      newWeight: 75,
      newHeight: 175
    },
    {
      newAstronautNameFirst: 'newNameFirst'.repeat(10),
      newAstronautNameLat: 'newNameLast',
      newRank: 'newRankOfAstronaut',
      newAge: 25,
      newWeight: 75,
      newHeight: 175
    },
    {
      newAstronautNameFirst: 'newNameFirst',
      newAstronautNameLat: '',
      newRank: 'newRankOfAstronaut',
      newAge: 25,
      newWeight: 75,
      newHeight: 175
    },
    {
      newAstronautNameFirst: 'newNameFirst',
      newAstronautNameLat: 'newNameLast'.repeat(10),
      newRank: 'newRankOfAstronaut',
      newAge: 25,
      newWeight: 75,
      newHeight: 175
    },
    {
      newAstronautNameFirst: 'newName@First',
      newAstronautNameLat: 'newNameLast',
      newRank: 'newRankOfAstronaut',
      newAge: 25,
      newWeight: 75,
      newHeight: 175
    },
    {
      newAstronautNameFirst: 'newNameFirst',
      newAstronautNameLat: 'newName@Last',
      newRank: 'newRankOfAstronaut',
      newAge: 25,
      newWeight: 75,
      newHeight: 175
    }
  ];
  test.each(invalidNameValue)('astronaut name is invalid',({ 
    newAstronautNameFirst, 
    newAstronautNameLat, 
    newRank, 
    newAge, 
    newWeight, 
    newHeight 
  }) => {
    const editAstronautRes = editAstronaut(
      controlUserSessionId,
      astronautId,
      newAstronautNameFirst,
      newAstronautNameLat,
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
      newAstronautNameLat: 'newNameLast',
      newRank: 'newRankOfAstronaut'.repeat(10),
      newAge: 25,
      newWeight: 75,
      newHeight: 175
    },
    {
      newAstronautNameFirst: 'newNameFirst',
      newAstronautNameLat: 'newNameLast',
      newRank: '',
      newAge: 25,
      newWeight: 75,
      newHeight: 175
    },
    {
      newAstronautNameFirst: 'newNameFirst',
      newAstronautNameLat: 'newNameLast',
      newRank: 'newRank@Astronaut',
      newAge: 25,
      newWeight: 75,
      newHeight: 175
    }
  ];
  test.each(invalidRankValue)('astronaut rank is invalid',({
    newAstronautNameFirst, 
    newAstronautNameLat, 
    newRank, 
    newAge, 
    newWeight, 
    newHeight 
  }) => {
    const editAstronautRes = editAstronaut(
      controlUserSessionId,
      astronautId,
      newAstronautNameFirst,
      newAstronautNameLat,
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
      newAstronautNameLat: 'newNameLast',
      newRank: 'newRankOfAstronaut',
      newAge: 19,
      newWeight: 75,
      newHeight: 175
    },
    {
      newAstronautNameFirst: 'newNameFirst',
      newAstronautNameLat: 'newNameLast',
      newRank: 'newRankOfAstronaut',
      newAge: 61,
      newWeight: 75,
      newHeight: 175
    }
  ];
  test.each(invalidAgeValue)('astronaut age is not meet the requirement',({
    newAstronautNameFirst, 
    newAstronautNameLat, 
    newRank, 
    newAge, 
    newWeight, 
    newHeight 
  }) => {
    const editAstronautRes = editAstronaut(
      controlUserSessionId,
      astronautId,
      newAstronautNameFirst,
      newAstronautNameLat,
      newRank,
      newAge,
      newWeight,
      newHeight
    );

    expect(editAstronautRes.statusCode).toBe(400);
    expect(editAstronautRes.body).toEqual({ error: expect.any(String) });
  });

  test('astronaut weight is not meet the requirement',() => {
    const newAstronautNameFirst = 'newNameFirst';
    const newAstronautNameLat = 'newNameLast';
    const newRank = 'newRankOfAstronaut';
    const newAge = 25;
    const newWeight = 101;
    const newHeight = 175;

    const editAstronautRes = editAstronaut(
      controlUserSessionId,
      astronautId,
      newAstronautNameFirst,
      newAstronautNameLat,
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
      newAstronautNameLat: 'newNameLast',
      newRank: 'newRankOfAstronaut',
      newAge: 25,
      newWeight: 75,
      newHeight: 149
    },
    {
      newAstronautNameFirst: 'newNameFirst',
      newAstronautNameLat: 'newNameLast',
      newRank: 'newRankOfAstronaut',
      newAge: 25,
      newWeight: 75,
      newHeight: 201
    }
  ];
  test.each(invalidHeightValue)('astronaut height is not meet the requirement',({
    newAstronautNameFirst, 
    newAstronautNameLat, 
    newRank, 
    newAge, 
    newWeight, 
    newHeight 
  }) => {
    const editAstronautRes = editAstronaut(
      controlUserSessionId,
      astronautId,
      newAstronautNameFirst,
      newAstronautNameLat,
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
      newAstronautNameLat: 'newNameLast',
      newRank: 'newRankOfAstronaut',
      newAge: 25,
      newWeight: 75,
      newHeight: 175
    },
    {
      invalidSessionId: generateSessionId(),
      newAstronautNameFirst: 'newNameFirst',
      newAstronautNameLat: 'newNameLast',
      newRank: 'newRankOfAstronaut',
      newAge: 25,
      newWeight: 75,
      newHeight: 175
    }
  ];
  test.each(invalidSessionIdValue)('controlUserSessionId is invalid',({
    invalidSessionId,
    newAstronautNameFirst, 
    newAstronautNameLat, 
    newRank, 
    newAge, 
    newWeight, 
    newHeight 
  }) => {

    const editAstronautRes = editAstronaut(
      invalidSessionId,
      astronautId,
      newAstronautNameFirst,
      newAstronautNameLat,
      newRank,
      newAge,
      newWeight,
      newHeight
    );

    expect(editAstronautRes.statusCode).toBe(401);
    expect(editAstronautRes.body).toEqual({ error: expect.any(String) });
  });
});