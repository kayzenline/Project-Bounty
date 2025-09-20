import { getData } from './data.js';
import { errorCategories as EC } from './errors.js';
// Helper function to generate unique control user ID
function controlUserIdGen() {
  const data = getData();
  return data.nextControlUserId++;
}

// Helper function to validate password
function isValidPassword(password) {
  // Password must be at least 8 characters long
  return typeof password === 'string' && password.length >= 8;
}

// Helper function to validate name
function isValidName(name) {
  // Name must be a non-empty string with only letters and spaces
  return typeof name === 'string' && 
         name.trim().length > 0 && 
         /^[a-zA-Z\s]+$/.test(name.trim());
}

// Helper function to validate email
function isValidEmail(email) {
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === 'string' && emailRegex.test(email);
}

// Helper function to find user by email
function findUserByEmail(email) {
  const data = getData();
  return data.missionControlUsers.find(user => user.email === email);
}

// Helper function to find user by controlUserId
function findUserById(controlUserId) {
  const data = getData();
  return data.missionControlUsers.find(user => user.controlUserId === controlUserId);
}

// Helper function to check if control user's ID is valid or invalid
function controlUserIdCheck(controlUserId) {
  //user id must be integer
  if (!Number.isInteger(controlUserId) || controlUserId <= 0) {
    const e = new Error('controlUserId must be integer');
    e.code = EC.BAD_INPUT;
    throw e;
  }
  const data = getData();
  //user id must correspond to an existing user
  const user = data.missionControlUsers.find(u => u.controlUserId === controlUserId);
  if (!user) {
    const e = new Error('controlUserId not found');
    e.code = EC.INACCESSIBLE_VALUE;
    throw e;
  }
  return user;
}

// check mission name is valid or not
function missionNameValidity(name, maxlen = 100) {
  // check type of name
  if (typeof name !== 'string') {
    const e = new Error('mission name must be a string');
    e.cause = EC.BAD_INPUT;
    throw e;
  }
  // check is name a empty
  const n = name.trim()
  if(n.length === 0) {
    const e = new Error('misssion name cannot be a empty');
    e.cause = EC.BAD_INPUT;
    throw e;
  }
  // check name length
  const nlen = name.length;
  if(nlen > maxlen) {
    const e = new Error('misssion name cannot be too long');
    e.cause = EC.BAD_INPUT;
    throw e;
  }
  return name;
}



export {
  controlUserIdGen,
  isValidPassword,
  isValidName,
  isValidEmail,
  findUserByEmail,
  findUserById,
  controlUserIdCheck,
  missionNameValidity
};
