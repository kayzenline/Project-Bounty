import { getData, setData, Astronaut } from './dataStore';
import {
  findSessionFromSessionId,
  astronautIdCheck,
  astronautNameCheck,
  astronautRankCheck,
  astronautPhyCharCheck,
  normalizeError,
  ServiceError,
  missionIdCheck
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

export function adminAstronautInfo(astronautId: number): { response: object } | { error: string; errorCategory: string } {
  astronautId: number;
  designation: string;
  timeAdded: number;
  timeLastEdited: number;
  age: number;
  weight: number;
  height: number;
  assignedMission?: {
    missionId: number;
    objective: string;
  };
} | { error: string; errorCategory: string } {
  try {
    astronautIdCheck(astronautId);

    const data = getData();
    const astronaut = data.astronauts.find(a => a.astronautId === astronautId);

    if (!astronaut) {
      buildError('astronautId not found', EC.BAD_INPUT);
    }

    // Build response object
    const response: {
      astronautId: number;
      designation: string;
      timeAdded: number;
      timeLastEdited: number;
      age: number;
      weight: number;
      height: number;
      assignedMission?: {
        missionId: number;
        objective: string;
      };
    } = {
      astronautId: astronaut.astronautId,
      designation: astronaut.designation,
      timeAdded: astronaut.timeAdded,
      timeLastEdited: astronaut.timeLastEdited,
      age: astronaut.age,
      weight: astronaut.weight,
      height: astronaut.height
    };

    // Add assigned mission info if exists
    if (astronaut.assignedMission) {
      const mission = data.spaceMissions.find(m => m.missionId === astronaut.assignedMission.missionId);
      if (mission) {
        response.assignedMission = {
          missionId: mission.missionId,
          objective: `[${mission.target}] ${mission.name}`
        };
      }
    }

    return response;
  } catch (e) {
    const ne = normalizeError(e);
    return { error: ne.error, errorCategory: ne.errorCategory };
  }
}

export function deleteAstronaut(controlUserSessionId: string, astronautId: number): {} | { error: string; errorCategory: string } {
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
): {} | { error: string; errorCategory: string } {
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
): {} | { error: string; errorCategory: string } {
  try {
    const data = getData();
    const session = findSessionFromSessionId(controlUserSessionId)
    if (!session) {
      buildError('controlUserSessionId is invalid', EC.INVALID_CREDENTIALS);
    }
    if (!missionIdCheck(missionId)) {
      buildError('missionId is invalid', EC.INACCESSIBLE_VALUE);
    }
    const mission = data.spaceMissions.find(m => m.missionId === missionId);
    if (!mission) {
      throw buildError('mission not found', EC.INACCESSIBLE_VALUE);
    }
    if (mission.controlUserId !== session.controlUserId) {
      throw buildError('mission does not belong to owner', EC.INACCESSIBLE_VALUE);
    }
    if (!astronautIdCheck(astronautId)) {
       buildError('astronautId is invalid', EC.BAD_INPUT);
    }
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
): {} | { error: string; errorCategory: string } {

}
