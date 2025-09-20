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
    numFailedPasswordsSinceLastLogin: 0
  };

  data.missionControlUsers.push(newUser);

  return { controlUserId };
}

// Login a mission control user
function adminAuthLogin(email, password) {
  // Validate email format
  if (!isValidEmail(email)) {
    return { error: 'Invalid email format' };
  }

  // Validate password is provided
  if (!password) {
    return { error: 'Password is required' };
  }

  // Get current data
  const data = getData();

  // Find user by email
  const user = data.missionControlUsers.find(u => u.email === email);
  if (!user) {
    return { error: 'User not found' };
  }

  // Check password
  if (user.password !== password) {
    user.numFailedPasswordsSinceLastLogin++;
    return { error: 'Incorrect password' };
  }

  // Successful login
  user.numSuccessfulLogins++;
  user.numFailedPasswordsSinceLastLogin = 0;

  return { controlUserId: user.controlUserId };
}

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


export {
  adminAuthRegister,
  adminAuthLogin,
  adminControlUserDetails,
};

