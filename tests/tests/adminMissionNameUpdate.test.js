import {adminMissionCreate,adminMissionNameUpdate} from '../../src/mission.js';
import {adminAuthRegister } from '../../src/auth.js';
import {missionNameValidity}from '../../src/helper.js'
import { clear } from '../../src/other.js';
describe('adminMissionNameUpdate',()=>{
  beforeEach(() => {
    clear();
  });
  test('NameUpdateSuccessfully',()=>{
    const {controlUserId}=adminAuthRegister("rosielover@gmail.com","a!b@AB1234","Kitty","Tan");
    const {missionId}=adminMissionCreate(controlUserId,"M plan","first task","Mars");
    const name=missionNameValidity("E plan");
    const result=adminMissionNameUpdate(controlUserId,missionId,name);
    expect(result).toEqual({});
  });
  test('No permission to modify due to invalid userid',()=>{
    const {controlUserId}=adminAuthRegister("rosielover@gmail.com","a!b@AB1234","Kitty","Tan");
    const {missionId}=adminMissionCreate(controlUserId,"M plan","first task","Mars");
    const name=missionNameValidity("E plan");
    const result=adminMissionNameUpdate(999,missionId,name);
    expect(result).toEqual({error:'controlUserId not found',errorCategory: 'INVALID_CREDENTIALS'});//problem  with idcheck errorCategory
  });
  test('No permission to modify due to invalid missionid',()=>{
    const {controlUserId}=adminAuthRegister("rosielover@gmail.com","a!b@AB1234","Kitty","Tan");
    const {missionId}=adminMissionCreate(controlUserId,"M plan","first task","Mars");
    const name=missionNameValidity("E plan");
    const result=adminMissionNameUpdate(controlUserId,999,name);
    expect(result).toEqual({error:'missionId not found',errorCategory: 'INACCESSIBLE_VALUE'});
  });
  test('userID is not integer', () => {
    const result = adminMissionNameUpdate(1.1,1,"E plan");
    expect(result).toEqual({ error: 'controlUserId must be integer' ,errorCategory: 'BAD_INPUT'});
  });
  test('missionID is not integer', () => {
    const {controlUserId} = adminAuthRegister("rosielover@gmail.com","a!b@AB1234","Kitty","Tan");
    const result = adminMissionNameUpdate(controlUserId,1.1,"E plan");
    expect(result).toEqual({ error: 'missionId must be integer' ,errorCategory: 'BAD_INPUT'});
  });
  test('No permission to modify due to mission not owned by user', () => {
    const { controlUserId: user1 } = adminAuthRegister("rosielover@gmail.com","a!b@AB1234","Kitty","Tan");
    const { controlUserId: user2 } = adminAuthRegister("pcyyy@gmail.com","x!y@XY5678","jisoo","Kim");
    const { missionId } = adminMissionCreate(user1, "M plan", "first task", "Mars"); 
    const name = missionNameValidity("E plan");
    const result = adminMissionNameUpdate(user2, missionId, name); 
    expect(result).toEqual({
      error: 'Mission does not belong to this user',
      errorCategory: 'INACCESSIBLE_VALUE'
    });
  });
  
})