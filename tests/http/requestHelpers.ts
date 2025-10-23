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
  return {
    statusCode: response.statusCode,
    body: JSON.parse(response.body.toString())
  };
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

  return {
    statusCode: response.statusCode,
    body: JSON.parse(response.body.toString())
  };
}

export function adminAuthUserLoginRequest(email: string, password: string) {
  const response = request('POST', `${SERVER_URL}/v1/admin/auth/login`, {
    json: {
      email,
      password,
    },
  });
  return {
    statusCode: response.statusCode,
    body: JSON.parse(response.body.toString()),
  };
}

export function adminAuthUserLogoutRequest(sessionId: string) {
  const response = request('POST', `${SERVER_URL}/v1/admin/auth/logout`, {
    headers: { controlusersessionid: sessionId }
  });
  return {
    statusCode: response.statusCode,
    body: JSON.parse(response.body.toString()),
  };
}

export function adminAuthUserDetailsRequest(controlUserSessionId: string) {
  const response = request('GET', `${SERVER_URL}/v1/admin/controluser/details`, {
    headers: { ControlUserSessionId: controlUserSessionId }
  });
  return {
    statusCode: response.statusCode,
    body: JSON.parse(response.body.toString())
  };
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
  return {
    statusCode: response.statusCode,
    body: JSON.parse(response.body.toString())
  };
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
  return {
    statusCode: response.statusCode,
    body: JSON.parse(response.body.toString())
  };
}

export function adminMissionCreateRequest(
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
    headers: { controlUserSessionId: sessionId }
  });

  return {
    statusCode: response.statusCode,
    body: JSON.parse(response.body.toString())
  };
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

  return {
    statusCode: response.statusCode,
    body: JSON.parse(response.body.toString())
  };
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

  return {
    statusCode: response.statusCode,
    body: JSON.parse(response.body.toString())
  };
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

  return {
    statusCode: response.statusCode,
    body: JSON.parse(response.body.toString())
  };
}

export function adminMissionDeleteRequest(
  controlUserSessionId: string,
  missionId: number
) {
  const res = request('DELETE', `${SERVER_URL}/v1/admin/mission/${missionId}`, {
    headers: { controlUserSessionId: controlUserSessionId }
  });

  return {
    statusCode: res.statusCode,
    body: JSON.parse(res.body.toString())
  };
}

export function adminMissionInfoRequest(
  controlUserSessionId: string,
  missionId: number
) {
  const res = request('GET', `${SERVER_URL}/v1/admin/mission/${missionId}`, {
    headers: { controlUserSessionId: controlUserSessionId },
  });

  return {
    statusCode: res.statusCode,
    body: JSON.parse(res.body.toString())
  };
}

export function adminAstronautPoolRequest(
  controlUserSessionId: string
) {
  const res = request('GET', `${SERVER_URL}/v1/admin/astronaut/pool`, {
    headers: { controlUserSessionId: controlUserSessionId },
  });

  return {
    statusCode: res.statusCode,
    body: JSON.parse(res.body.toString())
  };
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
  const res = request('POST', `${SERVER_URL}/v1/admin/astronaut`, {
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

  return {
    statusCode: res.statusCode,
    body: JSON.parse(res.body.toString())
  };
}

export function adminAstronautDeleteRequest(
  controlUserSessionId: string,
  astronautId: number
) {
  const res = request('POST', `${SERVER_URL}/v1/admin/astronaut/${astronautId}`, {
    headers: { controUserSessionId: controlUserSessionId },
  });

  return {
    statusCode: res.statusCode,
    body: JSON.parse(res.body.toString())
  };
}

export function adminAstronautInfoRequest(
  controlUserSessionId: string,
  astronautId: number
) {
  const res = request('GET', `${SERVER_URL}/v1/admin/astronaut/${astronautId}`, {
    headers: { controlUserSessionId: controlUserSessionId },
  });

  return {
    statusCode: res.statusCode,
    body: JSON.parse(res.body.toString())
  };
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
  const res = request('POST', `${SERVER_URL}/v1/admin/astronaut/${astronautId}`, {
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

  return {
    statusCode: res.statusCode,
    body: JSON.parse(res.body.toString())
  };
}

export function adminAstronautAssignRequest(
  controlUserSessionId: string,
  astronautid: number,
  missionid: number
) {
  const res = request('POST', `${SERVER_URL}/v1/admin/mission/${missionid}/assign/${astronautid}`, {
    headers: { controlUserSessionId: controlUserSessionId },
  });
  return {
    statusCode: res.statusCode,
    body: JSON.parse(res.body.toString())
  };
}

export function adminAstronautUnassignRequest(
  controlUserSessionId: string,
  astronautid: number,
  missionid: number
) {
  const res = request('DELETE', `${SERVER_URL}/v1/admin/mission/${missionid}/assign/${astronautid}`, {
    headers: { controlUserSessionId: controlUserSessionId },
  });
  return {
    statusCode: res.statusCode,
    body: JSON.parse(res.body.toString())
  };
}

export function adminMissionListRequest(
  controlUserSessionId: string
) {
  const res = request('GET', `${SERVER_URL}/v1/admin/mission/list`, {
    headers: { controlUserSessionId: controlUserSessionId },
  });
  return {
    statusCode: res.statusCode,
    body: JSON.parse(res.body.toString())
  };
}

export function clearRequest() {
  const res = request('DELETE', `${SERVER_URL}/v1/clear`);
  return {
    statusCode: res.statusCode,
    body: JSON.parse(res.body.toString()),
  };
}
