import { getData } from './dataStore';
import { errorCategories as EC } from './testSamples';
import { v4 as uuidGen } from 'uuid';
import bcrypt from 'bcrypt';

// hash function
export function hashPasswordSync(plainPassword: string): string {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(plainPassword, salt);
}

export function verifyPasswordSync(plainPassword: string, hashedPassword: string): boolean {
  return bcrypt.compareSync(plainPassword, hashedPassword);
}

// Helper function to generate unique control user ID
function controlUserIdGen() {
  const data = getData();
  return data.nextControlUserId++;
}

// Helper function to validate password
function isValidPassword(password: string) {
  // Password must be at least 8 characters long
  if (typeof password !== 'string' || password.length < 8) {
    return 0;
  }
  // Password does not contain at least one number and at least one letter
  if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(password)) {
    return 1;
  }
  return 2;
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
  return /^[a-zA-Z\-']+$/.test(trimmedName);
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

class ServiceError extends Error {
  errorCategory: string;
  constructor(error: string, errorCategory: string) {
    super(error);
    this.errorCategory = errorCategory;
  }
}

// Helper function to check if control user's ID is valid or invalid
function controlUserIdCheck(controlUserId: number) {
  // user id must be integer
  if (!Number.isInteger(controlUserId) || controlUserId <= 0) {
    throw new ServiceError('controlUserId must be integer', EC.BAD_INPUT);
  }

  const data = getData();

  // user id must correspond to an existing user
  const user = data.controlUsers.find(u => u.controlUserId === controlUserId);
  if (!user) {
    throw new ServiceError('controlUserId not found', EC.INVALID_CREDENTIALS);
  }

  return user;
}

// Validate mission name and return the trimmed value
function missionNameValidity(name: string, { minLen = 3, maxLen = 30 } = {}) {
  if (typeof name !== 'string') {
    throw new ServiceError('mission name must be a string', EC.BAD_INPUT);
  }

  const trimmed = name.trim();
  if (trimmed.length === 0) {
    throw new ServiceError('mission name cannot be empty', EC.BAD_INPUT);
  }

  if (trimmed.length < minLen) {
    throw new ServiceError('mission name is too short', EC.BAD_INPUT);
  }

  if (trimmed.length > maxLen) {
    throw new ServiceError('mission name is too long', EC.BAD_INPUT);
  }

  if (!/^[a-zA-Z0-9\s\-']+$/.test(trimmed)) {
    throw new ServiceError('mission name contains invalid characters', EC.BAD_INPUT);
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
    throw new ServiceError('description is too long', EC.BAD_INPUT);
  }

  return description;
}

// Helper function for mission target validity
function missionTargetValidity(target: string, maxlen = 100) {
  // check type of target
  if (typeof target !== 'string') {
    throw new ServiceError('target must be a string', EC.BAD_INPUT);
  }

  // check target length
  if (target.length > maxlen) {
    throw new ServiceError('target is too long', EC.BAD_INPUT);
  }

  return target;
}

// Helper function for checking if missionId is valid or invalid

function missionIdCheck(missionId: number) {
  // missionId must be integer

  if (!Number.isInteger(missionId) || missionId < 0) {
    throw new ServiceError('missionId must be integer', EC.BAD_INPUT);
  }

  const data = getData();
  // missionId must correspond to an existing spaceMission
  const mission = data.spaceMissions.find(sm => sm.missionId === missionId);
  if (!mission) {
    throw new ServiceError('missionId not found', EC.INACCESSIBLE_VALUE);
  }
  return mission;
}
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

function normalizeError(err: unknown) {
  if (isNormalizedErrorSource(err)) {
    if (err.error !== undefined || err.errorCategory !== undefined) {
      const message = err.error ?? err.message ?? 'Unknown error';
      let category = err.errorCategory ?? err.code ?? EC.UNKNOWN;
      category = String(category).toUpperCase().trim();
      return {
        error: String(message),
        errorCategory: String(category),
      };
    }

    if (err.message !== undefined) {
      let category = err.code ?? EC.UNKNOWN;
      category = String(category).toUpperCase().trim();
      return { error: String(err.message), errorCategory: String(category) };
    }
  }

  return { error: String(err), errorCategory: 'BAD_INPUT' };
}

function generateSessionId() {
  return uuidGen();
}

function astronautIdCheck(astronautId: number) {
  // missionId must be integer

  if (!Number.isInteger(astronautId) || astronautId < 0) {
    throw new ServiceError('astronautId must be integer', EC.BAD_INPUT);
  }

  const data = getData();
  // astronautId must correspond to an existing astronaut
  const astronaut = data.astronauts.find(sm => sm.astronautId === astronautId);
  if (!astronaut) {
    throw new ServiceError('astronautId not found', EC.BAD_INPUT);
  }
  return astronautId;
}

function isValidRank(rank: string) {
  // rank must be a string
  if (typeof rank !== 'string') {
    return false;
  }
  const trimmedRank = rank.trim();
  // rank must be between 5 and 50 characters (inclusive)
  if (trimmedRank.length < 5 || trimmedRank.length > 50) {
    return false;
  }
  // rank can only contain letters, spaces, hyphens, parentheses, or apostrophes
  return /^[a-zA-Z\s\-'()]+$/.test(trimmedRank);
}

function astronautNameCheck(newNameFirst: string, newNamelast: string) {
  if (!(isValidName(newNameFirst) && isValidName(newNamelast))) {
    throw new ServiceError('get an invalid name', EC.BAD_INPUT);
  }

  const data = getData();
  // Another Astronaut already exists with the same nameFirst and nameLast
  const astronaut = data.astronauts.find(sm => sm.nameFirst === newNameFirst && sm.nameLast === newNamelast);
  if (astronaut) {
    throw new ServiceError('astronaut already exists', EC.BAD_INPUT);
  }
  return { newNameFirst: newNameFirst, newNamelast: newNamelast };
}

function astronautRankCheck(newRank: string) {
  if (!isValidRank(newRank)) {
    throw new ServiceError('get an invalid rank', EC.BAD_INPUT);
  }

  return newRank;
}

function astronautPhyCharCheck(age: number, weight: number, height: number) {
  // Check if age is an integer
  if (!Number.isInteger(age)) {
    throw new ServiceError('astronaut age is not meet the requirements', EC.BAD_INPUT);
  }
  if (age < 20 || age > 60) {
    throw new ServiceError('astronaut age is not meet the requirements', EC.BAD_INPUT);
  }
  if (weight < 0 || weight > 100) {
    throw new ServiceError('astronaut overweight', EC.BAD_INPUT);
  }
  if (height < 150 || height > 200) {
    throw new ServiceError('astronaut height does not meet the requirements', EC.BAD_INPUT);
  }

  return { age: age, weight: weight, height: height };
}

function findSessionFromSessionId(controlUserSessionId: string) {
  return getData().sessions.find(s => s.controlUserSessionId === controlUserSessionId);
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
  normalizeError,
  generateSessionId,
  ServiceError,
  findSessionFromSessionId,
  astronautIdCheck,
  astronautNameCheck,
  astronautRankCheck,
  astronautPhyCharCheck
};
