import HTTPError from 'http-errors';
import {
  controlUserSessionIdCheck,
  launchVehicleNameValidityCheck,
  launchVehicleDescriptionValidityCheck,
  launchVehicleCrewWeightValidityCheck,
  launchVehiclePayloadWeightValidityCheck,
  launchVehicleWeightValidityCheck,
  launchVehicleThrustCapacityValidityCheck,
  launchVehicleManeuveringFuelValidityCheck,
  LaunchVehicleLaunchSummary,
  launchVehicleLaunchInfoHelper,
  launchVehicleIdCheck
} from './newHelperfunctions';
import {
  getData,
  setData,
  LaunchVehicle
} from '../dataStore';

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
  // Throw Errors
  // controlUserSessionId
  const controlUserId = controlUserSessionIdCheck(controlUserSessionId);
  if (!controlUserId) {
    throw HTTPError(401, 'controlUserSessionId is empty or invalid');
  }
  // name
  if (!launchVehicleNameValidityCheck(name)) {
    throw HTTPError(400, 'launchVehicle name is invalid');
  }
  // description
  if (!launchVehicleDescriptionValidityCheck(description)) {
    throw HTTPError(400, 'launchVehicle description is invalid');
  }
  // maxCrewWeight
  if (!launchVehicleCrewWeightValidityCheck(maxCrewWeight)) {
    throw HTTPError(400, 'launchVehicle maxCrewWeight is invalid');
  }
  // maxPayloadWeight
  if (!launchVehiclePayloadWeightValidityCheck(maxPayloadWeight)) {
    throw HTTPError(400, 'launchVehicle maxPayloadWeight is invalid');
  }
  // launchVehicleWeight
  if (!launchVehicleWeightValidityCheck(launchVehicleWeight)) {
    throw HTTPError(400, 'launchVehicle launchVehicleWeight is invalid');
  }
  // thrustCapacity
  if (!launchVehicleThrustCapacityValidityCheck(thrustCapacity)) {
    throw HTTPError(400, 'launchVehicle thrustCapacity is invalid');
  }
  // maneuveringFuel
  if (!launchVehicleManeuveringFuelValidityCheck(maneuveringFuel)) {
    throw HTTPError(400, 'launchVehicle maneuveringFuel is invalid');
  }

  // create successfully
  const data = getData();
  const currentTime = Math.floor(Date.now() / 1000);

  const launchVehicle: LaunchVehicle = {
    launchVehicleId: data.nextLaunchVehicleId,
    name: name,
    description: description,
    maxCrewWeight: maxCrewWeight,
    maxPayloadWeight: maxPayloadWeight,
    thrustCapacity: thrustCapacity,
    launchVehicleWeight: launchVehicleWeight,
    maneuveringFuel: maneuveringFuel,
    timeAdded: currentTime,
    timeLastEdited: currentTime,
    retired: false,
    assigned: false
  };
  data.nextLaunchVehicleId++;
  data.launchVehicles.push(launchVehicle);
  setData(data);

  return { launchVehicleId: launchVehicle.launchVehicleId };
}

export function adminLaunchVehicleDetails(controlUserSessionId: string) {
  // Throw Errors
  // controlUserSessionId
  const controlUserId = controlUserSessionIdCheck(controlUserSessionId);
  if (!controlUserId) {
    throw HTTPError(401, 'controlUserSessionId is empty or invalid');
  }
  // success
  const data = getData();
  const result: LaunchVehicleLaunchSummary[] = [];
  for (const launchVehicle of data.launchVehicles) {
    result.push({
      launchVehicleId: launchVehicle.launchVehicleId,
      name: launchVehicle.name,
      assigned: launchVehicle.assigned
    });
  }

  return { launchVehicles: result };
}

