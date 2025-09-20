import { adminAuthLogin,adminAuthRegister,adminControlUserDetails} from '../auth.js';
import { clear } from '../data.js';
describe('adminControlUserDetails', () => {
  beforeEach(() => {
    clear();
  });
    test('check function return correct object',()=>{
      const result=adminAuthRegister("rosielover@gmail.com","a!b@AB1234","Kitty","Tan");
      //adminAuthRegister return {controluserid}
      const userid=result.controlUserId;
      const userdetails=adminControlUserDetails(userid);//return{user:{}}
      expect(result.controlUserId).toEqual(userid);
      expect(userdetails.user.name).toEqual('Kitty Tan');
      expect(userdetails.user.email).toEqual('rosielover@gmail.com');
      expect(userdetails.user.numSuccessfulLogins).toEqual(0);
      expect(userdetails.user.numFailedPasswordsSinceLastLogin).toEqual(0);
    });
    test('function return error',()=>{
      const invalidId = 1234; 
      const details = adminControlUserDetails(invalidId);
      expect(details).toHaveProperty('error');
      expect(details.error).toBe('User not found');
    });
  });


