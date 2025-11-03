import {
  adminAuthUserRegisterRequest,
  adminMissionCreateRequest,
  adminMissionTransferRequest,
  clearRequest,
  adminMissionListRequest,
  adminAuthUserLoginRequest
} from './requestHelpers';
import { generateSessionId, missionIdGen } from '../../src/helper';

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
describe('Success Tests', () => {
  test('Correct output', () => {
    const transferRes = adminMissionTransferRequest(u1Session, m1_u1, 'user2@example.com');
    expect(transferRes.statusCode).toBe(200);
    expect(transferRes.body).toStrictEqual({});
  });
  test('Datastore modification', () => {
    const transferRes = adminMissionTransferRequest(u1Session, m2_u1, 'user2@example.com');
    expect(transferRes.statusCode).toBe(200);
    const newLoginRes = adminAuthUserLoginRequest('user2@example.com', 'abc12345');
    expect(newLoginRes.statusCode).toBe(200);
    const missionListRes = adminMissionListRequest(newLoginRes.body.controlUserSessionId);
    expect(missionListRes.statusCode).toBe(200);
    expect(missionListRes.body.missions.find((m: { missionId: number, name: string }) => m.name === 'MissionTwo').missionId).toStrictEqual(2);
  });
});

describe('Expected Errors', () => {
  // tests for error 400
  test('userEmail is not a real control user', () => {
    const transferRes = adminMissionTransferRequest(u1Session, m1_u1, 'user3@example.com');
    expect(transferRes.statusCode).toBe(400);
    expect(transferRes.body).toStrictEqual(ERROR);
  });
  test('userEmail is the current logged in control user', () => {
    const transferRes = adminMissionTransferRequest(u1Session, m2_u1, 'user1@example.com');
    expect(transferRes.statusCode).toBe(400);
    expect(transferRes.body).toStrictEqual(ERROR);
  });
  test('missionId refers to a space mission that has a name that is already used by the target user', () => {
    const c24 = adminMissionCreateRequest(u2Session, 'MissionTwo', 'Test Description', 'Moon');
    expect(c24.statusCode).toBe(200);
    const transferRes = adminMissionTransferRequest(u1Session, m2_u1, 'user2@example.com');
    expect(transferRes.statusCode).toBe(400);
    expect(transferRes.body).toStrictEqual(ERROR);
  });

  // tests for error 401
  const invalidSessionId = [
    '',
    generateSessionId()
  ];
  test.each(invalidSessionId)('ControlUserSessionId is empty', (sessionId) => {
    const transferRes = adminMissionTransferRequest(sessionId, m2_u1, 'user2@example.com');
    expect(transferRes.statusCode).toBe(401);
    expect(transferRes.body).toStrictEqual(ERROR);
  });

  // tests for error 403
  test('space mission does not exist', () => {
    const transferRes = adminMissionTransferRequest(u2Session, missionIdGen(), 'user1@example.com');
    expect(transferRes.statusCode).toBe(403);
    expect(transferRes.body).toStrictEqual(ERROR);
  });
  test('Mission does not belong to this User', () => {
    const newUserSessionId = adminAuthUserRegisterRequest('user3@example.com', 'abc12345', 'Zhennan', 'Chen').body.controlUserSessionId;
    const newMissionId = adminMissionCreateRequest(newUserSessionId, 'MissionFour', 'New Test Description', 'New Test Target').body.missionId;
    const transferRes = adminMissionTransferRequest(u2Session, newMissionId, 'user1@example.com');
    expect(transferRes.statusCode).toBe(403);
    expect(transferRes.body).toStrictEqual(ERROR);
  });
});
