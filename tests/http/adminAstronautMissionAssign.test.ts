import { v4 as uuid } from 'uuid';
import { adminAuthUserRegisterRequest, adminAuthUserLoginRequest, clearRequest, adminAstronautCreateRequest, adminAstronautAssignRequest, adminMissionCreateRequest } from './requestHelpers';
import { generateSessionId,} from '../../src/helper';

function uniqueEmail(prefix = 'user') {
  return `${prefix}.${uuid()}@example.com`;
}

describe.skip('POST /v1/admin/mission/{missionid}/assign/{astronautid}',()=>{
  let controlUserSessionId:string;
  let astronautId: number;
  let missionId: number;
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
      const astronautNameLat = 'NameLast';
      const rank = 'rankOfAstronaut';
      const age = 20;
      const weight = 70;
      const height = 170;
      const createAstronautRes = adminAstronautCreateRequest(
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
      const missionName = 'Mission test';
      const missionDescription = 'Mission Description test';
      const missionTarget = 'Mars';
      const adminMissionCreateRequestRes=adminMissionCreateRequest(
        controlUserSessionId,
        missionName,
        missionDescription,
        missionTarget,
      );
      expect(adminMissionCreateRequestRes.statusCode).toBe(200);
      missionId=adminMissionCreateRequestRes.body;
  });
  test('assign mission successfully',() => {
    const assignAstronautRes = adminAstronautAssignRequest(
      controlUserSessionId,
      astronautId,
      missionId,
    );
    expect(assignAstronautRes.statusCode).toBe(200);
    expect(assignAstronautRes.body).toEqual({});
  });

  test('astronaut id is invalid',() => {
    const invalidAstronautId = astronautId + 1;
    const assignAstronautRes = adminAstronautAssignRequest(
      controlUserSessionId,
      invalidAstronautId,
      missionId,
    );
    expect(assignAstronautRes.statusCode).toBe(400);
    expect(assignAstronautRes.body).toEqual({ error: expect.any(String) });
  });

  test('astronaut is already assigned to another mission',() => {
    const assignAstronautRes1 = adminAstronautAssignRequest(
      controlUserSessionId,
      astronautId,
      missionId,
    );
    expect(assignAstronautRes1.statusCode).toBe(200);
    const mission2 =
      {
      name: 'Kitty',
      description: 'Place a manned spacecraft in orbital flight around the mars. Investigate a persons performance capabilities and their ability to function in the environment of space. Recover the person and the spacecraft safely',
      target: 'Mars orbit',
      };
      const createMissionRes2 = adminMissionCreateRequest(controlUserSessionId, mission2.name, mission2.description, mission2.target);
      expect(createMissionRes2.statusCode).toBe(200);
      const assignAstronautRes2 = adminAstronautAssignRequest(controlUserSessionId, astronautId, createMissionRes2.body);
      expect(assignAstronautRes2.statusCode).toBe(400);
      expect(assignAstronautRes2.body).toEqual({ error: expect.any(String) });
  });
  
    const invalidSessionIdValue = [
      {
        invalidSessionId: '',
      },
      {
        invalidSessionId: generateSessionId(),
      }
    ];
    test.each(invalidSessionIdValue)('controlUserSessionId is invalid',({invalidSessionId}) => {
  
      const assignAstronautRes = adminAstronautAssignRequest(
        invalidSessionId,
        astronautId,
        missionId
      );
  
      expect(assignAstronautRes.statusCode).toBe(401);
      expect(assignAstronautRes.body).toEqual({ error: expect.any(String) });
    });

    test('mission does not belong to owner',() => {
      const email2 = uniqueEmail('user2');
      const registerRes2 = adminAuthUserRegisterRequest(email2, 'password', 'nameFirst', 'nameLast');
      expect(registerRes2.statusCode).toBe(200);
      const loginRes2 = adminAuthUserLoginRequest(email2, 'password');
      expect(loginRes2.statusCode).toBe(200);
      const controlUserSessionId2 = loginRes2.body;
      const missionRes = adminMissionCreateRequest(
        controlUserSessionId2,
        'mission name',
        'Description',
        'target'
      );
      expect(missionRes.statusCode).toBe(200);
      const user2MissionId = missionRes.body;
      const assignRes = adminAstronautAssignRequest(
        controlUserSessionId,  
        astronautId,           
        user2MissionId        
      );
      expect(assignRes.statusCode).toBe(403);
      expect(assignRes.body).toEqual({ error: expect.any(String) });
    });

    test('missionid is invalid', () => {
      const invalidMissionId = 999; 
      const assignRes = adminAstronautAssignRequest(
        controlUserSessionId,
        astronautId,
        invalidMissionId
      );  
      expect(assignRes.statusCode).toBe(403);
      expect(assignRes.body).toEqual({ error: expect.any(String) });
    });
});