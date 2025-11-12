import { getData } from '../dataStore';
import { LaunchVehicleInfo, LaunchVehicleHistoryEntry } from '../dataStore';
// ITER 3 Launch Vehicle, Launch and Payload helper functions
// Launch Vehicale helper functions
export function controlUserSessionIdCheck(controlUserSessionId: string) {
  return getData().sessions.find(s => s.controlUserSessionId === controlUserSessionId);
}

export function missionIdCheck(controlUserSessionId: string, missionId: number) {
  const controlUserId = getData().sessions.find(s => s.controlUserSessionId === controlUserSessionId).controlUserId;
  return getData().spaceMissions.find(m => m.missionId === missionId && m.controlUserId === controlUserId);
}

export function astronautIdCheck(missionId: number, astronautId: number) {
  const mission = getData().spaceMissions.find(m => m.missionId === missionId);
  if (getData().astronauts.find(a => a.astronautId === astronautId) && mission.assignedAstronauts.find(a => a.astronautId === astronautId)) {
    return true;
  }
  return false;
}

export function launchVehicleNameValidityCheck(name: string): boolean {
  if (typeof name !== 'string') {
    return false;
  }
  const trimmedName = name.trim();
  // Name must be between 2 and 20 characters (inclusive)
  if (trimmedName.length < 2 || trimmedName.length > 20) {
    return false;
  }
  // Name can only contain letters, spaces, hyphens, or apostrophes
  return /^[a-zA-Z\s\-']+$/.test(trimmedName);
}

export function launchVehicleDescriptionValidityCheck(description: string): boolean {
  if (typeof description !== 'string') {
    return false;
  }
  const trimmedDescription = description.trim();
  // Description must be between 2 and 50 characters (inclusive)
  if (trimmedDescription.length < 2 || trimmedDescription.length > 50) {
    return false;
  }
  // Description can only contain letters, spaces, hyphens, or apostrophes
  return /^[a-zA-Z\s\-']+$/.test(trimmedDescription);
}

export function launchVehicleCrewWeightValidityCheck(maxCrewWeight: number): boolean {
  if (maxCrewWeight < 100 || maxCrewWeight > 1000) {
    return false;
  }
  return true;
}

export function launchVehiclePayloadWeightValidityCheck(maxPayloadWeight: number): boolean {
  if (maxPayloadWeight < 100 || maxPayloadWeight > 1000) {
    return false;
  }
  return true;
}

export function launchVehicleWeightValidityCheck(launchVehicleWeight: number): boolean {
  if (launchVehicleWeight < 1000 || launchVehicleWeight > 100000) {
    return false;
  }
  return true;
}

export function launchVehicleThrustCapacityValidityCheck(thrustCapacity: number): boolean {
  if (thrustCapacity < 100000 || thrustCapacity > 10000000) {
    return false;
  }
  return true;
}

export function launchVehicleManeuveringFuelValidityCheck(maneuveringFuel: number): boolean {
  if (maneuveringFuel < 10 || maneuveringFuel > 100) {
    return false;
  }
  return true;
}

export interface LaunchVehicleLaunchSummary {
  launchVehicleId: number,
  name: string,
  assigned: boolean
}

export function launchVehicleLaunchInfoHelper(launchVehicleId: number): LaunchVehicleInfo {
  const Launches = getData().launches.filter(l => l.assignedLaunchVehicleId === launchVehicleId);
  const launcHistore: LaunchVehicleHistoryEntry[] = [];
  const temp: LaunchVehicleHistoryEntry = {
    launch: '',
    state: ''
  };
  for (const launch of Launches) {
    temp.launch = `[${launch.missionCopy.target}] ${launch.missionCopy.name} - ${launch.missionCopy.timeCreated}`;
    temp.state = launch.state;
    launcHistore.push(temp);
  }
  const launch = getData().launchVehicles.find(l => l.launchVehicleId === launchVehicleId);
  if (launch) {
    const launchVehicleInfo: LaunchVehicleInfo = {
      launchVehicleId: launch.launchVehicleId,
      name: launch.name,
      description: launch.description,
      maxCrewWeight: launch.maxCrewWeight,
      maxPayloadWeight: launch.maxPayloadWeight,
      launchVehicleWeight: launch.launchVehicleWeight,
      thrustCapacity: launch.thrustCapacity,
      startingManeuveringFuel: launch.maneuveringFuel,
      retired: launch.retired,
      timeAdded: launch.timeAdded,
      timeLastEdited: launch.timeLastEdited,
      launches: launcHistore
    };
    return launchVehicleInfo;
  }
  return null;
}

export function launchVehicleIdCheck(launchVehicleId: number) : boolean {
  if (launchVehicleId <= getData().nextLaunchVehicleId - 1 && launchVehicleId > 0) {
    return true;
  }
  return false;
}
// Launch helper functions
export function launchIdCheck(launchId: number): boolean {
  if (getData().launches.find(l => l.launchId === launchId)) {
    return true;
  }
  return false;
}

interface PayLoad {
  description: string,
  weight: number
}

interface LaunchCalcParameters {
  targetDistance: number,
  fuelBurnRate: number,
  thrustFuel: number,
  activeGravityForce: number,
  maneuveringDelay: number
}

export function launchCalculationParameterCorrectnessCheck(launchVehicleId: number, payload: PayLoad, AstronautWeight: number, launchParams: LaunchCalcParameters): boolean {
  // w = w_l + w_p + w_a
  const launchVehicle = getData().launchVehicles.find(l => l.launchVehicleId === launchVehicleId);
  const totleWeight = launchVehicle.launchVehicleWeight + payload.weight + AstronautWeight;
  // t = thrust fuel divided by burn rate
  const time = launchParams.thrustFuel / launchParams.fuelBurnRate;
  // Fnet = T - w*g
  const Fnet = launchVehicle.thrustCapacity - totleWeight * launchParams.activeGravityForce;
  const accelerate = Fnet / totleWeight;
  // h = g * t^2 / 2;
  const height = accelerate * time * time / 2;
  if (height < launchParams.targetDistance) {
    return false;
  } else {
    return true;
  }
}
