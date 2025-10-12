import { afterAll, beforeEach, describe, expect, test } from '@jest/globals';
import { clear } from '../../src/other';
import { controlUserSessionId as missionCreate, userRegister } from './requestHelpers';
let token: string;
beforeEach(() => {

});

afterAll(() => {
  clear();
});

describe('/v1/admin/mission/{missionid}', () => {

  describe('valid cases', () => {
    // status code 200 If any of the following are true:
    test('successful delete a space mission', () => {


    });
  })
  describe('invalid cases', () => {
    // status code 400 If any of the following are true:
    test('Astronauts have been assigned to this mission', () => {



    });
    // status code 401 If any of the following are true:
    test('ControlUserSessionId is empty or invalid (does not refer to valid logged in user session)', () => {



    })
    // status code 403 If any of the following are true:
    test('Valid controlUserSessionId is provided, but control user is not an owner of this space mission or the space mission does not exist', () => {



    })
  })
})