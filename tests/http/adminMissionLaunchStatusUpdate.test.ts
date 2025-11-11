import {
  adminLaunchVehicleCreateRequest,
  adminMissionLaunchStatusUpdateRequest,
  adminMissionLaunchDetailsRequest,
  adminMissionLaunchOrganiseRequest,
  adminMissionAstronautLaunchAllocateRequest
} from './newRequestHelpers';
import { 
  adminAuthUserRegisterRequest,
  adminMissionCreateRequest,
  adminAstronautCreateRequest,
  adminAstronautAssignRequest ,
} from './requestHelpers';
import { clearRequest } from './requestHelpers';
import { 
  sampleUser1,
  sampleUser2,
  sampleMission1, 
  sampleMission2,
  samplePayload1,
  sampleLaunchParameters1,
  sampleAstronaut,
  sampleLaunchVehicle1,
} from './sampleTestData';
import{ missionLaunchAction,missionLaunchState }from '../../src/dataStore'
import{ updateLaunchState } from'../../src/logic/updateSessionState'
describe.skip('Need to write a description', () => {
  // some helpful functions you may use!
  let controlUserSessionId: string;
  let controlUserSessionId2: string;
  let launchId: number;
  let missionId: number;
  let missionId2: number;
  let astronautId:number;
  let launchVehicleId:number;
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
    // create LaunchVehicle
    const launchvehicle=adminLaunchVehicleCreateRequest(
      controlUserSessionId,
      sampleLaunchVehicle1.name,
      sampleLaunchVehicle1.description,
      sampleLaunchVehicle1.maxCrewWeight,
      sampleLaunchVehicle1.maxPayloadWeight,
      sampleLaunchVehicle1.launchVehicleWeight,
      sampleLaunchVehicle1.thrustCapacity,
      sampleLaunchVehicle1.maneuveringFuel
    )
    expect(launchvehicle.statusCode).toBe(200);
    launchVehicleId = launchvehicle.body.launchVehicleId;
    // create Astronaut
    const astronautRes=adminAstronautCreateRequest(
      controlUserSessionId,
      sampleAstronaut.nameFirst,
      sampleAstronaut.nameLast,
      sampleAstronaut.rank,
      sampleAstronaut.age,
      sampleAstronaut.weight,
      sampleAstronaut.height
    )
    expect(astronautRes.statusCode).toBe(200);
    astronautId = astronautRes.body.astronautId;
    //AstronautAssign
    const astronautassignRes=adminAstronautAssignRequest(
      controlUserSessionId,
      astronautId,
      missionId,
    )
    expect(astronautassignRes.statusCode).toBe(200);
    //create launch
    const launchcreateRes=adminMissionLaunchOrganiseRequest(
      controlUserSessionId,
      missionId,
      launchVehicleId,
      samplePayload1,
      sampleLaunchParameters1
    );
    expect(launchcreateRes.statusCode).toBe(200);
    launchId = launchcreateRes.body.launchId;
    //AstronautAllocate
    const astronautallocateRes=adminMissionAstronautLaunchAllocateRequest(
      controlUserSessionId,
      astronautId,
      missionId,
      launchId
    )
    expect(astronautallocateRes.statusCode).toBe(200);
    });
   
  test('Update launch status successfully', () => {
    // problem
    const statusupdateRes= adminMissionLaunchStatusUpdateRequest( controlUserSessionId,missionId,launchId,'LIFTOFF');
    expect(statusupdateRes.statusCode).toBe(200);
    expect(statusupdateRes.body).toStrictEqual({})
  });

  test('expect LAUNCHING', () => {
    const launchDetails = adminMissionLaunchDetailsRequest(controlUserSessionId, missionId, launchId);
    expect(launchDetails.body.state).toBe(missionLaunchState.READY_TO_LAUNCH);
    const statusupdateRes=adminMissionLaunchStatusUpdateRequest(controlUserSessionId,missionId,launchId,'LIFTOFF')
    expect(statusupdateRes.statusCode).toBe(200);
    expect(statusupdateRes.body).toStrictEqual({});
    //check again
    const launchDetail2 = adminMissionLaunchDetailsRequest(controlUserSessionId, missionId, launchId);
    expect(launchDetail2.body.state).toBe(missionLaunchState.LAUNCHING);
});
  
    test('wait 3; expect MANEUVERING', () => {
      const actionChain = [
        { action: 'LIFTOFF', expectedState: 'LAUNCHING' },
        { action: 'WAIT_3', expectedState: 'MANEUVERING' },
      ]; 
      for (const step of actionChain) {
        if (step.action.startsWith('WAIT')) {
          updateLaunchState(missionLaunchAction.SKIP_WAITING, launchId);
        } else {
          const res = adminMissionLaunchStatusUpdateRequest(controlUserSessionId, missionId, launchId, step.action);
          expect(res.statusCode).toBe(200);
          expect(res.body).toStrictEqual({});
        }
        const detail = adminMissionLaunchDetailsRequest(controlUserSessionId, missionId, launchId);
        expect(detail.body.state).toBe(step.expectedState);
      }
    });

    test('wait 3, CORRECTION; expect LAUNCHING',() => {
      const actionChain = [
        { action: 'LIFTOFF', expectedState: 'LAUNCHING' },
        { action: 'WAIT_3', expectedState: 'MANEUVERING' },
        { action: 'CORRECTION', expectedState: 'LAUNCHING' },
      ]; 
      for (const step of actionChain) {
        if (step.action.startsWith('WAIT')) {
          updateLaunchState(missionLaunchAction.SKIP_WAITING, launchId);
        } else {
          const res = adminMissionLaunchStatusUpdateRequest(controlUserSessionId, missionId, launchId, step.action);
          expect(res.statusCode).toBe(200);
          expect(res.body).toStrictEqual({});
        }
        const detail = adminMissionLaunchDetailsRequest(controlUserSessionId, missionId, launchId);
        expect(detail.body.state).toBe(step.expectedState);
      }
    });
    
    test('wait 3, CORRECTION, wait 3; expect MANEUVERING', () => {
      const actionChain = [
        { action: 'LIFTOFF', expectedState: 'LAUNCHING' },
        { action: 'WAIT_3', expectedState: 'MANEUVERING' },
        { action: 'CORRECTION', expectedState: 'LAUNCHING' },
        { action: 'WAIT_3', expectedState: 'MANEUVERING' },
      ]; 
      for (const step of actionChain) {
        if (step.action.startsWith('WAIT')) {
          updateLaunchState(missionLaunchAction.SKIP_WAITING, launchId);
        } else {
          const res = adminMissionLaunchStatusUpdateRequest(controlUserSessionId, missionId, launchId, step.action);
          expect(res.statusCode).toBe(200);
          expect(res.body).toStrictEqual({});
        }
        const detail = adminMissionLaunchDetailsRequest(controlUserSessionId, missionId, launchId);
        expect(detail.body.state).toBe(step.expectedState);
      }
    });
    test('wait 3, wait delay 2; expect COASTING', () => {
      const actionChain = [
        { action: 'LIFTOFF', expectedState: 'LAUNCHING' },
        { action: 'WAIT_3', expectedState: 'MANEUVERING' },
        { action: 'Delay_2', expectedState: 'COASTING' },
      ]; 
      for (const step of actionChain) {
        if (step.action.startsWith('WAIT')) {
          updateLaunchState(missionLaunchAction.SKIP_WAITING, launchId);
        }else if(step.action.startsWith('Delay')){
          updateLaunchState(missionLaunchAction.FIRE_THRUSTERS, launchId);
        }
          else {
          const res = adminMissionLaunchStatusUpdateRequest(controlUserSessionId, missionId, launchId, step.action);
          expect(res.statusCode).toBe(200);
          expect(res.body).toStrictEqual({});
        }
        const detail = adminMissionLaunchDetailsRequest(controlUserSessionId, missionId, launchId);
        expect(detail.body.state).toBe(step.expectedState);
      }
    });
    test('wait 3, FIRE_THRUSTERS; expect COASTING', () => {
      const actionChain = [
        { action: 'LIFTOFF', expectedState: 'LAUNCHING' },
        { action: 'WAIT_3', expectedState: 'MANEUVERING' },
        { action: 'FIRE_THRUSTERS', expectedState: 'COASTING' },
      ]; 
      for (const step of actionChain) {
        if (step.action.startsWith('WAIT')) {
          updateLaunchState(missionLaunchAction.SKIP_WAITING, launchId);
        } else {
          const res = adminMissionLaunchStatusUpdateRequest(controlUserSessionId, missionId, launchId, step.action);
          expect(res.statusCode).toBe(200);
          expect(res.body).toStrictEqual({});
        }
        const detail = adminMissionLaunchDetailsRequest(controlUserSessionId, missionId, launchId);
        expect(detail.body.state).toBe(step.expectedState);
      }
    });
    test('wait 3, FIRE_THRUSTERS, DEPLOY_PAYLOAD; expect MISSION_COMPLETE', () => {
      const actionChain = [
        { action: 'LIFTOFF', expectedState: 'LAUNCHING' },
        { action: 'WAIT_3', expectedState: 'MANEUVERING' },
        { action: 'FIRE_THRUSTERS', expectedState: 'COASTING' },
        { action: 'DEPLOY_PAYLOAD', expectedState: 'MISSION_COMPLETE' }
      ]; 
      for (const step of actionChain) {
        if (step.action.startsWith('WAIT')) {
          updateLaunchState(missionLaunchAction.SKIP_WAITING, launchId);
        } else {
          const res = adminMissionLaunchStatusUpdateRequest(controlUserSessionId, missionId, launchId, step.action);
          expect(res.statusCode).toBe(200);
          expect(res.body).toStrictEqual({});
        }
        const detail = adminMissionLaunchDetailsRequest(controlUserSessionId, missionId, launchId);
        expect(detail.body.state).toBe(step.expectedState);
      }
    });
    test('wait 3, FIRE_THRUSTERS, DEPLOY_PAYLOAD, GO_HOME; expect RE_ENTRY', () => {
      const actionChain = [
        { action: 'LIFTOFF', expectedState: 'LAUNCHING' },
        { action: 'WAIT_3', expectedState: 'MANEUVERING' },
        { action: 'FIRE_THRUSTERS', expectedState: 'COASTING' },
        { action: 'DEPLOY_PAYLOAD', expectedState: 'MISSION_COMPLETE' },
        { action: 'GO_HOME', expectedState: 'REENTRY' }
      ]; 
      for (const step of actionChain) {
        if (step.action.startsWith('WAIT')) {
          updateLaunchState(missionLaunchAction.SKIP_WAITING, launchId);
        } else {
          const res = adminMissionLaunchStatusUpdateRequest(controlUserSessionId, missionId, launchId, step.action);
          expect(res.statusCode).toBe(200);
          expect(res.body).toStrictEqual({});
        }
        const detail = adminMissionLaunchDetailsRequest(controlUserSessionId, missionId, launchId);
        expect(detail.body.state).toBe(step.expectedState);
      }
    });
    test('wait 3, FIRE_THRUSTERS, DEPLOY_PAYLOAD, GO_HOME, RETURN; expect ON_EARTH', () => {
      const actionChain = [
        { action: 'LIFTOFF', expectedState: 'LAUNCHING' },
        { action: 'WAIT_3', expectedState: 'MANEUVERING' },
        { action: 'FIRE_THRUSTERS', expectedState: 'COASTING' },
        { action: 'DEPLOY_PAYLOAD', expectedState: 'MISSION_COMPLETE' },
        { action: 'GO_HOME', expectedState: 'REENTRY' },
        { action: 'RETURN', expectedState: 'ON_EARTH' }
      ]; 
      for (const step of actionChain) {
        if (step.action.startsWith('WAIT')) {
          updateLaunchState(missionLaunchAction.SKIP_WAITING, launchId);
        } else {
          const res = adminMissionLaunchStatusUpdateRequest(controlUserSessionId, missionId, launchId, step.action);
          expect(res.statusCode).toBe(200);
          expect(res.body).toStrictEqual({});
        }
        const detail = adminMissionLaunchDetailsRequest(controlUserSessionId, missionId, launchId);
        expect(detail.body.state).toBe(step.expectedState);
      }
    });
    test('Launch READY_TO_LAUNCH with action chain FAULT; expect ON_EARTH', () => {
      const launchDetails = adminMissionLaunchDetailsRequest(controlUserSessionId, missionId, launchId);
      expect(launchDetails.body.state).toBe(missionLaunchState.READY_TO_LAUNCH);
      const statusupdateRes=adminMissionLaunchStatusUpdateRequest(controlUserSessionId,missionId,launchId,'FAULT')
      expect(statusupdateRes.statusCode).toBe(200);
      expect(statusupdateRes.body).toStrictEqual({});
      //check again
      const launchDetail2 = adminMissionLaunchDetailsRequest(controlUserSessionId, missionId, launchId);
      expect(launchDetail2.body.state).toBe(missionLaunchState.ON_EARTH);
  });
  test('Launch READY_TO_LAUNCH with action chain LIFTOFF, FAULT, RETURN; expect ON_EARTH', () => {
    const actionChain = [
      { action: 'LIFTOFF', expectedState: 'LAUNCHING' },
      { action: 'FAULT', expectedState: 'REENTRY' },//problem
      { action: 'RETURN', expectedState: 'ON_EARTH' }
    ]; 
    for (const step of actionChain) {
        const res = adminMissionLaunchStatusUpdateRequest(controlUserSessionId, missionId, launchId, step.action);
        expect(res.statusCode).toBe(200);
        expect(res.body).toStrictEqual({});
        const detail = adminMissionLaunchDetailsRequest(controlUserSessionId, missionId, launchId);
        expect(detail.body.state).toBe(step.expectedState);
    }
  });
  test('Launch READY_TO_LAUNCH with action chain LIFTOFF, wait 3, FAULT, RETURN; expect ON_EARTH', () => {
    const actionChain = [
      { action: 'LIFTOFF', expectedState: 'LAUNCHING' },
      { action: 'WAIT_3', expectedState: 'MANEUVERING' },
      { action: 'FAULT', expectedState: 'REENTRY' },//problem
      { action: 'RETURN', expectedState: 'ON_EARTH' }
    ]; 
    for (const step of actionChain) {
      if (step.action.startsWith('WAIT')) {
        updateLaunchState(missionLaunchAction.SKIP_WAITING, launchId);
      } else {
        const res = adminMissionLaunchStatusUpdateRequest(controlUserSessionId, missionId, launchId, step.action);
        expect(res.statusCode).toBe(200);
        expect(res.body).toStrictEqual({});
      }
      const detail = adminMissionLaunchDetailsRequest(controlUserSessionId, missionId, launchId);
      expect(detail.body.state).toBe(step.expectedState);
    }
  });
  test('Launch READY_TO_LAUNCH with action chain LIFTOFF, wait 3, FIRE_THRUSTERS, FAULT, RETURN; expect ON_EARTH', () => {
    const actionChain = [
      { action: 'LIFTOFF', expectedState: 'LAUNCHING' },
      { action: 'WAIT_3', expectedState: 'MANEUVERING' },
      { action: 'FIRE_THRUSTERS', expectedState: 'COASTING' },
      { action: 'FAULT', expectedState: 'REENTRY' },//problem
      { action: 'RETURN', expectedState: 'ON_EARTH' }
    ]; 
    for (const step of actionChain) {
      if (step.action.startsWith('WAIT')) {
        updateLaunchState(missionLaunchAction.SKIP_WAITING, launchId);
      } else {
        const res = adminMissionLaunchStatusUpdateRequest(controlUserSessionId, missionId, launchId, step.action);
        expect(res.statusCode).toBe(200);
        expect(res.body).toStrictEqual({});
      }
      const detail = adminMissionLaunchDetailsRequest(controlUserSessionId, missionId, launchId);
      expect(detail.body.state).toBe(step.expectedState);
    }
  });
  //check controlusersessionid
  const invalidsessionid = [
    { testcontrolUserSessionId: '' },
    { testcontrolUserSessionId: '9999' },
  ];
  test.each(invalidsessionid)('ControlUserSessionId is empty or invalid', ({testcontrolUserSessionId}) => {
    const detailRes=adminMissionLaunchDetailsRequest(testcontrolUserSessionId,missionId,launchId)
    expect(detailRes.statusCode).toBe(401);
    expect(detailRes.body).toStrictEqual({error:expect.any(String)});
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
  //check launchId 
  const invalidlaunchid = [
    { testlaunchId: '' as any},
    { testlaunchId: 9999 },
  ];
  test.each(invalidlaunchid)('LaunchId is empty, invalid or not associated with the current controlUser', ({testlaunchId}) => {
    const detailRes=adminMissionLaunchDetailsRequest(controlUserSessionId,missionId,testlaunchId)
    expect(detailRes.statusCode).toBe(403);
    expect(detailRes.body).toStrictEqual({ error: expect.any(String)});
  });
  
   //invalid action
   const invalidactions1=[
      {testaction: 'CORRECTION'},
      {testaction:'FIRE_THRUSTERS'},
      {testaction:'DEPLOY_PAYLOAD'},
      {testaction:'GO_HOME'},
      {testaction:'FAULT'},
      {testaction:'RETURN'},
   ]
    test.each(invalidactions1)('Launch READY_TO_LAUNCH with invalid actions', (testaction) => {
      const launchDetails = adminMissionLaunchDetailsRequest(controlUserSessionId, missionId, launchId);
      expect(launchDetails.body.state).toBe(missionLaunchState.READY_TO_LAUNCH);
      const statusupdateRes=adminMissionLaunchStatusUpdateRequest(controlUserSessionId,missionId,launchId,testaction.testaction)
      expect(statusupdateRes.statusCode).toBe(400);
      expect(statusupdateRes.body).toStrictEqual({ error: expect.any(String)});
  });
  const invalidactions2=[
    {testaction: 'LIFTOFF'},
    {testaction:'CORRECTION'},
    {testaction:'DEPLOY_PAYLOAD'},
    {testaction:'GO_HOME'},
    {testaction:'SKIP_WAITING'},
 ]
  test.each(invalidactions2)('Launch LAUNCHING with invalid actions', (testaction) => {
    adminMissionLaunchStatusUpdateRequest(controlUserSessionId, missionId, launchId, 'LIFTOFF');
    const launchDetails = adminMissionLaunchDetailsRequest(controlUserSessionId, missionId, launchId);
    expect(launchDetails.body.state).toBe(missionLaunchState.LAUNCHING);
    const statusupdateRes=adminMissionLaunchStatusUpdateRequest(controlUserSessionId,missionId,launchId,testaction.testaction)
    expect(statusupdateRes.statusCode).toBe(400);
    expect(statusupdateRes.body).toStrictEqual({ error: expect.any(String)});
});
  const invalidactions3=[
    {testaction: 'LIFTOFF'},
    {testaction:'FIRE_THRUSTERS'},
    {testaction:'GO_HOME'},
    {testaction:'RETURN'},
    {testaction:'SKIP_WAITING'},
  ]
  test.each(invalidactions3)('Launch MANEUVERING with invalid actions', (testaction) => {
    adminMissionLaunchStatusUpdateRequest(controlUserSessionId, missionId, launchId, 'LIFTOFF');
    updateLaunchState(missionLaunchAction.SKIP_WAITING, launchId);
    const launchDetails = adminMissionLaunchDetailsRequest(controlUserSessionId, missionId, launchId);
    expect(launchDetails.body.state).toBe(missionLaunchState.MANEUVERING);
    const statusupdateRes=adminMissionLaunchStatusUpdateRequest(controlUserSessionId,missionId,launchId,testaction.testaction)
    expect(statusupdateRes.statusCode).toBe(400);
    expect(statusupdateRes.body).toStrictEqual({ error: expect.any(String)});
  });
  const invalidactions4=[
    {testaction: 'LIFTOFF'},
    {testaction:'CORRECTION'},
    {testaction:'FIRE_THRUSTERS'},
    {testaction:'DEPLOY_PAYLOAD'},
    {testaction:'GO_HOME'},
    {testaction:'SKIP_WAITING'},
  ]
  test.each(invalidactions4)('Launch COASTING with invalid actions', (testaction) => {
    adminMissionLaunchStatusUpdateRequest(controlUserSessionId, missionId, launchId, 'LIFTOFF');
    //wait3s
    updateLaunchState(missionLaunchAction.SKIP_WAITING, launchId);
    //delay 2s
    updateLaunchState(missionLaunchAction.FIRE_THRUSTERS, launchId);
    const launchDetails = adminMissionLaunchDetailsRequest(controlUserSessionId, missionId, launchId);
    expect(launchDetails.body.state).toBe(missionLaunchState.COASTING);
    const statusupdateRes=adminMissionLaunchStatusUpdateRequest(controlUserSessionId,missionId,launchId,testaction.testaction)
    expect(statusupdateRes.statusCode).toBe(400);
    expect(statusupdateRes.body).toStrictEqual({ error: expect.any(String)});
  });
  const invalidactions5=[
    {testaction: 'LIFTOFF'},
    {testaction:'CORRECTION'},
    {testaction:'FIRE_THRUSTERS'},
    {testaction:'DEPLOY_PAYLOAD'},
    {testaction:'FAULT'},
    {testaction:'RETURN'},
    {testaction:'SKIP_WAITING'},
  ]
  test.each(invalidactions5)('Launch MISSION_COMPLETE with invalid actions', (testaction) => {
    adminMissionLaunchStatusUpdateRequest(controlUserSessionId, missionId, launchId, 'LIFTOFF');
    //wait3s
    updateLaunchState(missionLaunchAction.SKIP_WAITING, launchId);
    //delay 2s
    updateLaunchState(missionLaunchAction.FIRE_THRUSTERS, launchId);
    adminMissionLaunchStatusUpdateRequest(controlUserSessionId, missionId, launchId, 'FIRE_THRUSTERS');
    adminMissionLaunchStatusUpdateRequest(controlUserSessionId, missionId, launchId, 'DEPLOY_PAYLOAD');
    const launchDetails = adminMissionLaunchDetailsRequest(controlUserSessionId, missionId, launchId);
    expect(launchDetails.body.state).toBe(missionLaunchState.MISSION_COMPLETE);
    const statusupdateRes=adminMissionLaunchStatusUpdateRequest(controlUserSessionId,missionId,launchId,testaction.testaction)
    expect(statusupdateRes.statusCode).toBe(400);
    expect(statusupdateRes.body).toStrictEqual({ error: expect.any(String)});
  });
  const invalidactions6=[
    {testaction: 'LIFTOFF'},
    {testaction:'CORRECTION'},
    {testaction:'FIRE_THRUSTERS'},
    {testaction:'DEPLOY_PAYLOAD'},
    {testaction:'GO_HOME'},
    {testaction:'FAULT'},
    {testaction:'SKIP_WAITING'},
  ]
  test.each(invalidactions6)('Launch RE_ENTRY with invalid actions', (testaction) => {
    adminMissionLaunchStatusUpdateRequest(controlUserSessionId, missionId, launchId, 'LIFTOFF');
    //wait3s
    updateLaunchState(missionLaunchAction.SKIP_WAITING, launchId);
    //delay 2s
    updateLaunchState(missionLaunchAction.FIRE_THRUSTERS, launchId);
    adminMissionLaunchStatusUpdateRequest(controlUserSessionId, missionId, launchId, 'FIRE_THRUSTERS');
    adminMissionLaunchStatusUpdateRequest(controlUserSessionId, missionId, launchId, 'DEPLOY_PAYLOAD');
    adminMissionLaunchStatusUpdateRequest(controlUserSessionId, missionId, launchId, 'GO_HOME');
    const launchDetails = adminMissionLaunchDetailsRequest(controlUserSessionId, missionId, launchId);
    expect(launchDetails.body.state).toBe(missionLaunchState.REENTRY);
    const statusupdateRes=adminMissionLaunchStatusUpdateRequest(controlUserSessionId,missionId,launchId,testaction.testaction)
    expect(statusupdateRes.statusCode).toBe(400);
    expect(statusupdateRes.body).toStrictEqual({ error: expect.any(String)});
  });
  //bad launch parameters
    test('A LIFTOFF action has been attempted with bad launch parameters ', () => {
      //problem: bad parameters
      const createRes=adminMissionLaunchOrganiseRequest(
        controlUserSessionId,
        missionId,
        launchVehicleId,
        {
          description: 'bad parameters',
          weight: 400
        },
        {
          "targetDistance": 0,
          "fuelBurnRate": 0,
          "thrustFuel": 0,
          "activeGravityForce": 9.8,
          "maneuveringDelay": 0
        }
      )
      const badlaunchId=createRes.body.launchId;
      const statusupdateRes=adminMissionLaunchStatusUpdateRequest(controlUserSessionId,missionId,badlaunchId,'LIFTOFF');
      expect(statusupdateRes.statusCode).toBe(400);
      expect(statusupdateRes.body.error).toEqual(expect.any(String));
      const detail = adminMissionLaunchDetailsRequest(controlUserSessionId, missionId, badlaunchId);
      expect(detail.body.state).toBe(missionLaunchState.ON_EARTH);
});
    //invalid action
    test('A CORRECTION action been attempted with insufficient fuel available ', () => {
      //insufficient fuel available
      const createRes=adminMissionLaunchOrganiseRequest(
        controlUserSessionId,
        missionId,
        launchVehicleId,
        {
          description: 'insufficient fuel available',
          weight: 400
        },
        {
          "targetDistance": 12000,
          "fuelBurnRate": 20,
          "thrustFuel": 1,
          "activeGravityForce": 9.8,
          "maneuveringDelay": 2
        }
      )
      const badlaunchId=createRes.body.launchId;
      const liftoffRes=adminMissionLaunchStatusUpdateRequest(controlUserSessionId,missionId,badlaunchId,'LIFTOFF')
      expect(liftoffRes.statusCode).toBe(200);
      const statusupdateRes=adminMissionLaunchStatusUpdateRequest(controlUserSessionId,missionId,badlaunchId,'CORRECTION')
      expect(statusupdateRes.statusCode).toBe(400);
      expect(statusupdateRes.body.error).toEqual(expect.any(String));
      const detail = adminMissionLaunchDetailsRequest(controlUserSessionId, missionId, badlaunchId);
      expect(detail.body.state).toBe(missionLaunchState.REENTRY);
  });
  test('A FIRE_THRUSTERS action been attempted with insufficient fuel available ', () => {
    //insufficient fuel available
    const createRes=adminMissionLaunchOrganiseRequest(
      controlUserSessionId,
      missionId,
      launchVehicleId,
      {
        description: 'insufficient fuel available',
        weight: 400
      },
      {
        "targetDistance": 12000,
        "fuelBurnRate": 20,
        "thrustFuel": 1,
        "activeGravityForce": 9.8,
        "maneuveringDelay": 2
      }
    )
    const badlaunchId=createRes.body.launchId;
    const liftoffRes=adminMissionLaunchStatusUpdateRequest(controlUserSessionId,missionId,badlaunchId,'LIFTOFF')
    expect(liftoffRes.statusCode).toBe(200);
    const statusupdateRes=adminMissionLaunchStatusUpdateRequest(controlUserSessionId,missionId,badlaunchId,'FIRE_THRUSTERS')
    expect(statusupdateRes.statusCode).toBe(400);
    expect(statusupdateRes.body.error).toEqual(expect.any(String));
    const detail = adminMissionLaunchDetailsRequest(controlUserSessionId, missionId, badlaunchId);
    expect(detail.body.state).toBe(missionLaunchState.REENTRY);
});
  
})
