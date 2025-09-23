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

// Validate mission name and return the trimmed value
function missionNameValidity(name, maxlen = 100) {
  if (typeof name !== 'string') {
    const e = new Error('mission name must be a string');
    e.code = EC.BAD_INPUT;
    throw e;
  }
  // mission name cannot be empty
  const n = name.trim();
  if (n.length === 0) {
    const e = new Error('mission name cannot be empty');
    e.code = EC.BAD_INPUT;
    throw e;
  }
  // mission name cannot be too long
  if (n.length > maxlen) {
    const e = new Error('mission name cannot be too long');
    e.code = EC.BAD_INPUT;
    throw e;
  }
  return n;
}
// Helper function to generate unique mission ID.
function missionIdGen() {
  const data = getData();
  return data.nextMissionId++;
}

// Helper function for mission description validity
function missionDescriptionValidity(description, maxlen = 400) {
  // check type of description
  if (typeof description !== 'string') {
    const e = new Error('description must be a string');
    e.code = EC.BAD_INPUT;
    throw e;
  }

  // check description length
  if (description.length > maxlen) {
    const e = new Error('description is too long');
    e.code = EC.BAD_INPUT;
    throw e;
  }

  return description;
}

// Helper function for mission target validity
function missionTargetValidity(target, maxlen = 100) {
  // check type of target
  if (typeof target !== 'string') {
    const e = new Error('target must be a string');
    e.code = EC.BAD_INPUT;
    throw e;
  }

  // check target length
  if (target.length > maxlen) {
    const e = new Error('target is too long');
    e.code = EC.BAD_INPUT;
    throw e;
  }

  return target;
}

// Helper function for checking if missionId is valid or invalid
function missionIdCheck(missionId) {
  //missionId must be integer
  if (!Number.isInteger(missionId) || missionId <= 0) {
    const e = new Error('missionId must be integer');
    e.code = EC.BAD_INPUT;
    throw e;
  }
  const data = getData();
  //missionId must correspond to an existing spaceMission
  const mission = data.spaceMissions.find(sm => sm.missionId === missionId);
  if (!mission) {
    const e = new Error('missionId not found');
    e.code = EC.INACCESSIBLE_VALUE;
    throw e;
  }
  return mission;
}

export {
  controlUserIdGen,
  isValidPassword,
  isValidName,
  isValidEmail,
  findUserByEmail,
  findUserById,
  controlUserIdCheck,
  missionNameValidity,
  missionIdGen,
  missionDescriptionValidity,
  missionTargetValidity,
  missionIdCheck,
};
