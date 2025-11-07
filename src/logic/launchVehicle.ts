import HTTPError from 'http-errors';

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
) {
  return notImplemented();
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
