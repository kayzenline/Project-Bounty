import HTTPError from 'http-errors';
import { launchVehicleIdCheck, controlUserSessionIdCheck, normalizeError, throwErrorForFunction } from './helper';
import { getData, LaunchVehicleInfo } from '../dataStore';

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
  return notImplemented();
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
