// This file should contain your functions relating to:
// - adminAuth*
// - adminControlUser*
function adminControlUserDetails(controlUserId){
  return{
    user:{
      controlUserId: 1,
      name: 'Bill Ryker',
      email: 'strongbeard@starfleet.com.au',
      numSuccessfulLogins: 3,
      numFailedPasswordsSinceLastLogin: 1,
    }
  }
}
function adminControlUserDetailsUpdate(controlUserId,email,nameFirst,nameLast){
  return{}
}
function adminControlUserPasswordUpdate(controlUserId,oldPassword,newPassword){
  return{}
}