export function adminLaunchVehicleInfo(
  controlUserSessionId: string,
  launchVehicleId: number
) {
  // Throw Errors
  // controlUserSessionId
  const controlUserId = controlUserSessionIdCheck(controlUserSessionId);
  if (!controlUserId) {
    throw HTTPError(401, 'controlUserSessionId is empty or invalid');
  }
  // launchvehicleid
  if (!launchVehicleIdCheck(launchVehicleId)) {
    throw HTTPError(400, 'launchvehicleid is invalid');
  }
  // success
  const result = launchVehicleLaunchInfoHelper(launchVehicleId);
  if (result !== null) {
    return result;
  } else {
    return {};
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
  // Throw Errors
  // controlUserSessionId
  const controlUserId = controlUserSessionIdCheck(controlUserSessionId);
  if (!controlUserId) {
    throw HTTPError(401, 'controlUserSessionId is empty or invalid');
  }
  // launchvehicleid
  if (!launchVehicleIdCheck(launchVehicleId)) {
    throw HTTPError(400, 'launchvehicleid is invalid');
  }
  // Launch Vehicle
  if (getData().launches.find(l => l.assignedLaunchVehicleId === launchVehicleId && l.state !== 'ON_EARTH')) {
    throw HTTPError(400, 'The Launch Vehicle is currently allocated to an active launch');
  }
  // name
  if (!launchVehicleNameValidityCheck(name)) {
    throw HTTPError(400, 'launchVehicle name is invalid');
  }
  // description
  if (!launchVehicleDescriptionValidityCheck(description)) {
    throw HTTPError(400, 'launchVehicle description is invalid');
  }
  // maxCrewWeight
  if (!launchVehicleCrewWeightValidityCheck(maxCrewWeight)) {
    throw HTTPError(400, 'launchVehicle maxCrewWeight is invalid');
  }
  // maxPayloadWeight
  if (!launchVehiclePayloadWeightValidityCheck(maxPayloadWeight)) {
    throw HTTPError(400, 'launchVehicle maxPayloadWeight is invalid');
  }
  // launchVehicleWeight
  if (!launchVehicleWeightValidityCheck(launchVehicleWeight)) {
    throw HTTPError(400, 'launchVehicle launchVehicleWeight is invalid');
  }
  // thrustCapacity
  if (!launchVehicleThrustCapacityValidityCheck(thrustCapacity)) {
    throw HTTPError(400, 'launchVehicle thrustCapacity is invalid');
  }
  // maneuveringFuel
  if (!launchVehicleManeuveringFuelValidityCheck(maneuveringFuel)) {
    throw HTTPError(400, 'launchVehicle maneuveringFuel is invalid');
  }

  const data = getData();
  const launchVehicle = data.launchVehicles.find(l => l.launchVehicleId === launchVehicleId);
  launchVehicle.name = name;
  launchVehicle.description = description;
  launchVehicle.maxCrewWeight = maxCrewWeight;
  launchVehicle.maxPayloadWeight = maxPayloadWeight;
  launchVehicle.launchVehicleWeight = launchVehicleWeight;
  launchVehicle.thrustCapacity = thrustCapacity;
  launchVehicle.maneuveringFuel = maneuveringFuel;
  launchVehicle.timeLastEdited = Math.floor(Date.now() / 1000);
  setData(data);

  return {};
}

export function adminLaunchVehicleRetire(
  controlUserSessionId: string,
  launchVehicleId: number
) {
  // Throw Errors
  // controlUserSessionId
  const controlUserId = controlUserSessionIdCheck(controlUserSessionId);
  if (!controlUserId) {
    throw HTTPError(401, 'controlUserSessionId is empty or invalid');
  }
  // launchvehicleid
  if (!launchVehicleIdCheck(launchVehicleId)) {
    throw HTTPError(400, 'launchvehicleid is invalid');
  }
  // Launch Vehicle
  if (getData().launches.find(l => l.assignedLaunchVehicleId === launchVehicleId && l.state !== 'ON_EARTH')) {
    throw HTTPError(400, 'The Launch Vehicle is currently allocated to an active launch');
  }

  const data = getData();
  const launchVehicle = data.launchVehicles.find(l => l.launchVehicleId === launchVehicleId);
  launchVehicle.retired = true;
  launchVehicle.timeLastEdited = Math.floor(Date.now() / 1000);
  return {};
}
