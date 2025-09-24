import {adminMissionCreate,adminMissionNameUpdate} from '../mission.js';
import {adminAuthRegister } from '../auth.js';
import {missionNameValidity}from '../helper.js'
import { clear } from '../other.js';
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
    expect(result).toEqual({error:'controlUserId not found'});
  });
  test('No permission to modify due to invalid missionid',()=>{
    const {controlUserId}=adminAuthRegister("rosielover@gmail.com","a!b@AB1234","Kitty","Tan");
    const {missionId}=adminMissionCreate(controlUserId,"M plan","first task","Mars");
    const name=missionNameValidity("E plan");
    const result=adminMissionNameUpdate(controlUserId,999,name);
    expect(result).toEqual({error:'missionId not found'});
  });
  test('userID is not integer', () => {
    const result = adminMissionNameUpdate(1.1,1,"E plan");
    expect(result).toEqual({ error: 'controlUserId must be integer' });
  });
  test('missionID is not integer', () => {
    const {controlUserId} = adminAuthRegister("rosielover@gmail.com","a!b@AB1234","Kitty","Tan");
    const result = adminMissionNameUpdate(controlUserId,1.1,"E plan");
    expect(result).toEqual({ error: 'missionId must be integer' });
  });
})