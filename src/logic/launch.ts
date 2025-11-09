import HTTPError from 'http-errors';
import { getData, setData } from '../dataStore';
import { findSessionFromSessionId } from './helper';
import { LaunchCalcParameters, PayloadInput, missionLaunchAction } from '../dataStore';

function notImplemented(): never {
  throw HTTPError(501, 'Not implemented');
}

export function adminLaunchList(controlUserSessionId: string) {
  return notImplemented();
}

export function adminMissionLaunchOrganise(
  controlUserSessionId: string,
  missionId: number,
  launchVehicleId: number,
  payload: PayloadInput,
  launchParameters: LaunchCalcParameters
) {
  return notImplemented();
}

export function adminMissionLaunchDetails(
  controlUserSessionId: string,
  missionId: number,
  launchId: number
) {
  return notImplemented();
}

export function adminMissionLaunchStatusUpdate(
  controlUserSessionId: string,
  missionId: number,
  launchId: number,
  action: missionLaunchAction
) {
  return notImplemented();
}

export function adminMissionLaunchAllocate(
  controlUserSessionId: string,
  missionId: number,
  launchId: number,
  astronautId: number
) {
  return notImplemented();
}

export function adminMissionLaunchRemove(
  controlUserSessionId: string,
  missionId: number,
  launchId: number,
  astronautId: number
) {
  return notImplemented();
}
