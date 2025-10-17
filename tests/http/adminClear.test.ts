import fs from 'fs';
import path from 'path';
import request from 'sync-request-curl';
import config from '../../src/config.json';
import { clearRequest } from './requestHelpers';
const { port, url } = config;
const SERVER_URL = `${url}:${port}`;
const DB_PATH = path.join(__dirname, '../../src/db.json');

const readDb = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

describe('DELETE /v1/clear', () => {
  beforeEach(() => {
    const first = clearRequest();
    expect(first.statusCode).toBe(200);

    const reg = request('POST', `${SERVER_URL}/v1/admin/auth/register`, {
      json: {
        email: `user${Date.now()}@test.com`,
        password: 'GoodPass123',
        nameFirst: 'Bill',
        nameLast: 'Ryker',
      },
    });
    expect(reg.statusCode).toBe(200);

    const dbBefore = readDb();
    expect(Array.isArray(dbBefore.controlUsers)).toBe(true);
    expect(dbBefore.controlUsers.length).toBeGreaterThan(0);
  });

  test('returns 200 and {}', () => {
    const res = clearRequest();
    expect(res.statusCode).toBe(200);
    expect(res.body).toStrictEqual({});
  });

  test('datastore fully reset after clear', () => {
    const cleared = clearRequest();
    expect(cleared.statusCode).toBe(200);
    expect(cleared.body).toStrictEqual({});

    const dbAfter = readDb();
    expect(dbAfter.controlUsers).toHaveLength(0);
    expect(dbAfter.spaceMissions).toHaveLength(0);
    expect(dbAfter.sessions).toHaveLength(0);
    expect(dbAfter.nextControlUserId).toBe(1);
    expect(dbAfter.nextMissionId).toBe(1);
  });
});
