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
import HTTPError from 'http-errors';

function buildError(message: string, code: string): never {
  throw new ServiceError(message, code);
}

function throwErrorForFunction(code: string, message: string) {
  switch (code) {
    case 'INVALID_CREDENTIALS':
      throw HTTPError(401, message);
    case 'INACCESSIBLE_VALUE':
      throw HTTPError(403, message);
    default:
      throw HTTPError(400, message);
  }
}

// Register a mission control user
function adminAuthRegister(email: string, password: string, nameFirst: string, nameLast: string) {
  try {
    if (!isValidEmail(email)) {
      buildError('Invalid email format', EC.BAD_INPUT);
    }
    // Get current data
    const data = getData();

    // Check if email already exists
    const existingUser = data.controlUsers.find(user => user.email === email);
    if (existingUser) {
      buildError('Email already registered', EC.BAD_INPUT);
    }

    // Validate first name content (must contain only valid characters)
    if (!isValidName(nameFirst)) {
      buildError('Invalid first name', EC.BAD_INPUT);
    }

    if (!isValidName(nameLast)) {
      buildError('Invalid last name', EC.BAD_INPUT);
    }

    if (isValidPassword(password) === 0) {
      buildError('Password must be at least 8 characters long', EC.BAD_INPUT);
    } else if (isValidPassword(password) === 1) {
      buildError('Password must contain at least one letter and one number', EC.BAD_INPUT);
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
      flagLastLogin: false,
      numSuccessfulLogins: 0,
      numFailedPasswordsSinceLastLogin: 0,
      passwordHistory: [password]
    };
    data.controlUsers.push(newUser);
    data.nextControlUserId++;
    setData(data);
    const controlUserSessionId = adminAuthLogin(email, password).controlUserSessionId;
    return { controlUserSessionId: controlUserSessionId };
  } catch (e) {
    const ne = normalizeError(e);
    throwErrorForFunction(ne.errorCategory, ne.error);
  }
}

// Login a mission control user
function adminAuthLogin(email: string, password: string) {
  try {
    // Validate password is provided
    const data = getData();
    const user = data.controlUsers.find(u => u.email === email);

    if (!user) {
      buildError('User not found', EC.BAD_INPUT);
    }

    if (user.flagLastLogin === true) {
      user.numFailedPasswordsSinceLastLogin = 0;
    }

    if (!password || password === '') {
      user.flagLastLogin = false;
      setData(data);
      buildError('Password is required', EC.BAD_INPUT);
    }

    // Check password
    if (!verifyPasswordSync(password, user.password)) {
      user.flagLastLogin = false;
      user.numFailedPasswordsSinceLastLogin++;
      setData(data);
      buildError('Incorrect password', EC.BAD_INPUT);
    }
    // Successful login
    user.numSuccessfulLogins++;

    const controlUserSessionId = generateSessionId();
    user.flagLastLogin = true;
    const newSession = {
      controlUserSessionId,
      controlUserId: user.controlUserId,
    };
    data.sessions.push(newSession);
    setData(data);
    return { controlUserSessionId: controlUserSessionId };
  } catch (e) {
    const ne = normalizeError(e);
    throwErrorForFunction(ne.errorCategory, ne.error);
  }
}

// Logout a mission control user session
function adminAuthLogout(controlUserSessionId: string) {
  try {
    const data = getData();
    if (!controlUserSessionId) {
      buildError('ControlUserSessionId is empty or invalid', EC.INVALID_CREDENTIALS);
    }

    const session = data.sessions.find(s => s.controlUserSessionId === controlUserSessionId);
    if (!session) {
      buildError('ControlUserSessionId is empty or invalid', EC.INVALID_CREDENTIALS);
    }

    // Invalidate session
    const newSessions: Session[] = data.sessions.filter(s => s.controlUserSessionId !== controlUserSessionId);
    data.sessions = newSessions;

    setData(data);
    return {};
  } catch (e) {
    const ne = normalizeError(e);
    throwErrorForFunction(ne.errorCategory, ne.error);
  }
}

function adminControlUserDetails(controlUserId: number) {
  try {
    const data = getData();
    const user = data.controlUsers.find(a => a.controlUserId === controlUserId);
    if (!user) {
      buildError('User not found', EC.INVALID_CREDENTIALS);
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
  } catch (e) {
    const ne = normalizeError(e);
    throwErrorForFunction(ne.errorCategory, ne.error);
  }
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
    throwErrorForFunction(ne.errorCategory, ne.error);
  }
}

function adminControlUserPasswordUpdate(controlUserId: number, oldPassword: string, newPassword: string) {
  try {
    const user = findUserById(controlUserId);
    if (!user) {
      buildError('ControlUserSessionId is empty or invalid', EC.INVALID_CREDENTIALS);
    }

    const userOldPassword = user.passwordHistory.pop();
    if (userOldPassword !== oldPassword) {
      buildError('Old Password is not the correct old password', EC.BAD_INPUT);
    }

    if (oldPassword === newPassword) {
      buildError('Old Password and New Password match exactly', EC.BAD_INPUT);
    }

    if (isValidPassword(newPassword) === 0) {
      buildError('New Password is less than 8 characters', EC.BAD_INPUT);
    } else if (isValidPassword(newPassword) === 1) {
      buildError('New Password does not contain at least one number and at least one letter', EC.BAD_INPUT);
    }

    if (user.passwordHistory.some(p => p === newPassword)) {
      buildError('New Password has already been used before by this user', EC.BAD_INPUT);
    }

    const data = getData();
    const dataNeedToStore = data.controlUsers.find(u => u.controlUserId === controlUserId);
    dataNeedToStore.password = hashPasswordSync(newPassword);
    dataNeedToStore.passwordHistory.push(newPassword);

    setData(data);
    return {};
  } catch (e) {
    const ne = normalizeError(e);
    throwErrorForFunction(ne.errorCategory, ne.error);
  }
}

export {
  adminAuthRegister,
  adminAuthLogin,
  adminAuthLogout,
  adminControlUserDetails,
  adminControlUserDetailsUpdate,
  adminControlUserPasswordUpdate
};
