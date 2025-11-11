import HTTPError from 'http-errors';
import {
  controlUserSessionIdCheck,
  missionIdCheck,
  launchIdCheck,
  astronautIdCheck,
  launchVehicleIdCheck,
  launchCalculationParameterCorrectnessCheck
} from './newHelperfunctions';
import { LaunchCalcParameters, missionLaunchState, PayloadInput, Mission, Launch, getData, missionLaunchAction, Payload, setData } from '../dataStore';

function notImplemented(): never {
  throw HTTPError(501, 'Not implemented');
}

export function adminLaunchList(controlUserSessionId: string) {
  // Throw Errors
  // controlUserSessionId
  const controlUserId = controlUserSessionIdCheck(controlUserSessionId);
  if (!controlUserId) {
    throw HTTPError(401, 'ControlUserSessionId is empty or invalid');
  }

  const activeLaunches: number[] = [];
  const completedLaunches: number[] = [];
  const data = getData();
  for (const launch of data.launches) {
    if (launch.state === 'MISSION_COMPLETE') {
      completedLaunches.push(launch.launchId);
    } else {
      activeLaunches.push(launch.launchId);
    }
  }
  return { activeLaunches: activeLaunches, completedLaunches: completedLaunches };
}

export function adminMissionLaunchOrganise(
  controlUserSessionId: string,
  missionId: number,
  launchVehicleId: number,
  payload: PayloadInput,
  launchParameters: LaunchCalcParameters
) {
  // Throw Errors
  // controlUserSessionId
  const controlUserId = controlUserSessionIdCheck(controlUserSessionId);
  if (!controlUserId) {
    throw HTTPError(401, 'ControlUserSessionId is empty or invalid');
  }
  // missionId
  if (!missionIdCheck(controlUserSessionId, missionId)) {
    throw HTTPError(403, 'MissionId is empty, invalid or not associated with the current controlUser');
  }
  // launchVehicleId
  if (!launchVehicleIdCheck(launchVehicleId)) {
    throw HTTPError(400, 'launchvehicleid is invalid');
  }
  if (getData().launches.find(l => l.assignedLaunchVehicleId === launchVehicleId && l.state !== 'ON_EARTH')) {
    throw HTTPError(400, 'launchvehicleid is currently in another active launch');
  }
  const launchVehicle = getData().launchVehicles.find(l => l.launchVehicleId === launchVehicleId);
  if (launchVehicle.retired === true) {
    throw HTTPError(400, 'launchvehicleid refers to a Launch Vehicle that is retired');
  }
  // payload
  if (payload.description.length > 400 || payload.description === '') {
    throw HTTPError(400, 'Payload description is empty or greater than 400 characters');
  }
  if (payload.weight > launchVehicle.maxPayloadWeight) {
    throw HTTPError(400, 'Payload weight is greater than the maximum payload weight for the launch vehicle');
  }
  // LaunchCalculationParameters
  if (
    launchParameters.activeGravityForce < 0 ||
    launchParameters.fuelBurnRate < 0 ||
    launchParameters.targetDistance < 0 ||
    launchParameters.thrustFuel < 0
  ) {
    throw HTTPError(400, 'Any LaunchCalculationParameters is < 0');
  }
  if (launchParameters.maneuveringDelay < 1) {
    throw HTTPError(400, 'manueveringDelay is < 1');
  }
  if (launchParameters.fuelBurnRate > launchParameters.thrustFuel) {
    throw HTTPError(400, 'fuelBurnRate > thrustFuel');
  }
  if (!launchCalculationParameterCorrectnessCheck(launchVehicleId, payload, 0, launchParameters)) {
    throw HTTPError(400, 'An initial calculation with these LaunchCalculationParameters are invalid');
  }

  const data = getData();
  const currentTime = Math.floor(Date.now() / 1000);
  const launch: Launch = {
    launchId: data.newtLaunchId,
    missionCopy: data.spaceMissions.find(m => m.missionId === missionId),
    createdAt: currentTime,
    state: missionLaunchState.READY_TO_LAUNCH,
    assignedLaunchVehicleId: launchVehicleId,
    remainingLaunchVehicleManeuveringFuel: data.launchVehicles.find(l => l.launchVehicleId === launchVehicleId).maneuveringFuel,
    payloadId: data.payload.find(p => p.description === payload.description).payloadId,
    allocatedAstronauts: [],
    launchCalculationParameters: launchParameters
  };
  data.launches.push(launch);
  data.newtLaunchId++;
  setData(data);

  return { launchId: launch.launchId };
}

