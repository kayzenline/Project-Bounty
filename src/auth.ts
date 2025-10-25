// This file should contain your functions relating to:
// - adminAuth*
// - adminControlUser*

import {
  controlUserIdGen,
  isValidEmail,
  isValidName,
  controlUserIdCheck,
  normalizeError,
  generateSessionId,
  hashPasswordSync,
  isValidPassword,
  verifyPasswordSync,
  findUserById,
  ServiceError
} from './helper';
import { getData, setData, Session } from './dataStore';
import { errorCategories as EC } from './testSamples';

function buildError(message: string, code: string): never {
  throw new ServiceError(message, code);
}

// Register a mission control user
function adminAuthRegister(email: string, password: string, nameFirst: string, nameLast: string) {
  // Validate email format
  if (!isValidEmail(email)) {
    return { error: 'Invalid email format', errorCategory: EC.BAD_INPUT };
  }

  // Get current data
  const data = getData();

  // Check if email already exists
  const existingUser = data.controlUsers.find(user => user.email === email);
  if (existingUser) {
    return { error: 'Email already registered', errorCategory: EC.BAD_INPUT };
  }

  // Validate first name content (must contain only valid characters)
  if (typeof nameFirst !== 'string' || !/^[a-zA-Z\s\-']+$/.test(nameFirst.trim())) {
    return { error: 'Invalid first name content', errorCategory: EC.BAD_INPUT };
  }

  // Validate first name length
  if (nameFirst.trim().length < 2 || nameFirst.trim().length > 20) {
    return { error: 'Invalid first name length', errorCategory: EC.BAD_INPUT };
  }

  // Validate last name content (must contain only valid characters)
  if (typeof nameLast !== 'string' || !/^[a-zA-Z\s\-']+$/.test(nameLast.trim())) {
    return { error: 'Invalid last name content', errorCategory: EC.BAD_INPUT };
  }

  // Validate last name length
  if (nameLast.trim().length < 2 || nameLast.trim().length > 20) {
    return { error: 'Invalid last name length', errorCategory: EC.BAD_INPUT };
  }

  if (isValidPassword(password) === 0) {
    return { error: 'Password must be at least 8 characters long', errorCategory: EC.BAD_INPUT };
  } else if (isValidPassword(password) === 1) {
    return { error: 'Password must contain at least one letter and one number', errorCategory: EC.BAD_INPUT };
  }

  const hashedPassword = hashPasswordSync(password);
  // Create new user
  const controlUserId = controlUserIdGen();
  const newUser = {
    controlUserId,
    email,
    password: hashedPassword,
    nameFirst: nameFirst.trim(),
    nameLast: nameLast.trim(),
    numSuccessfulLogins: 0,
    numFailedPasswordsSinceLastLogin: 0,
    passwordHistory: [password]
  };
  data.controlUsers.push(newUser);
  data.nextControlUserId++;
  setData(data);
  const controlUserSessionId = adminAuthLogin(email, password).controlUserSessionId;
  return { controlUserSessionId: controlUserSessionId };
}

// Login a mission control user
function adminAuthLogin(email: string, password: string) {
  // Validate password is provided
  if (!password || password === '') {
    return { error: 'Password is required', errorCategory: EC.BAD_INPUT };
  }

  const data = getData();

  const user = data.controlUsers.find(u => u.email === email);
  if (!user) {
    return { error: 'User not found', errorCategory: EC.BAD_INPUT };
  }
  // Check password
  if (!verifyPasswordSync(password, user.password)) {
    user.numFailedPasswordsSinceLastLogin++;
    return { error: 'Incorrect password', errorCategory: EC.BAD_INPUT };
  }
  // Successful login
  user.numSuccessfulLogins++;
  user.numFailedPasswordsSinceLastLogin = 0;

  const controlUserSessionId = generateSessionId();
  const newSession = {
    controlUserSessionId,
    controlUserId: user.controlUserId,
  };
  data.sessions.push(newSession);
  setData(data);
  return { controlUserSessionId };
}

// Logout a mission control user session
function adminAuthLogout(controlUserSessionId: string) {
  const data = getData();

  if (!controlUserSessionId) {
    return { error: 'ControlUserSessionId is empty or invalid', errorCategory: EC.INVALID_CREDENTIALS };
  }

  const session = data.sessions.find(s => s.controlUserSessionId === controlUserSessionId);
  if (!session) {
    return { error: 'ControlUserSessionId is empty or invalid', errorCategory: EC.INVALID_CREDENTIALS };
  }

  // Invalidate session
  const newSessions: Session[] = data.sessions.filter(s => s.controlUserSessionId !== controlUserSessionId);
  data.sessions = newSessions;

  setData(data);
  return {};
}

function adminControlUserDetails(controlUserId: number) {
  const data = getData();
  const user = data.controlUsers.find(a => a.controlUserId === controlUserId);
  if (!user) {
    return { error: 'User not found', errorCategory: EC.INVALID_CREDENTIALS };
  }
  return {
    user: {
      controlUserId: user.controlUserId,
      name: `${user.nameFirst} ${user.nameLast}`,
      email: user.email,
      numSuccessfulLogins: user.numSuccessfulLogins,
      numFailedPasswordsSinceLastLogin: user.numFailedPasswordsSinceLastLogin,
    }
  };
}

function adminControlUserDetailsUpdate(controlUserId: number, email: string, nameFirst: string, nameLast: string) {
  try {
    controlUserIdCheck(controlUserId);
    if (!isValidEmail(email)) {
      buildError('excluding the current authorised user', EC.BAD_INPUT);
    }
    if (!(isValidName(nameFirst) && isValidName(nameLast))) {
      buildError('excluding the current authorised user', EC.BAD_INPUT);
    }

    const data = getData();
    const exists = data.controlUsers.some(
      User => User.email === email && User.controlUserId !== controlUserId
    );
    if (exists) {
      // something woring here
      buildError('excluding the current authorised user', EC.BAD_INPUT);
      //
    } else {
      const theUser = data.controlUsers.find(u => u.controlUserId === controlUserId);
      theUser.email = email;
      theUser.nameFirst = nameFirst;
      theUser.nameLast = nameLast;
    }
    setData(data);
    return {};
  } catch (e) {
    const ne = normalizeError(e);
    return { error: ne.error, errorCategory: ne.errorCategory };
  }
}

function adminControlUserPasswordUpdate(controlUserId: number, oldPassword: string, newPassword: string) {
  const user = findUserById(controlUserId);
  if (!user) {
    return { error: 'ControlUserSessionId is empty or invalid', errorCategory: EC.INVALID_CREDENTIALS };
  }

  const userOldPassword = user.passwordHistory.pop();
  if (userOldPassword !== oldPassword) {
    return { error: 'Old Password is not the correct old password', errorCategory: EC.BAD_INPUT };
  }

  if (oldPassword === newPassword) {
    return { error: 'Old Password and New Password match exactly', errorCategory: EC.BAD_INPUT };
  }

  if (isValidPassword(newPassword) === 0) {
    return { error: 'New Password is less than 8 characters', errorCategory: EC.BAD_INPUT };
  } else if (isValidPassword(newPassword) === 1) {
    return { error: 'New Password does not contain at least one number and at least one letter', errorCategory: EC.BAD_INPUT };
  }

  if (user.passwordHistory.some(p => p === newPassword)) {
    return { error: 'New Password has already been used before by this user', errorCategory: EC.BAD_INPUT };
  }

  const data = getData();
  const dataNeedToStore = data.controlUsers.find(u => u.controlUserId === controlUserId);
  dataNeedToStore.password = hashPasswordSync(newPassword);
  dataNeedToStore.passwordHistory.push(newPassword);

  setData(data);
  return {};
}

export {
  adminAuthRegister,
  adminAuthLogin,
  adminAuthLogout,
  adminControlUserDetails,
  adminControlUserDetailsUpdate,
  adminControlUserPasswordUpdate
};
