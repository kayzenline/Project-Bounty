
import { beforeEach, describe, expect, test } from '@jest/globals';
import {
  adminAuthUserRegisterRequest,
  adminMissionCreateRequest,
  adminMissionTransferRequest,
  adminMissionDeleteRequest,
  clearRequest
} from './requestHelpers';

const ERROR = { error: expect.any(String) };
let u1Session: string;
let u2Session: string;
let m1_u1: number;
let m2_u1: number;
let m1_u2: number;

beforeEach(() => {
  // call clearRequest() to reset the state
  const cleared = clearRequest();
  expect(cleared.statusCode).toBe(200);
  // call adminAuthRegisterRequest() with sample data for User 1 to create a sample User 1
  const r1 = adminAuthUserRegisterRequest('user1@example.com', 'abc12345', 'John', 'Doe');
  expect(r1.statusCode).toBe(200);
  u1Session = r1.body.controlUserSessionId;
  // call adminAuthRegisterRequest() with sample data for User 2 to create a sample User 2
  const r2 = adminAuthUserRegisterRequest('user2@example.com', 'abc12345', 'Jane', 'Smith');
  expect(r2.statusCode).toBe(200);
  u2Session = r2.body.controlUserSessionId;
  // call adminMissionCreateRequest() with sample data for Mission 1 to create a sample Mission 1 for User 1
  const c11 = adminMissionCreateRequest(u1Session, 'MissionOne', 'Test Description', 'Mars');
  expect(c11.statusCode).toBe(200);
  m1_u1 = c11.body.missionId;
  // call adminMissionCreateRequest() with sample data for Mission 2 to create a sample Mission 2 for User 1
  const c12 = adminMissionCreateRequest(u1Session, 'MissionTwo', 'Test Description', 'Moon');
  expect(c12.statusCode).toBe(200);
  m2_u1 = c12.body.missionId;
  // call adminMissionCreateRequest() with sample data for Mission 1 to create a sample Mission 3 for User 2
  const c21 = adminMissionCreateRequest(u2Session, 'MissionThree', 'Test Description', 'ISS');
  expect(c21.statusCode).toBe(200);
  m1_u2 = c21.body.missionId;
});
// skipping these tests for now
describe.skip('Success Tests', () => {
  test('Correct output', () => {
    // call adminMissionTransfer to transfer Mission 2 from User 1 to User 2
    // expect empty output {}
  });
  test('Datastore modification', () => {
    // call adminMissionTransfer to transfer Mission 2 from User 1 to User 2
    // call adminMissionListRequest() for User 2
    // expect User 2 to now have 2 missions with the second mission having a missionid to the original Mission 2 from User 1
  });
});
// skipping these tests for now
describe.skip('Expected Errors', () => {
  test('ControlUserSessionId is empty', () => {
    // call adminMissionTransfer with an empty controlUserSessionId
    // expect the response body to equal {error: expect.any(String)}
    // expect the response status code to have a status of 401.
  });
  test('ControlUserSessionId is invalid', () => {
    // call adminMissionTransfer with an invalid controlUserSessionId (concatenate User 1 controlUserSessionId and User 2 controlUserSessionId)
    // expect the response body to equal {error: expect.any(String)}
    // expect the response status code to have a status of 401.
  });
  test('ControlUserSessionId is invalid', () => {
    // call adminMissionTransfer with an invalid controlUserSessionId (concatenate User 1 controlUserSessionId and User 2 controlUserSessionId)
    // expect the response body to equal {error: expect.any(String)}
    // expect the response status code to have a status of 401.
  });
  test('ControlUserSessionId is invalid', () => {
    // call adminMissionTransfer with an invalid controlUserSessionId (concatenate User 1 controlUserSessionId and User 2 controlUserSessionId)
    // expect the response body to equal {error: expect.any(String)}
    // expect the response status code to have a status of 401.
  });
  test('missionid is empty', () => {
    // call adminMissionTransfer with empty missionid
    // expect the response body to equal {error: expect.any(String)}
    // expect the response status code to have a status of 403.
  });
  test('Mission does not belong to this User', () => {
    // call adminMissionTransfer with Mission 2 missionid but for User 2 controlUserSessionId.
    // expect the response body to equal {error: expect.any(String)}
    // expect the response status code to have a status of 403.
  });

  test('userEmail is not a real control user', () => {
    // call adminMissionTransfer with an email not in the system
    // expect the response body to equal {error: expect.any(String)}
    // expect the response status code to have a status of 400.
  });
  test('userEmail is the current logged in control user', () => {
    // call adminMissionTransfer with Mission 2 for User 1 to User 1
    // expect the response body to equal {error: expect.any(String)}
    // expect the response status code to have a status of 403.
  });
  test('missionId refers to a space mission that has a name that is already used by the target user', () => {
    // create Mission 4 using Sample Mission 2 for User 2
    // call adminMissionTransfer with Mission 2 to User 2.
    // expect the response body to equal {error: expect.any(String)}
    // expect the response status code to have a status of 403.
  });
});
