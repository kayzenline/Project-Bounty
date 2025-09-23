import {adminMissionRemove,adminMissionCreate,} from '../mission.js';
import {adminAuthRegister } from '../auth.js';
import { clear } from '../other.js';
//remove successfully
  describe('adminMissionRemove', () => {
    beforeEach(() => {
      clear();
    });
    test('remove successfully',()=>{
      const {controlUserId}=adminAuthRegister("rosielover@gmail.com","a!b@AB1234","Kitty","Tan");
      const {missionId}=adminMissionCreate(controlUserId,"M plan","first task","Mars");
      const result=adminMissionRemove(controlUserId,missionId);
      expect(result).toEqual({});
    });
    //remove failed
    test('remove failed-invalid userId',()=>{
      const {controlUserId}=adminAuthRegister("rosielover@gmail.com","a!b@AB1234","Kitty","Tan");
      const {missionId}=adminMissionCreate(controlUserId,"M plan","first task","Mars");
      const result=adminMissionRemove(999,missionId);
      expect(result).toEqual({error:'controlUserId not found'});
    });
    test('remove failed-Invalid missionid',()=>{
      const {controlUserId}=adminAuthRegister("rosielover@gmail.com","a!b@AB1234","Kitty","Tan");
      const {missionId}=adminMissionCreate(controlUserId,"M plan","first task","Mars");
      const result=adminMissionRemove(controlUserId,999);
      expect(result).toEqual({error:'missionId not found'});
    });
    //mission invalid
    test('mission has been deleted', () => {
      const {controlUserId} = adminAuthRegister("rosielover@gmail.com","a!b@AB1234","Kitty","Tan");
      const { missionId } = adminMissionCreate(controlUserId,"M plan","first task","Mars");
      adminMissionRemove(controlUserId, missionId);
      const result = adminMissionRemove(controlUserId, missionId);
      expect(result).toEqual({ error: 'missionId not found' });
    });
    //userid is not int
    test('userID is not integer', () => {
      const result = adminMissionRemove(1.1,1);
      expect(result).toEqual({ error: 'controlUserId must be integer' });
    });
    //missionid is not int
    test('missionID is not integer', () => {
      const {controlUserId} = adminAuthRegister("rosielover@gmail.com","a!b@AB1234","Kitty","Tan");
      const result = adminMissionRemove(controlUserId,1.1);
      expect(result).toEqual({ error: 'missionId must be integer' });
    });
    });
    