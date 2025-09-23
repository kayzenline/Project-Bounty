import { adminMissionTargetUpdate, 
  controlUserIdCheck, 
  missionIdcheck, 
  missionTargetValidity
} from '../helper.js';

import { clear } from '../other.js';


describe('adminMissionTargetUpdate', () => {
  beforeEach(() => {
    clear();
  });

  test('check function get a invalid controlUserId', () => {
    const controlUserId = 'abc';
    expect()
  })

  test('check function get a invalid missionId', () => {
    const missionId = 'abc';
    expect()
  })

  test('check function get a invalid target', () => {
    const missionTarget = 'z'.repeat(101);
    expect();
  })


});