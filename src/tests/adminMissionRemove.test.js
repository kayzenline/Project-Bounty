import {adminMissionRemove,adminMissionCreate,} from '../mission.js';
import {adminAuthRegister } from '../auth.js';
import { clear } from '../other.js';
//remove successfully
  describe('adminMissionRemove', () => {
    beforeEach(() => {
      clear();
    });
    test('remove successfully',()=>{
      const {userid}=adminAuthRegister("rosielover@gmail.com","a!b@AB1234","Kitty","Tan");
      const {missionid}=adminMissionCreate(userid,"M plan","first task","Mars");
      const result=adminMissionRemove(userid,missionid);
      expect(result).toEqual({});
    });
    //remove failed
    test('remove failed-invalid userId',()=>{
      const {userid}=adminAuthRegister("rosielover@gmail.com","a!b@AB1234","Kitty","Tan");
      const {missionid}=adminMissionCreate(userid,"M plan","first task","Mars");
      const result=adminMissionRemove(-1,missionid);
      expect(result).toEqual({error:'Invalid userId'});
    });
    test('remove failed-Invalid missionid',()=>{
      const {userid}=adminAuthRegister("rosielover@gmail.com","a!b@AB1234","Kitty","Tan");
      const {missionid}=adminMissionCreate(userid,"M plan","first task","Mars");
      const result=adminMissionRemove(userid,-1);
      expect(result).toEqual({error:'Invalid missionId'});
    });
    //mission invalid
    test('mission has been deleted', () => {
      const { userid } = adminAuthRegister("rosielover@gmail.com","a!b@AB1234","Kitty","Tan");
      const { missionid } = adminMissionCreate(userid,"M plan","first task","Mars");
      adminMissionRemove(userid, missionid);
      const result = adminMissionRemove(userid, missionid);
      expect(result).toEqual({ error: 'Mission not found' });
    });
    });
    