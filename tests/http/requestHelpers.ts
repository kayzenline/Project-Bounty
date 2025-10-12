import config from '../../src/config.json';

const { port, url } = config;
const SERVER_URL = `${url}:${port}`;

async function httpRequest(method: string, url: string, body?: any, headers: Record<string, string> = {}) {
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  return {
    statusCode: res.status,
    getBody: () => text,
  };
}

export async function adminMissionTransferRequest(
  controlUserSessionId: string,
  missionId: number,
  userEmail: string
) {
  return httpRequest(
    'POST',
    `${SERVER_URL}/v1/admin/mission/${missionId}/transfer`,
    { userEmail },
    { controlusersessionid: controlUserSessionId }
  );
}

export async function adminAuthRegisterRequest(
  email: string,
  password: string,
  nameFirst: string,
  nameLast: string
) {
  return httpRequest('POST', `${SERVER_URL}/v1/admin/auth/register`, {
    email, password, nameFirst, nameLast
  });
}
