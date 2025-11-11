import HTTPError from 'http-errors';
import { getData, setData, missionLaunchState, missionLaunchAction, Launch } from '../dataStore';
import { launchIdCheck, launchCalculationParameterCorrectnessCheck } from './newHelperfunctions';

let timerId: number;

function checkManeuveringFuel(launchId: number): boolean {
  // a helper function that checks if there is at least 3 units of fuel left
  // TODO - you must complete this helper function
  const data = getData();
  const launch: Launch = data.launches.find(singleLaunch => singleLaunch.launchId === launchId);
  // fuel left less than 3 units
  if (launch.remainingLaunchVehicleManeuveringFuel < 3) {
    return false;
  }

  return true;
}

// error constant defined becuase it is used frequently
const badActionForStateError = (action: missionLaunchAction, state: missionLaunchState) => {
  throw HTTPError(400, `invalid action: Cannot do action ${action} in state ${state}`);
};

// helper functions to initialize states
function initializeLaunching(launchId: number) {
  // assumes a valid launchId since this can only be accessed from other functions that have done the check
  // assumes launch is part the datastore as a property called "launches" which is an array of the Launch type and that it has a property called 'state'
  const data = getData();
  const launch: Launch = data.launches.find(singleLaunch => singleLaunch.launchId === launchId);
  launch.state = missionLaunchState.LAUNCHING;
  clearTimeout(timerId);
  timerId = setTimeout(initializeManeuvering, 3 * 1000);

  setData(data);
}

function initializeManeuvering(launchId: number) {
  // assumes a valid launchId since this can only be accessed from other functions that have done the check
  // assumes launch is part the datastore as a property called "launches" which is an array of the Launch type and that it has a property called 'state'
  const data = getData();
  const launch: Launch = data.launches.find(singleLaunch => singleLaunch.launchId === launchId);
  launch.state = missionLaunchState.ON_EARTH;
  clearTimeout(timerId);
  timerId = setTimeout(initializeCoasting, launch.launchCalculationParameters.maneuveringDelay * 1000);

  setData(data);
}

function initializeCoasting(launchId: number) {
  // assumes a valid launchId since this can only be accessed from other functions that have done the check
  // assumes launch is part the datastore as a property called "launches" which is an array of the Launch type and that it has a property called 'state'
  const data = getData();
  const launch: Launch = data.launches.find(singleLaunch => singleLaunch.launchId === launchId);
  launch.state = missionLaunchState.COASTING;
  clearTimeout(timerId);

  setData(data);
}

function initializeMissionComplete(launchId: number) {
  // assumes a valid launchId since this can only be accessed from other functions that have done the check
  // assumes launch is part the datastore as a property called "launches" which is an array of the Launch type and that it has a property called 'state'
  const data = getData();
  const launch: Launch = data.launches.find(singleLaunch => singleLaunch.launchId === launchId);
  launch.state = missionLaunchState.MISSION_COMPLETE;
  clearTimeout(timerId);

  setData(data);
}

function initializeRentry(launchId: number) {
  // assumes a valid launchId since this can only be accessed from other functions that have done the check
  // assumes launch is part the datastore as a property called "launches" which is an array of the Launch type and that it has a property called 'state'
  const data = getData();
  const launch: Launch = data.launches.find(singleLaunch => singleLaunch.launchId === launchId);
  launch.state = missionLaunchState.REENTRY;
  clearTimeout(timerId);

  setData(data);
}

function initializeOnEarth(launchId: number) {
  // assumes a valid launchId since this can only be accessed from other functions that have done the check
  // assumes launch is part the datastore as a property called "launches" which is an array of the Launch type and that it has a property called 'state'
  const data = getData();
  const launch: Launch = data.launches.find(singleLaunch => singleLaunch.launchId === launchId);
  launch.state = missionLaunchState.ON_EARTH;
  clearTimeout(timerId);
  //  3. De-allocate astronauts (and launch vehicle)
  setData(data);
}

function deployPayload(launchId: number) {
  // this function helps deploy the payload
  // assumes a valid launchId since this can only be accessed from other functions that have done the check
  // assumes launch is part the datastore as a property called "launches" which is an array of the Launch type and that it has a property called 'state'
  const data = getData();
  const launch: Launch = data.launches.find((singleLaunch) => singleLaunch.launchId === launchId);
  const payload = data.payload.find(singlePayload => singlePayload.payloadId === launch.payloadId);
  if (!payload) {
    throw HTTPError(400, 'Payload for launch not found');
  }
  payload.deployed = true;
  payload.timeOfDeployment = Math.floor(Date.now() / 1000);
  payload.deployedLaunchId = launchId;

  setData(data);
}

