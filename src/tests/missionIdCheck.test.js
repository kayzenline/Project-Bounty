import { missionIdCheck } from '../helper.js';
import { getData } from '../data.js';
import { clear } from '../other.js';
import { adminMissionCreate } from '../mission.js';
import { adminAuthRegister } from '../auth.js';
import { controlUserIdGen, isValidEmail, isValidPassword, isValidName, findUserByEmail, findUserById } from '../helper.js';

describe('catch error form missionIdCheck', () => {
  beforeEach( () => {
    clear();
  });

  test('catch error when missionId is not compliant', () => {
    expect( () => missionIdCheck('abc')).toThrow();
  });

  test('missionId is not a number(integer)', () => {
    const missionId = ['abc', -1];
    expect( () => missionIdCheck(missionId[0])).toThrow('missionId must be integer');
    expect( () => missionIdCheck(missionId[1])).toThrow('missionId must be integer');
  });

  test('missionId is not correspond to an existing spaceMission', () => {
    const controlUser = {
      email: 'z5555555@ad.myunsw.edu.au',
      password: 'mypassword',
      nameFirst: 'Tony',
      nameLast: 'Stark',
    };
    const missionDetail = {
      name: 'Stellar Exploration One',
      description: 'Detect Martian geological structure',
      target: 'Mars',
    };
    const controlUserId = adminAuthRegister(controlUser.email, controlUser.password, controlUser.nameFirst, controlUser.nameLast);
    const missionNextId = adminMissionCreate(controlUserId, missionDetail.name, missionDetail.description, missionDetail.target);
    expect( () => missionIdCheck(missionNextId)).toThrow('missionId not found');
  });

  test('missionId is not correspond to an existing spaceMission', () => {
    const controlUser = {
      email: 'z5555555@ad.myunsw.edu.au',
      password: 'mypassword',
      nameFirst: 'Tony',
      nameLast: 'Stark',
    };
    const missionDetail = {
      name: 'Stellar Exploration One',
      description: 'Detect Martian geological structure',
      target: 'Mars',
    };
    const controlUserId = adminAuthRegister(controlUser.email, controlUser.password, controlUser.nameFirst, controlUser.nameLast);
    const missionNextId = adminMissionCreate(controlUserId, missionDetail.name, missionDetail.description, missionDetail.target);
    const data = getData();
    expect(missionIdCheck(missionNextId - 1)).toBe(data.spaceMissions.find(sm => sm.missionId === missionId));
  });
});