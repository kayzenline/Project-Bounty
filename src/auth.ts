// This file should contain your functions relating to:
// - adminAuth*
// - adminControlUser*

import {
  controlUserIdGen,
  isValidEmail,
  isValidName,
  controlUserIdCheck,
  findUserById,
  normalizeError,
  generateSessionId,
} from './helper';
import { getData, setData } from './dataStore';
import { errorCategories as EC } from './testSamples';

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

  // Validate password length
  if (typeof password !== 'string' || password.length < 8) {
    return { error: 'Password must be at least 8 characters long', errorCategory: EC.BAD_INPUT };
  }

  // Validate password content (must contain at least one number and one letter)
  if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(password)) {
    return { error: 'Password must contain at least one letter and one number', errorCategory: EC.BAD_INPUT };
  }

  // Create new user
  const controlUserId = controlUserIdGen();
  const newUser = {
    controlUserId,
    email,
    password,
    nameFirst: nameFirst.trim(),
    nameLast: nameLast.trim(),
    numSuccessfulLogins: 1,
    numFailedPasswordsSinceLastLogin: 0,
    passwordHistory: [password],
  };

  data.controlUsers.push(newUser);

  const controlUserSessionId = generateSessionId();
  const newSession = {
    controlUserSessionId: controlUserSessionId,
    controlUserId: controlUserId,
  };
  data.sessions.push(newSession);
  setData(data);

  return { controlUserSessionId };
}

// Login a mission control user
function adminAuthLogin(email: string, password: string) {
  // Validate password is provided
  if (!password || password === '') {
    // wo sh sb
    return { error: 'Password is required', errorCategory: EC.BAD_INPUT };
  }

  // Get current data
  const data = getData();

  // Find user by email
  const user = data.controlUsers.find(u => u.email === email);
  if (!user) {
    return { error: 'User not found', errorCategory: EC.BAD_INPUT };
  }

  // Check password
  if (user.password !== password) {
    if (!user.numFailedPasswordsSinceLastLogin) {
      user.numFailedPasswordsSinceLastLogin = 0;
    }
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

  if (!controlUserSessionId || typeof controlUserSessionId !== 'string') {
    return { error: 'ControlUserSessionId is empty or invalid', errorCategory: EC.INVALID_CREDENTIALS };
  }

  const index = data.sessions.findIndex(s => s.controlUserSessionId === controlUserSessionId);
  if (index === -1) {
    return { error: 'ControlUserSessionId is empty or invalid', errorCategory: EC.INVALID_CREDENTIALS };
  }

  // Invalidate session
  data.sessions.splice(index, 1);
  return {};
}

function adminControlUserDetails(controlUserId: number) {
  const data = getData();
  const user = data.controlUsers.find(a => a.controlUserId === controlUserId);
  if (!user) {
    return { error: 'User not found', errorCategory: 'INVALID_CREDENTIALS' };
  }
  return {
    user: {
      controlUserId: user.controlUserId,
      name: `${user.nameFirst} ${user.nameLast}`,
      email: user.email,
      numSuccessfulLogins: user.numSuccessfulLogins || 0,
      numFailedPasswordsSinceLastLogin: user.numFailedPasswordsSinceLastLogin || 0,
    }
  };
}

type ErrorWithCode = Error & { code?: string };

function adminControlUserDetailsUpdate(controlUserId: number, email: string, nameFirst: string, nameLast: string) {
  try {
    controlUserIdCheck(controlUserId);
    if (!isValidEmail(email)) {
      const e = new Error('this email is invalid') as ErrorWithCode;
      e.code = 'BAD_INPUT';
      throw e;
    }
    if (!(isValidName(nameFirst) && isValidName(nameLast))) {
      const e = new Error('this name is invalid') as ErrorWithCode;
      e.code = 'BAD_INPUT';
      throw e;
    }

    const data = getData();
    const exists = data.controlUsers.some(
      User => User.email === email && User.controlUserId !== controlUserId
    );
    if (exists) {
      // something woring here
      const e = new Error('excluding the current authorised user') as ErrorWithCode;
      e.code = 'BAD_INPUT';
      throw e;
      //
    } else {
      const theUser = findUserById(controlUserId);
      theUser.email = email;
      theUser.nameFirst = nameFirst;
      theUser.nameLast = nameLast;
    }
    setData(data);
    return {};
  } catch (e) {
    const ne = normalizeError(e);
    return { error: ne.error, errorCategory: ne.errorCategory || 'BAD_INPUT' };
  }
}

function adminControlUserPasswordUpdate(controlUserId: number, oldPassword: string, newPassword: string) {
  const data = getData();
  const user = (data.controlUsers || []).find(u => u.controlUserId === controlUserId);
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
  user.passwordHistory = user.passwordHistory || [];
  if (user.passwordHistory.includes(newPassword)) {
    return { error: 'password reused', errorCategory: 'BAD_INPUT' };
  }
  if (!user.passwordHistory.includes(user.password)) {
    user.passwordHistory.push(user.password);
  }
  user.password = newPassword;

  return {};
}

export {
  adminAuthRegister,
  adminAuthLogin,
  adminAuthLogout,
  adminControlUserDetails,
  adminControlUserDetailsUpdate,
  adminControlUserPasswordUpdate,
};
