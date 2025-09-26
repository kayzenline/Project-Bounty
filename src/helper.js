import { getData } from './data.js';
import { errorCategories as EC } from './testSamples.js';
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
  // Name must be a non-empty string with only letters, spaces, hyphens, or apostrophes
  if (typeof name !== 'string') {
    return false;
  }
  const trimmedName = name.trim();
  // Name must be between 2 and 20 characters (inclusive)
  if (trimmedName.length < 2 || trimmedName.length > 20) {
    return false;
  }
  // Name can only contain letters, spaces, hyphens, or apostrophes
  return /^[a-zA-Z\s\-']+$/.test(trimmedName);
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
    throw {
      error: 'controlUserId must be integer',
      errorCategory: EC.BAD_INPUT,
    };
  }

  const data = getData();

  //user id must correspond to an existing user
  const user = data.missionControlUsers.find(u => u.controlUserId === controlUserId);
  if (!user) {
    throw {
      error: 'controlUserId not found',
      errorCategory: EC.INVALID_CREDENTIALS,
    };
  }


  return user;
}

// Validate mission name and return the trimmed value
function missionNameValidity(name, maxlen = 100) {
  if (typeof name !== 'string') {
    throw { error: 'mission name must be a string', errorCategory: EC.BAD_INPUT };
  }
  // mission name cannot be empty
  const n = name.trim();
  if (n.length === 0) {
    throw { error: 'mission name cannot be empty', errorCategory: EC.BAD_INPUT };
  }
  // mission name cannot be too long
  if (n.length > maxlen) {
    throw { error: 'mission name cannot be too long', errorCategory: EC.BAD_INPUT };
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
  if (!Number.isInteger(missionId) || missionId < 0) {
    throw { error: 'missionId must be integer', errorCategory: EC.BAD_INPUT };
  }
  const data = getData();
  //missionId must correspond to an existing spaceMission
  const mission = data.spaceMissions.find(sm => sm.missionId === missionId);
  if (!mission) {
    throw { error: 'missionId not found', errorCategory: EC.INACCESSIBLE_VALUE };
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

// Normalize thrown errors (either Error or {error, errorCategory})
export function normalizeError(err) {
  if (err && typeof err === 'object') {
    if ('error' in err || 'errorCategory' in err) {
      return {
        error: String(err.error ?? err.message ?? 'Unknown error'),
        errorCategory: err.errorCategory ?? err.code ?? EC.UNKNOWN,
      };
    }
    if ('message' in err) {
      return { error: String(err.message), errorCategory: err.code ?? EC.UNKNOWN };
    }
  }
  return { error: String(err), errorCategory: EC.UNKNOWN };
}
