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
