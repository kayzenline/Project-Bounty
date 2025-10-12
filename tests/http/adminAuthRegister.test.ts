import { adminAuthRegisterRequest } from './requestHelpers';
import { v4 as uuid } from 'uuid';
import config from '../../src/config.json';
// no need for curl/execSync; use fetch for readiness checks

// Start server once for the test suite
let serverStartedByTest = false;

beforeAll(async () => {
  const { url, port } = config as { url: string; port: string };
  const base = `${url}:${port}`;

  // Check if server is already running
  let reachable = false;
  try {
    const r = await fetch(`${base}/echo?echo=ready`);
    reachable = r.ok;
  } catch {
    // unreachable; we'll start it below
  }

  if (!reachable) {
    // Start server for tests
    require('../../src/server');
    serverStartedByTest = true;
    // Poll until server responds
    for (let i = 0; i < 40; i++) {
      try {
        const r = await fetch(`${base}/echo?echo=ready`);
        if (r.ok) break;
      } catch {}
      await new Promise(res => setTimeout(res, 100));
    }
  }
});

afterAll(async () => {
  if (serverStartedByTest) {
    const { stopServer } = require('../../src/server');
    await stopServer();
  }
});

function uniqueEmail(prefix = 'user') {
  return `${prefix}.${uuid()}@example.com`;
}

describe('POST /v1/admin/auth/register', () => {
  test('success: returns controlUserSessionId', async () => {
    const email = uniqueEmail('success');
    const res = await adminAuthRegisterRequest(email, 'abc12345', 'John', 'Doe');
    const body = JSON.parse(res.getBody());
    expect(res.statusCode).toBe(200);
    expect(body).toEqual({ controlUserSessionId: expect.any(String) });
  });

  test('error: invalid email format', async () => {
    const res = await adminAuthRegisterRequest('invalid-email', 'abc12345', 'John', 'Doe');
    const body = JSON.parse(res.getBody());
    expect(res.statusCode).toBe(400);
    expect(body).toEqual({ error: expect.any(String) });
  });

  test('error: duplicate email', async () => {
    const email = uniqueEmail('dup');
    const first = await adminAuthRegisterRequest(email, 'abc12345', 'John', 'Doe');
    expect(first.statusCode).toBe(200);
    const res = await adminAuthRegisterRequest(email, 'abc12345', 'John', 'Doe');
    const body = JSON.parse(res.getBody());
    expect(res.statusCode).toBe(400);
    expect(body).toEqual({ error: expect.any(String) });
  });

  test('error: nameFirst invalid characters', async () => {
    const res = await adminAuthRegisterRequest(uniqueEmail('nfchars'), 'abc12345', 'John!', 'Doe');
    const body = JSON.parse(res.getBody());
    expect(res.statusCode).toBe(400);
    expect(body).toEqual({ error: expect.any(String) });
  });

  test('error: nameFirst too short', async () => {
    const res = await adminAuthRegisterRequest(uniqueEmail('nfshort'), 'abc12345', 'A', 'Doe');
    const body = JSON.parse(res.getBody());
    expect(res.statusCode).toBe(400);
    expect(body).toEqual({ error: expect.any(String) });
  });

  test('error: nameLast invalid characters', async () => {
    const res = await adminAuthRegisterRequest(uniqueEmail('nlchars'), 'abc12345', 'John', 'Doe!');
    const body = JSON.parse(res.getBody());
    expect(res.statusCode).toBe(400);
    expect(body).toEqual({ error: expect.any(String) });
  });

  test('error: nameLast too long', async () => {
    const longName = 'A'.repeat(21);
    const res = await adminAuthRegisterRequest(uniqueEmail('nllong'), 'abc12345', 'John', longName);
    const body = JSON.parse(res.getBody());
    expect(res.statusCode).toBe(400);
    expect(body).toEqual({ error: expect.any(String) });
  });

  test('error: password too short', async () => {
    const res = await adminAuthRegisterRequest(uniqueEmail('pshort'), 'a1b2c3', 'John', 'Doe');
    const body = JSON.parse(res.getBody());
    expect(res.statusCode).toBe(400);
    expect(body).toEqual({ error: expect.any(String) });
  });

  test('error: password lacks number', async () => {
    const res = await adminAuthRegisterRequest(uniqueEmail('pnonum'), 'abcdefgh', 'John', 'Doe');
    const body = JSON.parse(res.getBody());
    expect(res.statusCode).toBe(400);
    expect(body).toEqual({ error: expect.any(String) });
  });

  test('error: password lacks letter', async () => {
    const res = await adminAuthRegisterRequest(uniqueEmail('pnolet'), '12345678', 'John', 'Doe');
    const body = JSON.parse(res.getBody());
    expect(res.statusCode).toBe(400);
    expect(body).toEqual({ error: expect.any(String) });
  });
});
