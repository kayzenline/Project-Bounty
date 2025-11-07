// improte your request here!
import { adminMissionLaunchDetailsRequest,adminMissionLaunchOrganiseRequest } from './newRequestHelpers';
import { adminAuthUserRegisterRequest, adminMissionCreateRequest } from './requestHelpers';
import { clearRequest } from './requestHelpers';
import { sampleUser1,sampleUser2,sampleMission1, sampleMission2,sampleLaunch1 } from './sampleTestData';

describe.skip('Need to write a description', () => {
  // some helpful functions you may use!
  let controlUserSessionId: string;
  let controlUserSessionId2: string;
  let launchId: number;
  let missionId: number;
  let missionId2: number;
  beforeEach(() => {
      // clear all the data
      const clearRes = clearRequest();
      expect(clearRes.statusCode).toBe(200);
      // register user1 successfully
      const registerRes = adminAuthUserRegisterRequest(
        sampleUser1.email,
        sampleUser1.password,
        sampleUser1.nameFirst,
        sampleUser1.nameLast
      );
      expect(registerRes.statusCode).toBe(200);
      controlUserSessionId = registerRes.body.controlUserSessionId;
      // register user2 successfully
      const registerRes2 = adminAuthUserRegisterRequest(
        sampleUser2.email,
        sampleUser2.password,
        sampleUser2.nameFirst,
        sampleUser2.nameLast
      );
      expect(registerRes2.statusCode).toBe(200);
      controlUserSessionId2 = registerRes2.body.controlUserSessionId;
      //create mission1
      const missioncreateRes=adminMissionCreateRequest(
        controlUserSessionId,
        sampleMission1.name,
        sampleMission1.description,
        sampleMission1.target
      );
      expect(missioncreateRes.statusCode).toBe(200);
      missionId = missioncreateRes.body.missionId;
      //create mission2
      const missioncreateRes2=adminMissionCreateRequest(
        controlUserSessionId2,
        sampleMission2.name,
        sampleMission2.description,
        sampleMission2.target
      );
      expect(missioncreateRes2.statusCode).toBe(200);
      missionId2 = missioncreateRes2.body.missionId;
      //create launch
    const launchcreateRes=adminMissionLaunchOrganiseRequest(
      controlUserSessionId,
      missionId,
      sampleLaunch1.payload,
      sampleLaunch1.launchParameters
    );
    expect(launchcreateRes.statusCode).toBe(200);
    launchId = launchcreateRes.body.launchId;
    });
    
  test('get details successfully', () => {
      const detailRes=adminMissionLaunchDetailsRequest(controlUserSessionId,missionId,launchId)
      expect(detailRes.statusCode).toBe(200);
      // in doubt
      expect(detailRes.body).toMatchObject({
        launchId: expect.any(Number),
        missionCopy: expect.objectContaining({
        missionId: expect.any(Number),
        }),
        state: expect.any(String),
      });
  });
  //check launchid
  test('launchid is invalid', () => {
    const detailRes=adminMissionLaunchDetailsRequest(controlUserSessionId,missionId,9999)
    expect(detailRes.statusCode).toBe(400);
    expect(detailRes.body).toStrictEqual({ error: expect.any(String)});
});
//check controlusersessionid
  const invalidsessionid = [
    { testcontrolUserSessionId: '' },
    { testcontrolUserSessionId: '9999' },
  ];
  test.each(invalidsessionid)('ControlUserSessionId is empty or invalid', ({testcontrolUserSessionId}) => {
    const detailRes=adminMissionLaunchDetailsRequest(testcontrolUserSessionId,missionId,launchId)
    expect(detailRes.statusCode).toBe(401);
    expect(detailRes.body).toStrictEqual({ error: expect.any(String)});
  });
  //check missionId 
  const invalidmissionid = [
    { testmissionId: '' as any},
    { testmissionId: 9999 },
  ];
  test.each(invalidmissionid)('MissionId is empty, invalid or not associated with the current controlUser', ({testmissionId}) => {
    const detailRes=adminMissionLaunchDetailsRequest(controlUserSessionId,testmissionId,launchId)
    expect(detailRes.statusCode).toBe(403);
    expect(detailRes.body).toStrictEqual({ error: expect.any(String)});
  });
  test('MissionId is not associated with the current controlUser', () => {
    const detailRes=adminMissionLaunchDetailsRequest(controlUserSessionId,missionId2,launchId)
    expect(detailRes.statusCode).toBe(403);
    expect(detailRes.body).toStrictEqual({ error: expect.any(String)});
  });
  
});
