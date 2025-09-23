import {
  controlUserIdCheck, 
  missionIdCheck, 
  missionTargetValidity
} from '../helper.js';

import { clear } from '../other.js';
import { adminMissionTargetUpdate } from '../mission.js';


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