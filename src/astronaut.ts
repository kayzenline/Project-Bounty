import { getData, setData, Astronaut } from './dataStore';
import {
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

export function adminAstronautCreate(
  nameFirst: string,
  nameLast: string,
  rank: string,
  age: number,
  weight: number,
  height: number
): { astronautId: number } | { error: string; errorCategory: string } {
  try {
    // Validate input parameters
    astronautNameCheck(nameFirst, nameLast);
    astronautRankCheck(rank);
    astronautPhyCharCheck(age, weight, height);

    const data = getData();

    // Generate new astronaut ID
    const astronautId = data.nextAstronautId || 1;
    data.nextAstronautId = astronautId + 1;

    // Create designation (rank + nameFirst + nameLast)
    const designation = `${rank} ${nameFirst} ${nameLast}`;

    const currentTime = Math.floor(Date.now() / 1000);

    // Create new astronaut
    const newAstronaut: Astronaut = {
      astronautId,
      designation,
      timeAdded: currentTime,
      timeLastEdited: currentTime,
      nameFirst,
      nameLast,
      rank,
      age,
      weight,
      height,
      assignedMission: undefined
    };

    data.astronauts.push(newAstronaut);
    setData(data);

    return { astronautId };
  } catch (e) {
    const ne = normalizeError(e);
    return { error: ne.error, errorCategory: ne.errorCategory };
  }
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

}
