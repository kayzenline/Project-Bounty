import request from 'sync-request-curl';
import config from '../../src/config.json';
const { port, url } = config;
const SERVER_URL = `${url}:${port}`;

export function adminMissionTransferRequest(
  controlUserSessionId: string,
  missionId: number,
  email: string
) {
  const response = request('POST', `${SERVER_URL}/v1/admin/mission/${missionId}/transfer`, {
    headers: { controlusersessionid: controlUserSessionId },
    json: {
      email
    }
  });
  return response;
}

export function adminAuthUserRegisterRequest(
  email: string,
  password: string,
  nameFirst: string,
  nameLast: string
) {
  const response = request('POST', `${SERVER_URL}/v1/admin/auth/register`, {
    json: {
      email,
      password,
      nameFirst,
      nameLast
    }
  });
  return response;
}

export function adminAuthUserLoginRequest(email: string, password: string) {
  const response = request('POST', `${SERVER_URL}/v1/admin/auth/login`, {
    json: {
      email,
      password,
    }
  });
  return response;
}

export function adminAuthUserLogoutRequest(controlUserSessionId: string) {
  const response = request('POST', `${SERVER_URL}/v1/admin/auth/logout`, {
    headers: { controlusersessionid: controlUserSessionId }
  });
  return response;
}

export function adminAuthUserDetailsRequest(controlUserSessionId: string) {
  const response = request('GET', `${SERVER_URL}/v1/admin/controluser/details`, {
    headers: { ControlUserSessionId: controlUserSessionId }
  });
  return response;
}

export function adminAuthUserPasswordUpdateRequest(
  controlUserSessionId: string,
  oldPassword: string,
  newPassword: string
) {
  const response = request('PUT', `${SERVER_URL}/v1/admin/controluser/password`, {
    headers: { ControlUserSessionId: controlUserSessionId },
    json: { oldPassword, newPassword }
  });
  return response;
}

export function adminAuthUserDetailsUpdateRequest(
  controlUserSessionId: string,
  email: string,
  nameFirst: string,
  nameLast: string
) {
  const response = request('PUT', `${SERVER_URL}/v1/admin/controluser/details`, {
    headers: { ControlUserSessionId: controlUserSessionId },
    json: { email, nameFirst, nameLast }
  });
  return response;
}

export function adminMissionCreateRequest(
  controlUserSessionId: string,
  name: string,
  description: string,
  target: string
) {
  const response = request('POST', `${SERVER_URL}/v1/admin/mission`, {
    headers: { controlUserSessionId: controlUserSessionId },
    json: {
      name,
      description,
      target
    }
  });
  return response;
}

export function adminMissionNameUpdateRequest(
  controlUserSessionId: string,
  missionId: number,
  name: string
) {
  const response = request('PUT', `${SERVER_URL}/v1/admin/mission/${missionId}/name`, {
    headers: { controlUserSessionId: controlUserSessionId },
    json: {
      name
    }
  });
  return response;
}

export function adminMissionTargetUpdateRequest(
  controlUserSessionId: string,
  missionId: number,
  target: string
) {
  const response = request('PUT', `${SERVER_URL}/v1/admin/mission/${missionId}/target`, {
    headers: { controlUserSessionId: controlUserSessionId },
    json: {
      target
    }
  });
  return response;
}

export function adminMissionDescriptionUpdateRequest(
  controlUserSessionId: string,
  missionId: number,
  description: string
) {
  const response = request('PUT', `${SERVER_URL}/v1/admin/mission/${missionId}/description`, {
    headers: { controlUserSessionId: controlUserSessionId },
    json: {
      description
    }
  });

  return response;
}

export function adminMissionDeleteRequest(
  controlUserSessionId: string,
  missionId: number
) {
  const response = request('DELETE', `${SERVER_URL}/v1/admin/mission/${missionId}`, {
    headers: { controlUserSessionId: controlUserSessionId }
  });

  return response;
}

export function adminMissionInfoRequest(
  controlUserSessionId: string,
  missionId: number
) {
  const response = request('GET', `${SERVER_URL}/v1/admin/mission/${missionId}`, {
    headers: { controlUserSessionId: controlUserSessionId }
  });

  return response;
}

export function adminAstronautPoolRequest(
  controlUserSessionId: string
) {
  const response = request('GET', `${SERVER_URL}/v1/admin/astronaut/pool`, {
    headers: { controlUserSessionId: controlUserSessionId }
  });

  return response;
}

export function adminAstronautCreateRequest(
  controlUserSessionId: string,
  nameFirst: string,
  nameLast: string,
  rank: string,
  age: number,
  weight: number,
  height: number
) {
  const response = request('POST', `${SERVER_URL}/v1/admin/astronaut`, {
    headers: { controlUserSessionId: controlUserSessionId },
    json: {
      nameFirst,
      nameLast,
      rank,
      age,
      weight,
      height
    }
  });
  return response;
}

export function adminAstronautDeleteRequest(
  controlUserSessionId: string,
  astronautId: number
) {
  const response = request('DELETE', `${SERVER_URL}/v1/admin/astronaut/${astronautId}`, {
    headers: { controlUserSessionId: controlUserSessionId }
  });
  return response;
}

export function adminAstronautInfoRequest(
  controlUserSessionId: string,
  astronautId: number
) {
  const response = request('GET', `${SERVER_URL}/v1/admin/astronaut/${astronautId}`, {
    headers: { controlUserSessionId: controlUserSessionId }
  });
  return response;
}

export function adminAstronautEditRequest(
  controlUserSessionId: string,
  astronautId: number,
  nameFirst: string,
  nameLast: string,
  rank: string,
  age: number,
  weight: number,
  height: number
) {
  const response = request('PUT', `${SERVER_URL}/v1/admin/astronaut/${astronautId}`, {
    headers: { controlUserSessionId: controlUserSessionId },
    json: {
      nameFirst,
      nameLast,
      rank,
      age,
      weight,
      height
    }
  });
  return response;
}

export function adminAstronautAssignRequest(
  controlUserSessionId: string,
  astronautid: number,
  missionid: number
) {
  const response = request('POST', `${SERVER_URL}/v1/admin/mission/${missionid}/assign/${astronautid}`, {
    headers: { controlUserSessionId: controlUserSessionId }
  });
  return response;
}

export function adminAstronautUnassignRequest(
  controlUserSessionId: string,
  astronautid: number,
  missionid: number
) {
  const response = request('DELETE', `${SERVER_URL}/v1/admin/mission/${missionid}/assign/${astronautid}`, {
    headers: { controlUserSessionId: controlUserSessionId }
  });
  return response;
}

export function adminMissionListRequest(
  controlUserSessionId: string
) {
  const response = request('GET', `${SERVER_URL}/v1/admin/mission/list`, {
    headers: { controlUserSessionId: controlUserSessionId }
  });
  return response;
}

export function clearRequest() {
  const response = request('DELETE', `${SERVER_URL}/v1/clear`);
  return response;
}
