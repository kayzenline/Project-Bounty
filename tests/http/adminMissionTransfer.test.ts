// tests/http/adminMissionTransfer.test.ts
import { beforeEach, describe, expect, test } from '@jest/globals';
import {
  userRegister,
  controlUserSessionId as missionCreate,
  deleteMission,
  clearRequest,
} from './requestHelpers';
import { adminMissionTransferRequest } from './requestHelpers';

const ERROR = { error: expect.any(String) };

let u1Session: string;
let u2Session: string;
let m1_u1: number;
let m2_u1: number; 
let m1_u2: number; 

beforeEach(() => {
  // Reset datastore
  const cleared = clearRequest();
  expect(cleared.statusCode).toBe(200);

  // Register two users
  const r1 = userRegister('user1@example.com', 'abc12345', 'John', 'Doe');
  expect(r1.statusCode).toBe(200);
  u1Session = r1.body.controlUserSessionId;

  const r2 = userRegister('user2@example.com', 'abc12345', 'Jane', 'Smith');
  expect(r2.statusCode).toBe(200);
  u2Session = r2.body.controlUserSessionId;

  // Create missions: U1 has M1/M2, U2 has M3
  const c11 = missionCreate(u1Session, 'MissionOne', 'Test Description', 'Mars');
  expect(c11.statusCode).toBe(200);
  m1_u1 = c11.body.missionId;

  const c12 = missionCreate(u1Session, 'MissionTwo', 'Test Description', 'Moon');
  expect(c12.statusCode).toBe(200);
  m2_u1 = c12.body.missionId;

  const c21 = missionCreate(u2Session, 'MissionThree', 'Test Description', 'ISS');
  expect(c21.statusCode).toBe(200);
  m1_u2 = c21.body.missionId;
});

describe('POST /v1/admin/mission/{missionid}/transfer', () => {
  describe('Success', () => {
    test('200 and {} - ownership transferred', async () => {
      const res = await adminMissionTransferRequest(u1Session, m2_u1, 'user2@example.com');
      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res.getBody())).toStrictEqual({});

      // Verify ownership change
      const delByU1 = deleteMission(u1Session, m2_u1);
      expect(delByU1.statusCode).toBe(403);
      expect(delByU1.body).toStrictEqual(ERROR);

      const delByU2 = deleteMission(u2Session, m2_u1);
      expect(delByU2.statusCode).toBe(200);
      expect(delByU2.body).toStrictEqual({});
    });
  });

  describe('Errors', () => {
    test('401: empty session', async () => {
      const res = await adminMissionTransferRequest('', m2_u1, 'user2@example.com');
      expect(res.statusCode).toBe(401);
      expect(JSON.parse(res.getBody())).toStrictEqual(ERROR);
    });

    test('401: invalid session', async () => {
      const badSession = u1Session + u2Session;
      const res = await adminMissionTransferRequest(badSession, m2_u1, 'user2@example.com');
      expect(res.statusCode).toBe(401);
      expect(JSON.parse(res.getBody())).toStrictEqual(ERROR);
    });

    test('403: mission not owned by user', async () => {
      const res = await adminMissionTransferRequest(u2Session, m2_u1, 'user1@example.com');
      expect(res.statusCode).toBe(403);
      expect(JSON.parse(res.getBody())).toStrictEqual(ERROR);
    });

    test('400: target email not found', async () => {
      const res = await adminMissionTransferRequest(u1Session, m2_u1, 'nobody@example.com');
      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res.getBody())).toStrictEqual(ERROR);
    });

    test('403: cannot transfer to self', async () => {
      const res = await adminMissionTransferRequest(u1Session, m2_u1, 'user1@example.com');
      expect(res.statusCode).toBe(403);
      expect(JSON.parse(res.getBody())).toStrictEqual(ERROR);
    });

    test('403: target already has same mission name', async () => {
      const dup = missionCreate(u2Session, 'MissionTwo', 'other', 'other');
      expect(dup.statusCode).toBe(200);

      const res = await adminMissionTransferRequest(u1Session, m2_u1, 'user2@example.com');
      expect(res.statusCode).toBe(403);
      expect(JSON.parse(res.getBody())).toStrictEqual(ERROR);
    });
  });
});