export function adminMissionLaunchDetails(
  controlUserSessionId: string,
  missionId: number,
  launchId: number
) {
  // Throw Errors
  // controlUserSessionId
  const controlUserId = controlUserSessionIdCheck(controlUserSessionId);
  if (!controlUserId) {
    throw HTTPError(401, 'ControlUserSessionId is empty or invalid');
  }
  // missionId
  if (!missionIdCheck(controlUserSessionId, missionId)) {
    throw HTTPError(403, 'MissionId is empty, invalid or not associated with the current controlUser');
  }
  // launchId
  if (!launchIdCheck(launchId)) {
    throw HTTPError(400, 'launchid is invalid');
  }

  interface launchVehicle {
    launchVehicleId: number,
    name: string,
    maneuveringFuelRemaining: number
  }

  interface allocatedAstronaut {
    astronautId: number,
    designation: string
  }

  interface launchDetails {
    launchId: number,
    missionCopy: Mission,
    timeCreated: number,
    state: missionLaunchState,
    launchVehicle: launchVehicle,
    payload: Payload,
    allocatedAstronauts: allocatedAstronaut[],
    launchCalculationParameters: LaunchCalcParameters
  }

  const data = getData();
  const launch = data.launches.find(l => l.launchId === launchId);
  const Vehicle = data.launchVehicles.find(l => l.launchVehicleId === launch.assignedLaunchVehicleId);
  const assignedVehicle: launchVehicle = {
    launchVehicleId: Vehicle.launchVehicleId,
    name: Vehicle.name,
    maneuveringFuelRemaining: Vehicle.maneuveringFuel
  };
  const payload = data.payload.find(p => p.payloadId === launch.payloadId);
  const Astronauts: allocatedAstronaut[] = [];
  const Astronaut: allocatedAstronaut = {
    astronautId: null,
    designation: ''
  };

  for (const astronautId of launch.allocatedAstronauts) {
    const astronaut = data.astronauts.find(a => a.astronautId === astronautId);
    Astronaut.astronautId = astronautId;
    Astronaut.designation = `${astronaut.rank} ${astronaut.nameFirst} ${astronaut.nameLast}`;
    Astronauts.push(Astronaut);
  }

  const result: launchDetails = {
    launchId: launchId,
    missionCopy: data.spaceMissions.find(m => m.missionId === missionId),
    timeCreated: launch.createdAt,
    state: launch.state,
    launchVehicle: assignedVehicle,
    payload: payload,
    allocatedAstronauts: Astronauts,
    launchCalculationParameters: launch.launchCalculationParameters
  };

  return result;
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
  // Throw Errors
  // controlUserSessionId
  const controlUserId = controlUserSessionIdCheck(controlUserSessionId);
  if (!controlUserId) {
    throw HTTPError(401, 'ControlUserSessionId is empty or invalid');
  }
  // missionId
  if (!missionIdCheck(controlUserSessionId, missionId)) {
    throw HTTPError(403, 'MissionId is empty, invalid or not associated with the current controlUser');
  }
  // astronaut
  if (!astronautIdCheck(missionId, astronautId)) {
    throw HTTPError(400, 'launchid is invalid or has not been assigned to the current mission');
  }
  // launchId
  if (!launchIdCheck(launchId)) {
    throw HTTPError(400, 'launchid is invalid');
  }
  // weight
  const launchVehicleId = getData().launches.find(l => l.launchId === launchId).assignedLaunchVehicleId;
  const launchVehicle = getData().launchVehicles.find(l => l.launchVehicleId === launchVehicleId);
  let totleWeight = 0;
  for (const assignedAstronautId of getData().launches.find(l => l.launchId === launchId).allocatedAstronauts) {
    totleWeight += getData().astronauts.find(a => a.astronautId === assignedAstronautId).weight;
  }
  if (totleWeight + getData().astronauts.find(a => a.astronautId === astronautId).weight > launchVehicle.maxCrewWeight) {
    throw HTTPError(400, 'The total weight including this astronaut would exceed the maxCrewWeight of the launchVehicle');
  }

  const data = getData();
  data.launches.find(l => l.launchId === launchId).allocatedAstronauts.push(astronautId);
  setData(data);

  return {};
}

export function adminMissionLaunchRemove(
  controlUserSessionId: string,
  missionId: number,
  launchId: number,
  astronautId: number
) {
  // Throw Errors
  // controlUserSessionId
  const controlUserId = controlUserSessionIdCheck(controlUserSessionId);
  if (!controlUserId) {
    throw HTTPError(401, 'ControlUserSessionId is empty or invalid');
  }
  // missionId
  if (!missionIdCheck(controlUserSessionId, missionId)) {
    throw HTTPError(403, 'MissionId is empty, invalid or not associated with the current controlUser');
  }
  // astronautId
  if (!astronautIdCheck(missionId, astronautId)) {
    throw HTTPError(400, 'launchid is invalid or has not been assigned to the current mission');
  }
  // launchId
  if (!launchIdCheck(launchId)) {
    throw HTTPError(400, 'launchid is invalid');
  }
  const launch = getData().launches.find(l => l.launchId === launchId);
  if (!launch.allocatedAstronauts.find(id => id === astronautId)) {
    throw HTTPError(400, 'The astronaut not allocated to this launch');
  }
  if (launch.state !== 'READY_TO_LAUNCH' && launch.state !== 'ON_EARTH') {
    throw HTTPError(400, 'The launch has started and is still in progress');
  }

  const data = getData();
  const newAssignedAstronauts = launch.allocatedAstronauts.filter(a => a !== astronautId);
  launch.allocatedAstronauts = newAssignedAstronauts;
  setData(data);

  return {};
}
