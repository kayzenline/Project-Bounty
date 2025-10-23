/* 
import { getData, setData } from './dataStore';
import {
  controlUserIdCheck,
  missionIdCheck,
  findSessionFromSessionId,
  astronautIdCheck,
  astronautNameCheck,
  astronautRankCheck,
  astronautPhyCharCheck,
  normalizeError,
  ServiceError
} from './helper';
import { errorCategories as EC } from './testSamples';

function buildError(message: string, code: string): never {
  throw new ServiceError(message, code);
}

export function seeAstronautPool(controlUserSessionId: string) {

}

export function createAstronaut(
  controlUserSessionId: string,
  nameFirst: string,
  nameLast: string,
  rank: string,
  age: number,
  weight: number,
  height: number
) {

}

export function deleteAstronaut(controlUserSessionId: string, astronautId: number) {
  try {
    if (!findSessionFromSessionId(controlUserSessionId)) {
      buildError('controlUserSessionId is invalid', EC.INVALID_CREDENTIALS);
    }

    astronautIdCheck(astronautId);

    const data = getData();
    const astronaut = data.astronauts.find(a => a.astronautId === astronautId);
    if (astronaut.assignedMission !== undefined) {
      buildError('astronaut is currently assigned to a mission', EC.BAD_INPUT);
    }

    const newAstronautPool = data.astronauts.filter(a => a.astronautId !== astronautId);
    data.astronauts = newAstronautPool;

    setData(data);
    return {};
  } catch (e) {
    const ne = normalizeError(e);
    return { error: ne.error, errorCategory: ne.errorCategory };
  }
}

export function getAstronautInfo(controlUserSessionId: string, astronautId: number) {

}

export function editAstronaut(
  controlUserSessionId: string,
  astronautId: number,
  nameFirst: string,
  nameLast: string,
  rank: string,
  age: number,
  weight: number,
  height: number
) {
  try {
    if (!findSessionFromSessionId(controlUserSessionId)) {
      buildError('controlUserSessionId is invalid', EC.INVALID_CREDENTIALS);
    }
    astronautIdCheck(astronautId);
    astronautNameCheck(nameFirst, nameLast);
    astronautRankCheck(rank);
    astronautPhyCharCheck(age, weight, height);

    const data = getData();
    const astronaut = data.astronauts.find(a => a.astronautId === astronautId);
    astronaut.nameFirst = nameFirst;
    astronaut.nameLast = nameLast;
    astronaut.rank = rank;
    astronaut.age = age;
    astronaut.weight = weight;
    astronaut.height = height;
    astronaut.timeLastEdited = Math.floor(Date.now() / 1000);

    setData(data);
    return {};
  } catch (e) {
    const ne = normalizeError(e);
    return { error: ne.error, errorCategory: ne.errorCategory };
  }
}

export function assginAstronaut(
  controlUserSessionId: string,
  astronautId: number,
  missionId: number
) {

}

export function unassginAstronaut(
  controlUserSessionId: string,
  astronautId: number,
  missionId: number
) {
  // Guard against invalid sessions, enforce ownership, then detach the astronaut from the mission
  // while clearing their mission link. Failures surface with the contract-aligned error categories.
  try {
    const session = findSessionFromSessionId(controlUserSessionId);
    if (!session) {
      buildError('controlUserSessionId is invalid', EC.INVALID_CREDENTIALS);
    }

    astronautIdCheck(astronautId);
    const missionRecord = missionIdCheck(missionId);

    if (missionRecord.controlUserId !== session.controlUserId) {
      buildError('Mission does not belong to this user', EC.INACCESSIBLE_VALUE);
    }

    const data = getData();
    const mission = data.spaceMissions.find(m => m.missionId === missionId);
    if (!mission) {
      buildError('missionId not found', EC.INACCESSIBLE_VALUE);
    }

    mission.assignedAstronauts = mission.assignedAstronauts ?? [];
    const assigned = mission.assignedAstronauts.find(a => a.astronautId === astronautId);
    if (!assigned) {
      buildError('Astronaut not assigned to this mission', EC.BAD_INPUT);
    }

    const astronaut = data.astronauts.find(a => a.astronautId === astronautId);
    if (!astronaut) {
      buildError('astronautId not found', EC.BAD_INPUT);
    }

    mission.assignedAstronauts = mission.assignedAstronauts.filter(a => a.astronautId !== astronautId);
    // Remove mission linkage from astronaut record if it matches this mission
    const missionLink = (astronaut as { assignedMission: { missionId: number } }).assignedMission;
    if (missionLink.missionId === missionId) {
      delete (astronaut as { assignedMission: { missionId: number } }).assignedMission;
    }

    mission.timeLastEdited = Math.floor(Date.now() / 1000);
    setData(data);

    return {};
  } catch (e) {
    const ne = normalizeError(e);
    return { error: ne.error, errorCategory: ne.errorCategory };
  }
}
 */