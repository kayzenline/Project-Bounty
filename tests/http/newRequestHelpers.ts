import request from 'sync-request-curl';
import config from '../../src/config.json';
const { port, url } = config;
const SERVER_URL = `${url}:${port}`;

export function adminMissionAstronautUnassignRequest(
  controlUserSessionId: string,
  astronautid: number,
  missionid: number
) {
  const res = request('DELETE', `${SERVER_URL}/v2/admin/mission/${missionid}/assign/${astronautid}`, {
    headers: { controlUserSessionId: controlUserSessionId }
  });
  return res;
}

export function adminLaunchVehicleCreateRequest(
  controlUserSessionId: string,
  name: string,
  description: string,
  maxCrewWeight: number,
  maxPayloadWeight: number,
  launchVehicleWeight: number,
  thrustCapacity: number,
  maneuveringFuel: number
) {
  const res = request('POST', `/v1/admin/launchvehicle`, {
    headers: { controlUserSessionId: controlUserSessionId },
    json: {
      name,
      description,
      maxCrewWeight,
      maxPayloadWeight,
      launchVehicleWeight,
      thrustCapacity,
      maneuveringFuel
    }
  });
  return res;
}

export function adminLaunchVehicleInfoRequest(
  controlUserSessionId: string,
  launchvehicleid: number
) {
  const res = request('GET', `/v1/admin/launchvehicle/${launchvehicleid}`, {
    headers: { controlUserSessionId: controlUserSessionId }
  });
  return res;
}

export function adminMissionLaunchOrganiseRequest(
  controlUserSessionId: string,
  missionid: number,
  payload: {
    description: string,
    weight: number
  },
  launchParameters: {
    targetDistance: number,
    fuelBurnRate: number,
    thrustFuel: number,
    activeGravityForce: number,
    maneuveringDelay: number
  }
) {
  const res = request('POST', `/v1/admin/mission/${missionid}/launch`, {
    headers: { controlUserSessionId: controlUserSessionId },
    json: {
      payload,
      launchParameters
    }
  });
  return res;
}

export function adminMissionLaunchDetailsRequest(
  controlUserSessionId: string,
  missionid: number,
  launchid: number
) {
  const res = request('GET', `/v1/admin/mission/${missionid}/launch/${launchid}`, {
    headers: { controlUserSessionId: controlUserSessionId }
  });
  return res;
}

export function adminMissionLaunchStatusUpdateRequest(
  controlUserSessionId: string,
  missionid: number,
  launchid: number,
  action: string
) {
  const res = request('PUT', `/v1/admin/mission/${missionid}/launch/${launchid}/status`, {
    headers: { controlUserSessionId: controlUserSessionId },
    json: {
      action
    }
  });
  return res;
}

export function adminLaunchVehicleDetailsRequest(
  controlUserSessionId: string
) {
  const res = request('GET', `/v1/admin/launchvehicle/list`, {
    headers: { controlUserSessionId: controlUserSessionId }
  });
  return res;
}

export function adminLaunchVehicleRetireRequest(
  controlUserSessionId: string,
  launchvehicleid: number
) {
  const res = request('DELETE', `/v1/admin/launchvehicle/${launchvehicleid}`, {
    headers: { controlUserSessionId: controlUserSessionId }
  });
  return res;
}

export function adminLaunchVehicleEditRequest(
  controlUserSessionId: string,
  launchvehicleid: number,
  name: string,
  description: string,
  maxCrewWeight: number,
  maxPayloadWeight: number,
  launchVehicleWeight: number,
  thrustCapacity: number,
  maneuveringFuel: number
) {
  const res = request('PUT', `/v1/admin/launchvehicle/${launchvehicleid}`, {
    headers: { controlUserSessionId: controlUserSessionId },
    json: {
      name,
      description,
      maxCrewWeight,
      maxPayloadWeight,
      launchVehicleWeight,
      thrustCapacity,
      maneuveringFuel
    }
  });
  return res;
}

export function adminLaunchDetailsRequest(
  controlUserSessionId: string
) {
  const res = request('GET', `/v1/admin/launch/list`, {
    headers: { controlUserSessionId: controlUserSessionId }
  });
  return res;
}

export function adminMissionLaunchAllocateRequest(
  controlUserSessionId: string,
  astronautid: number,
  missionid: number,
  launchid: number
) {
  const res = request('POST', `/v1/admin/mission/${missionid}/launch/${launchid}/allocate/${astronautid}`, {
    headers: { controlUserSessionId: controlUserSessionId }
  });
  return res;
}

export function adminMissionLaunchRemoveRequest(
  controlUserSessionId: string,
  astronautid: number,
  missionid: number,
  launchid: number
) {
  const res = request('DELETE', `/v1/admin/mission/${missionid}/launch/${launchid}/allocate/${astronautid}`, {
    headers: { controlUserSessionId: controlUserSessionId }
  });
  return res;
}
