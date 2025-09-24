// This file should contain your functions relating to:
// - adminAuth*
// - adminControlUser*

import { controlUserIdGen, isValidEmail, isValidPassword, isValidName, findUserByEmail, findUserById } from './helper.js';
import { getData } from './data.js';

// Register a mission control user
function adminAuthRegister(email, password, nameFirst, nameLast) {
  // Validate email format
  if (!isValidEmail(email)) {
    return { error: 'Invalid email format' };
  }

  // Validate password
  if (!isValidPassword(password)) {
    return { error: 'Password must be at least 8 characters long' };
  }

  // Validate first name
  if (!isValidName(nameFirst)) {
    return { error: 'Invalid first name' };
  }

  // Validate last name
  if (!isValidName(nameLast)) {
    return { error: 'Invalid last name' };
  }

  // Get current data
  const data = getData();

  // Check if email already exists
  const existingUser = data.missionControlUsers.find(user => user.email === email);
  if (existingUser) {
    return { error: 'Email already registered' };
  }

  // Create new user
  const controlUserId = controlUserIdGen();
  const newUser = {
    controlUserId,
    email,
    password,
    nameFirst: nameFirst.trim(),
    nameLast: nameLast.trim(),
    numSuccessfulLogins: 0,
    passwordHistory: [password],
  };

  data.missionControlUsers.push(newUser);

  return { controlUserId };
}

// Login a mission control user
function adminAuthLogin(email, password) {
  // Validate email format
  if (!isValidEmail(email)) {
    return { error: 'Invalid email format', errorCategory: 'BAD_INPUT' };
  }

  // Validate password is provided
  if (!password) {
    return { error: 'Password is required', errorCategory: 'BAD_INPUT' };
  }

  // Get current data
  const data = getData();

  // Find user by email
  const user = data.missionControlUsers.find(u => u.email === email);
  if (!user) {
    return { error: 'User not found', errorCategory: 'BAD_INPUT' };
  }

  // Check password
  if (user.password !== password) {
    user.numFailedPasswordsSinceLastLogin++;
    return { error: 'Incorrect password', errorCategory: 'BAD_INPUT' };
  }

  // Successful login
  user.numSuccessfulLogins++;
  user.numFailedPasswordsSinceLastLogin = 0;

  return { controlUserId: user.controlUserId };
}

function adminControlUserDetails(controlUserId){
  const data=getData();
  const user=data.missionControlUsers.find(a=>a.controlUserId===controlUserId);
  if(!user){
    return {error:'User not found'};
  }
  return{
    user:{
      controlUserId: user.controlUserId,
      name: `${user.nameFirst} ${user.nameLast}`,
      email: user.email,
      numSuccessfulLogins: user.numSuccessfulLogins,
      numFailedPasswordsSinceLastLogin: user.numFailedPasswordsSinceLastLogin,
    }
  };
}
function adminControlUserDetailsUpdate(controlUserId,email,nameFirst,nameLast){
  return{}
}
function adminControlUserPasswordUpdate(controlUserId,oldPassword,newPassword){
  const data = getData();
  const user = (data.missionControlUsers || []).find(u => u.controlUserId === controlUserId);
  if (!user) {
    return { error: 'invalid user', errorCategory: 'INVALID_CREDENTIALS' };
  }

  if (user.password !== oldPassword) {
    return { error: 'wrong old password', errorCategory: 'BAD_INPUT' };
  }

  if (oldPassword === newPassword) {
    return { error: 'same as old', errorCategory: 'BAD_INPUT' };
  }

  const strong =
    typeof newPassword === 'string' &&
    newPassword.length >= 8 &&
    /[A-Za-z]/.test(newPassword) &&
    /[0-9]/.test(newPassword);
  if (!strong) {
    return { error: 'weak password', errorCategory: 'BAD_INPUT' };
  }

  user.passwordHistory = user.passwordHistory || [user.password];
  if (user.passwordHistory.includes(newPassword)) {
    return { error: 'password reused', errorCategory: 'BAD_INPUT' };
  }

  user.password = newPassword;
  user.passwordHistory.push(newPassword);
  return {};
}


export {
  adminAuthRegister,
  adminAuthLogin,
  adminControlUserDetails,
  adminControlUserPasswordUpdate,
};

