import { getData } from './dataStore';
import { errorCategories as EC } from './testSamples';
// Helper function to generate unique control user ID
function controlUserIdGen() {
  const data = getData();
  return data.nextControlUserId++;
}

// Helper function to validate password
function isValidPassword(password: string) {
  // Password must be at least 8 characters long
  return typeof password === 'string' && password.length >= 8;
}

// Helper function to validate name
function isValidName(name: string) {
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
function isValidEmail(email: string) {
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === 'string' && emailRegex.test(email);
}

// Helper function to find user by email
function findUserByEmail(email: string) {
  const data = getData();
  return data.controlUsers.find(user => user.email === email);
}

// Helper function to find user by controlUserId
function findUserById(controlUserId: number) {
  const data = getData();
  return data.controlUsers.find(user => user.controlUserId === controlUserId);
}

// Helper function to check if control user's ID is valid or invalid
function controlUserIdCheck(controlUserId: number) {
  //user id must be integer
  if (!Number.isInteger(controlUserId) || controlUserId <= 0) {
    throw {
      error: 'controlUserId must be integer',
      errorCategory: EC.BAD_INPUT,
    };
  }

  const data = getData();

  //user id must correspond to an existing user
  const user = data.controlUsers.find(u => u.controlUserId === controlUserId);
  if (!user) {
    throw {
      error: 'controlUserId not found',
      errorCategory: EC.INVALID_CREDENTIALS,
    };
  }


  return user;
}

// Validate mission name and return the trimmed value
function missionNameValidity(name: string, { minLen = 3, maxLen = 30 } = {}) {
  if (typeof name !== 'string') {
    throw { error: 'mission name must be a string', errorCategory: EC.BAD_INPUT };
  }

  const trimmed = name.trim();
  if (trimmed.length === 0) {
    throw { error: 'mission name cannot be empty', errorCategory: EC.BAD_INPUT };
  }

  if (trimmed.length < minLen) {
    throw { error: 'mission name is too short', errorCategory: EC.BAD_INPUT };
  }

  if (trimmed.length > maxLen) {
    throw { error: 'mission name is too long', errorCategory: EC.BAD_INPUT };
  }

  if (!/^[a-zA-Z0-9\s\-']+$/.test(trimmed)) {
    throw { error: 'mission name contains invalid characters', errorCategory: EC.BAD_INPUT };
  }

  return trimmed;
}
// Helper function to generate unique mission ID.
function missionIdGen() {
  const data = getData();
  return data.nextMissionId++;
}

// Custom error type with code property
interface CustomError extends Error {
  code?: string;
}

// Helper function for mission description validity
function missionDescriptionValidity(description: string, maxlen = 400) {
  // check type of description
  if (typeof description !== 'string') {
    const e = new Error('description must be a string') as CustomError;
    e.code = EC.BAD_INPUT;
    throw e;
  }

  // check description length
  if (description.length > maxlen) {
    const e = new Error('description is too long') as CustomError;
    e.code = EC.BAD_INPUT;
    throw e;
  }

  return description;
}

// Helper function for mission target validity
function missionTargetValidity(target: string, maxlen = 100) {
  // check type of target
  if (typeof target !== 'string') {
    const e = new Error('target must be a string') as CustomError;
    e.code = EC.BAD_INPUT;
    throw e;
  }

  // check target length
  if (target.length > maxlen) {
    const e = new Error('target is too long') as CustomError;
    e.code = EC.BAD_INPUT;
    throw e;
  }

  return target;
}

// Helper function for checking if missionId is valid or invalid
function missionIdCheck(missionId: number) {
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
type NormalizedErrorSource = Partial<{
  error: unknown;
  errorCategory: unknown;
  message: unknown;
  code: unknown;
}>;

function isNormalizedErrorSource(value: unknown): value is NormalizedErrorSource {
  return typeof value === 'object' && value !== null;
}

export function normalizeError(err: unknown) {
  if (isNormalizedErrorSource(err)) {
    if (err.error !== undefined || err.errorCategory !== undefined) {
      const message = err.error ?? err.message ?? 'Unknown error';
      const category = err.errorCategory ?? err.code ?? EC.UNKNOWN;
      return {
        error: String(message),
        errorCategory: String(category),
      };
    }

    if (err.message !== undefined) {
      const category = err.code ?? EC.UNKNOWN;
      return { error: String(err.message), errorCategory: String(category) };
    }
  }

  return { error: String(err), errorCategory: EC.UNKNOWN };
}
