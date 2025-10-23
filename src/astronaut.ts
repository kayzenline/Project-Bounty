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

export function assignAstronaut(
  controlUserSessionId: string,
  astronautId: number,
  missionId: number
) {
  try {
    const data = getData();
    const session = findSessionFromSessionId(controlUserSessionId)
    if(!session){
      buildError('controlUserSessionId is invalid', EC.INVALID_CREDENTIALS);
    }
    if(!missionIdCheck(missionId)){
      buildError('missionId is invalid', EC.INACCESSIBLE_VALUE);
    }
    const mission = data.spaceMissions.find(m => m.missionId === missionId);
    if (!mission) {
      throw buildError('mission not found', EC.INACCESSIBLE_VALUE);
    }
    if (mission.controlUserId !== session.controlUserId) {
      throw buildError('mission does not belong to owner', EC.INACCESSIBLE_VALUE);
    }
    if(!astronautIdCheck(astronautId)){
       buildError('astronautId is invalid', EC.BAD_INPUT);
    };
    const astronaut = data.astronauts.find(a => a.astronautId === astronautId);
    if (!astronaut) {
      buildError('astronaut not found', EC.BAD_INPUT);
    }
    if (astronaut.assignedMission !== undefined) {
      buildError('astronaut is currently assigned to a mission', EC.BAD_INPUT);
    }
    astronaut.assignedMission = {
      missionId,
      objective: 'Training for mission',
    };
    setData(data);
    return {};
  } catch (e) {
    const ne = normalizeError(e);
    return { error: ne.error, errorCategory: ne.errorCategory };
  }
}

export function unassginAstronaut(
  controlUserSessionId: string,
  astronautId: number,
  missionId: number
) {

}
*/