// function assumes that controlUserId checks are done and missionId checks are done - i.e. the user exists, the user is logged in, the mission exists and the current user has permission to access this launch (because they own the mission)
export function updateLaunchState(newAction: missionLaunchAction, launchId: number) {
  // check to make sure the launch id exists
  if (!launchIdCheck(launchId)) {
    throw HTTPError(400, 'invalid launchId');
  }

  // not needed as we have a switch statement that handles this.
  // // check to make sure action exists
  // if (!checkActionValidity(newAction)) {
  //     throw HTTPError(400, `invalid action - ${newAction}`);
  // }

  // big switch statement to check if action is permitted in current state and if it is, what to do
  const data = getData();
  // assumes launch is part the datastore as a property called "launches" which is an array of the Launch type and that it has a property called 'state'
  const launch: Launch = data.launches.find(singleLaunch => singleLaunch.launchId === launchId);

  switch (newAction) {
    case missionLaunchAction.LIFTOFF:
      if (launch.state === missionLaunchState.READY_TO_LAUNCH) {
        // this is ok, lets proceed with the actions
        const launchVehicleId = data.launches.find(l => l.launchId === launchId).assignedLaunchVehicleId;
        const payloadId = data.launches.find(l => l.launchId === launchId).payloadId;
        let totleWeight = 0;
        for (const assignedAstronautId of data.launches.find(l => l.launchId === launchId).allocatedAstronauts) {
          totleWeight += data.astronauts.find(a => a.astronautId === assignedAstronautId).weight;
        }
        if (!launchCalculationParameterCorrectnessCheck(
          launchVehicleId,
          data.payload.find(p => p.payloadId === payloadId),
          totleWeight,
          data.launches.find(l => l.launchId === launchId).launchCalculationParameters
        )) {
          // bad launch, abort!
          updateLaunchState(missionLaunchAction.FAULT, launchId);
        } else {
          // good launch move to LAUNCHING
          initializeLaunching(launchId);
        }
      } else {
        badActionForStateError(newAction, launch.state);
      }
      break;
    case missionLaunchAction.SKIP_WAITING:
      if (launch.state === missionLaunchState.LAUNCHING) {
        // this is ok, proceed with actions
        initializeManeuvering(launchId);
      } else {
        badActionForStateError(newAction, launch.state);
      }
      break;
    case missionLaunchAction.CORRECTION:
      if (launch.state === missionLaunchState.MANEUVERING) {
        // this is ok, lets proceed with the actions
        if (!checkManeuveringFuel(launchId)) {
          // not enough fuel, abort!
          updateLaunchState(missionLaunchAction.FAULT, launchId);
        } else {
          // enough fuel, move back to launching
          initializeLaunching(launchId);
        }
      } else {
        badActionForStateError(newAction, launch.state);
      }
      break;
    case missionLaunchAction.FIRE_THRUSTERS:
      if (launch.state === missionLaunchState.MANEUVERING) {
        // this is ok, lets proceed with the actions
        if (!checkManeuveringFuel(launchId)) {
          // not enough fuel, abort!
          updateLaunchState(missionLaunchAction.FAULT, launchId);
        } else {
          // enough fuel, moving to COASTING
          initializeCoasting(launchId);
        }
      } else {
        badActionForStateError(newAction, launch.state);
      }
      break;
    case missionLaunchAction.DEPLOY_PAYLOAD:
      if (launch.state === missionLaunchState.COASTING) {
        // this is ok, lets proceed with the actions
        deployPayload(launchId);
        initializeMissionComplete(launchId);
      } else {
        badActionForStateError(newAction, launch.state);
      }
      break;
    case missionLaunchAction.GO_HOME:
      if (launch.state === missionLaunchState.MISSION_COMPLETE) {
        // this is ok, lets proceed with the actions
        initializeRentry(launchId);
      } else {
        badActionForStateError(newAction, launch.state);
      }
      break;
    case missionLaunchAction.RETURN:
      if (launch.state === missionLaunchState.REENTRY) {
        // this is ok, lets proceed with the actions
        initializeOnEarth(launchId);
      } else {
        badActionForStateError(newAction, launch.state);
      }
      break;
    case missionLaunchAction.FAULT:
      if (launch.state === missionLaunchState.REENTRY || launch.state === missionLaunchState.MISSION_COMPLETE) {
        // this is an unpermitted action in this state.
        badActionForStateError(newAction, launch.state);
      } else if (launch.state === missionLaunchState.READY_TO_LAUNCH) {
        initializeOnEarth(launchId);
      } else {
        // this can proceed.
        initializeRentry(launchId);
      }
      break;
    default:
      throw HTTPError(400, `unkown action: ${newAction}`);
  }
}
