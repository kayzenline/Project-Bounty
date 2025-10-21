import request from 'sync-request-curl';
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
    { controlUserSessionId } 
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

export function userRegister(
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

export function userLogin(email: string, password: string) {
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

export function userLogout(sessionId: string) {
  const response = request('POST', `${SERVER_URL}/v1/admin/auth/logout`, {
    headers: { controlusersessionid: sessionId }
  });
  return {
    statusCode: response.statusCode,
    body: JSON.parse(response.body.toString()),
  };
}

/* export function userLogin(email: string, password: string) {
  const res = request('POST', `${SERVER_URL}/v1/admin/auth/login`, {
    json: {
      email,
      password,
    },
  });
  return JSON.parse(res.body.toString())
}

export function userLogout(token: string) {
  const res = request('POST', `${SERVER_URL}/v1/admin/auth/logout`, {
    json: {
      token,
    },
  });
  return JSON.parse(res.body.toString())
} */

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
    headers: { controlUserSessionId: sessionId }
  });

  return {
    statusCode: response.statusCode,
    body: JSON.parse(response.body.toString())
  };
}

export function missionNameUpdate(
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

export function missionTargetUpdate(
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

export function missionDescriptionUpdate(
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

export function deleteMission(
  sessionId: string,
  missionId: number
) {
  const res = request('DELETE', `${SERVER_URL}/v1/admin/mission/${missionId}`, {
    headers: { controlUserSessionId: sessionId }
  });

  return {
    statusCode: res.statusCode,
    body: JSON.parse(res.body.toString())
  }
}

export function createAstronautId(
  sessionId: string,
  nameFirst: string,
  nameLast: string,
  rank: string,
  age: number,
  weight: number,
  height: number
) {
  const res = request('POST', `${SERVER_URL}/v1/admin/astronaut`, {
    headers: { controlUserSessionId: sessionId },
    json: {
      nameFirst,
      nameLast,
      rank,
      age,
      weight,
      height,
    }
  });

  return {
    statusCode: res.statusCode,
    body: JSON.parse(res.body.toString())
  }
}

export function assignAstronaut(
  controlUserSessionId: string,
  astronautid: number,
  missionid: number,
) {
  const res = request('POST', `${SERVER_URL}/v1/admin/mission/${missionid}/assign/${astronautid}`, {
    headers: { controlUserSessionId: controlUserSessionId },
  })
  return {
    statusCode: res.statusCode,
    body: JSON.parse(res.body.toString())
  }
}



export function missionList(
  controlUserSessionId: string
){
  const res = request('GET', `${SERVER_URL}/v1/admin/mission/list`, {
    headers: { controlUserSessionId: controlUserSessionId },
  })
  return {
    statusCode: res.statusCode,
    body: JSON.parse(res.body.toString())
  }
}


export function clearRequest() {
  const res = request('DELETE', `${SERVER_URL}/v1/clear`);
  return {
    statusCode: res.statusCode,
    body: JSON.parse(res.body.toString()),
  }
};