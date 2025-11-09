import HTTPError from 'http-errors';
import { launchVehicleIdCheck, controlUserSessionIdCheck, normalizeError, throwErrorForFunction, findSessionFromSessionId } from './helper';
import { getData, LaunchVehicleInfo, missionLaunchState } from '../dataStore';

function notImplemented(): never {
  throw HTTPError(501, 'Not implemented');
}

export function adminLaunchVehicleCreate(
  controlUserSessionId: string,
  name: string,
  description: string,
  maxCrewWeight: number,
  maxPayloadWeight: number,
  launchVehicleWeight: number,
  thrustCapacity: number,
  maneuveringFuel: number
) {
  return notImplemented();
}

export function adminLaunchVehicleDetails(controlUserSessionId: string) {
  try {
    controlUserSessionIdCheck(controlUserSessionId);
    const session = findSessionFromSessionId(controlUserSessionId);
    if (!session) {
      throw HTTPError(401, 'ControlUserSessionId is empty or invalid');
    }

    const data = getData();
    const launchVehicles = data.launchVehicles
      .filter(vehicle => !vehicle.retired)
      .map(vehicle => {
        const assigned = data.launches.some(launch =>
          launch.assignedLaunchVehicleId === vehicle.launchVehicleId &&
          launch.state !== missionLaunchState.ON_EARTH
        );
        return {
          launchVehicleId: vehicle.launchVehicleId,
          name: vehicle.name,
          assigned
        };
      });

    return { launchVehicles };
  } catch (e) {
    const ne = normalizeError(e);
    throwErrorForFunction(ne.errorCategory, ne.error);
  }
}

export function adminLaunchVehicleInfo(
  controlUserSessionId: string,
  launchVehicleId: number
): LaunchVehicleInfo {
  try {
    controlUserSessionIdCheck(controlUserSessionId);
    const vehicle = launchVehicleIdCheck(launchVehicleId);

    const launches = getData().launches
      .filter(l => l.assignedLaunchVehicleId === launchVehicleId)
      .map(l => ({
        launch: `[${l.missionCopy.target}] ${l.missionCopy.name} - ${l.createdAt}`,
        state: l.state
      }));

    return {
      launchVehicleId: vehicle.launchVehicleId,
      name: vehicle.name,
      description: vehicle.description,
      maxCrewWeight: vehicle.maxCrewWeight,
      maxPayloadWeight: vehicle.maxPayloadWeight,
      launchVehicleWeight: vehicle.launchVehicleWeight,
      thrustCapacity: vehicle.thrustCapacity,
      startingManeuveringFuel: vehicle.maneauveringFuel,
      retired: vehicle.retired,
      timeAdded: vehicle.timeAdded,
      timeLastEdited: vehicle.timeLastEdited,
      launches
    };
  } catch (e) {
    const ne = normalizeError(e);
    throwErrorForFunction(ne.errorCategory, ne.error);
  }
}

export function adminLaunchVehicleEdit(
  controlUserSessionId: string,
  launchVehicleId: number,
  name: string,
  description: string,
  maxCrewWeight: number,
  maxPayloadWeight: number,
  launchVehicleWeight: number,
  thrustCapacity: number,
  maneuveringFuel: number
) {
  return notImplemented();
}

export function adminLaunchVehicleRetire(
  controlUserSessionId: string,
  launchVehicleId: number
) {
  return notImplemented();
}
