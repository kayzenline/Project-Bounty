import request from 'sync-request-curl';
import config from '../../src/config.json';

const { port, url } = config;
const SERVER_URL = `${url}:${port}`;

export function adminMissionTransferRequest(
  controlUserSessionId: string,
  missionId: number,
  userEmail: string
) {
  let response = request('POST', `${SERVER_URL}/v1/admin/mission/${missionId}/transfer`, {
    json: { userEmail },
    headers: { controlusersessionid: controlUserSessionId }
  });
  return response;
}

export function userRegister(
  email: string,
  passward: string,
  nameFirst: string,
  nameLast: string
) {
  const response = request('POST', `${SERVER_URL}/v1/admin/auth/register`, {
    json: {
      email,
      passward,
      nameFirst,
      nameLast
    }
  });

  return {
    statusCode: response.statusCode,
    body: JSON.parse(response.body.toString())
  };
}

export function controlUserSessionId(
  sessionId: string,
  name: string,
  description: string,
  target: string
) {
  const response = request('POST', `${SERVER_URL}/v1/admin/mission`, {
    json: {
      name,
      description,
      target
    },
    headers: { controlusersessionid: sessionId }
  });

  return {
    statusCode: response.statusCode,
    body: JSON.parse(response.body.toString())
  };
}
