import { clear } from '../other.js';
import { adminControlUserDetailsUpdate } from '../auth.js';
import { getData } from '../data.js';

describe('adminMissionTargetUpdate', () => {
  beforeEach(() => {
    clear();
    const controlUser = {
      controlUserId: 1,
      email: 'strongbeard@starfleet.com.au',
      password: 'xxxxxxxxx',
      nameFirst: 'Bill',
      nameLast: 'Ryker',
      numFailedPasswordsSinceLastLogin: 1,
      passwordHistory: 'zzzzzzzzz',
    };
    const data = getData();
    data.missionControlUsers.push(controlUser);
  });

  test('check function get a invalid controlUserId', () => {
    const controlUserId1 = 'abc';
    const controlUserId2 = 2;
    const email = 'example123@domain.com';
    const nameFirst = 'Tony';
    const nameLast = 'Stark';

    const result1 = adminControlUserDetailsUpdate(controlUserId1, email, nameFirst, nameLast);
    expect(result1.error).toContain('controlUserId must be integer');
    const result2 = adminControlUserDetailsUpdate(controlUserId2, email, nameFirst, nameLast);
    expect(result2.error).toContain('controlUserId not found');
  });
  test('check function get a invalid email', () => {
    const controlUserId = 1;
    const email = '@@example123@domain.com.au';
    const nameFirst = 'Tony';
    const nameLast = 'Stark';

    const result1 = adminControlUserDetailsUpdate(controlUserId, email, nameFirst, nameLast);
    expect(result1.error).toContain('this email is invalid');
  });

  test('get a email that excluding the current authorised user', () => {
    const controlUser2 = {
      controlUserId: 2,
      email: 'example123@domain.com.au',
      password: 'xxxxxxxxx',
      nameFirst: 'Bilian',
      nameLast: 'Rykery',
      numFailedPasswordsSinceLastLogin: 1,
      passwordHistory: 'zzzzzzzzz',
    };
    const data = getData();
    data.missionControlUsers.push(controlUser2);
    const controlUserId = 1;
    const email = 'example123@domain.com.au';
    const nameFirst = 'Tony';
    const nameLast = 'Stark';

    const result1 = adminControlUserDetailsUpdate(controlUserId, email, nameFirst, nameLast);
    expect(result1.error).toContain('excluding the current authorised user');
  });

  test('check function get a invalid name', () => {
    const controlUserId  = 1;
    const email = 'example1@domain.com';
    const nameList = [
      {nameFirst: 'T', nameLast: 'Stark'},
      {nameFirst: 'Tony', nameLast: 'S'},
      {nameFirst: 'T'.repeat(21), nameLast: 'Stark'},
      {nameFirst: 'Tony', nameLast: 'S'.repeat(21)},
      {nameFirst: '@Tony', nameLast: 'Stark'},
      {nameFirst: 'Tony', nameLast: '@Stark'}
    ];

    for (let names of nameList) {
      const result = adminControlUserDetailsUpdate(controlUserId, email, names.nameFirst, names.nameLast);
      expect(result.error).toContain('this name is invalid');
      // reset data before test
      clear();
      const controlUser = {
        controlUserId: 1,
        email: 'strongbeard@starfleet.com.au',
        password: 'xxxxxxxxx',
        nameFirst: 'Bill',
        nameLast: 'Ryker',
        numFailedPasswordsSinceLastLogin: 1,
        passwordHistory: 'zzzzzzzzz',
      };
      const data = getData();
      data.missionControlUsers.push(controlUser);
    }
  });

  test('check function returns correctly', () => {
    const controlUserId  = 1;
    const email = 'example123@domain.com';
    const nameFirst = 'Tony';
    const nameLast = 'Stark';

    const result = adminControlUserDetailsUpdate(controlUserId, email, nameFirst, nameLast);
    expect(result).toEqual({});

    const data = getData();
    const updatedUserDetails = data.missionControlUsers.find(m => m.controlUserId === controlUserId);
    expect(updatedUserDetails.email).toBe(email);
    expect(updatedUserDetails.nameFirst).toBe(nameFirst);
    expect(updatedUserDetails.nameLast).toBe(nameLast);
  });
});