import { getData, setData, Astronaut } from '../dataStore';
import {
  findSessionFromSessionId,
  astronautIdCheck,
  astronautNameCheck,
  astronautRankCheck,
  astronautPhyCharCheck,
  normalizeError,
  ServiceError,
  missionIdCheck
} from '../helper';
import { errorCategories as EC } from '../testSamples';
import HTTPError from 'http-errors';

function buildError(message: string, code: string): never {
  throw new ServiceError(message, code);
}

function throwErrorForFunction(code: string, message: string) {
  switch (code) {
    case 'INVALID_CREDENTIALS':
      throw HTTPError(401, message);
    case 'INACCESSIBLE_VALUE':
      throw HTTPError(403, message);
    default:
      throw HTTPError(400, message);
  }
}

export function adminAstronautPool(controlUserSessionId: string) {
  try {
    if (!controlUserSessionId || typeof controlUserSessionId !== 'string') {
      buildError('ControlUserSessionId is empty or invalid', EC.INVALID_CREDENTIALS);
    }

    if (!findSessionFromSessionId(controlUserSessionId)) {
      buildError('ControlUserSessionId is empty or invalid', EC.INVALID_CREDENTIALS);
    }

    const data = getData();
    interface AstronautDetail {
      astronautId: number,
      designation: string,
      assigned: boolean
    }
    const astronauts: AstronautDetail[] = [];

    for (const astronaut of data.astronauts) {
      if (astronaut.assignedMission.missionId !== null) {
        astronauts.push({
          astronautId: astronaut.astronautId,
          designation: astronaut.designation,
          assigned: true
        });
      } else {
        astronauts.push({
          astronautId: astronaut.astronautId,
          designation: astronaut.designation,
          assigned: false
        });
      }
    }

    return { astronauts: astronauts };
  } catch (e) {
    const ne = normalizeError(e);
    throwErrorForFunction(ne.errorCategory, ne.error);
  }
}

export function adminAstronautCreate(
  controlUserSessionId: string,
  nameFirst: string,
  nameLast: string,
  rank: string,
  age: number,
  weight: number,
  height: number
) {
  try {
    if (!controlUserSessionId || typeof controlUserSessionId !== 'string') {
      buildError('ControlUserSessionId is empty or invalid', EC.INVALID_CREDENTIALS);
    }

    if (!findSessionFromSessionId(controlUserSessionId)) {
      buildError('ControlUserSessionId is empty or invalid', EC.INVALID_CREDENTIALS);
    }

    // Validate input parameters
    const nameCheckResult = astronautNameCheck(nameFirst, nameLast);
    if (typeof nameCheckResult === 'number') {
      throw new ServiceError('another astronaut already exists', EC.BAD_INPUT);
    }

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
      assignedMission: {
        missionId: null,
        objective: ''
      }
    };

    data.astronauts.push(newAstronaut);
    setData(data);

    return { astronautId };
  } catch (e) {
    const ne = normalizeError(e);
    throwErrorForFunction(ne.errorCategory, ne.error);
  }
}
export interface AstronautResponse {
  astronautId: number;
  designation: string;
  timeAdded: number;
  timeLastEdited: number;
  age: number;
  weight: number;
  height: number;
  assignedMission?: AssignedMission;
}
export interface AssignedMission {
  missionId: number;
  objective: string;
}

export function adminAstronautInfo(controlUserSessionId: string, astronautId: number) {
  try {
    if (!controlUserSessionId || typeof controlUserSessionId !== 'string') {
      buildError('ControlUserSessionId is empty or invalid', EC.INVALID_CREDENTIALS);
    }

    if (!findSessionFromSessionId(controlUserSessionId)) {
      buildError('ControlUserSessionId is empty or invalid', EC.INVALID_CREDENTIALS);
    }
    astronautIdCheck(astronautId);

    const data = getData();
    const astronaut = data.astronauts.find(a => a.astronautId === astronautId);

    if (!astronaut) {
      buildError('astronautId not found', EC.BAD_INPUT);
    }

    // Build response object
    const response: AstronautResponse = {
      astronautId: astronaut.astronautId,
      designation: astronaut.designation,
      timeAdded: astronaut.timeAdded,
      timeLastEdited: astronaut.timeLastEdited,
      age: astronaut.age,
      weight: astronaut.weight,
      height: astronaut.height,
      assignedMission: astronaut.assignedMission
    };

    return { response };
  } catch (e) {
    const ne = normalizeError(e);
    throwErrorForFunction(ne.errorCategory, ne.error);
  }
}

export function adminAstronautDelete(controlUserSessionId: string, astronautId: number) {
  try {
    if (!findSessionFromSessionId(controlUserSessionId)) {
      buildError('controlUserSessionId is invalid', EC.INVALID_CREDENTIALS);
    }

    astronautIdCheck(astronautId);

    const data = getData();
    const astronaut = data.astronauts.find(a => a.astronautId === astronautId);
    if (astronaut.assignedMission.missionId !== null) {
      buildError('astronaut is currently assigned to a mission', EC.BAD_INPUT);
    }

    const newAstronautPool = data.astronauts.filter(a => a.astronautId !== astronautId);
    data.astronauts = newAstronautPool;

    setData(data);
    return {};
  } catch (e) {
    const ne = normalizeError(e);
    throwErrorForFunction(ne.errorCategory, ne.error);
  }
}

export function adminAstronautEdit(
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
    const nameCheckResult = astronautNameCheck(nameFirst, nameLast);
    if (typeof nameCheckResult === 'number') {
      if (nameCheckResult !== astronautId) {
        throw new ServiceError('another astronaut already exists', EC.BAD_INPUT);
      }
    }
    astronautRankCheck(rank);
    astronautPhyCharCheck(age, weight, height);

    const data = getData();
    const astronaut = data.astronauts.find(a => a.astronautId === astronautId);
    astronaut.designation = `${rank} ${nameFirst} ${nameLast}`;
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
    throwErrorForFunction(ne.errorCategory, ne.error);
  }
}

export function adminMissionAstronautAssign(
  controlUserSessionId: string,
  astronautId: number,
  missionId: number
) {
  try {
    const data = getData();
    const session = findSessionFromSessionId(controlUserSessionId);
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
    if (astronaut.assignedMission.missionId !== null) {
      buildError('astronaut is currently assigned to a mission', EC.BAD_INPUT);
    }
    if (mission.assignedAstronauts.some(a => a.astronautId === astronautId)) {
      buildError('astronaut already assigned to this mission', EC.BAD_INPUT);
    }
    mission.assignedAstronauts.push({
      astronautId,
      designation: `${astronaut.rank} ${astronaut.nameFirst} ${astronaut.nameLast}`
    });
    mission.timeLastEdited = Math.floor(Date.now() / 1000);
    const objective = '[' + mission.target + ']' + ' ' + mission.name;
    astronaut.assignedMission = {
      missionId,
      objective: objective,
    };
    astronaut.timeLastEdited = Math.floor(Date.now() / 1000);
    setData(data);
    return {};
  } catch (e) {
    const ne = normalizeError(e);
    throwErrorForFunction(ne.errorCategory, ne.error);
  }
}

export function adminMissionAstronautUnassign(
  controlUserSessionId: string,
  astronautId: number,
  missionId: number
) {
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
    astronaut.assignedMission = {
      missionId: null,
      objective: ''
    };

    mission.timeLastEdited = Math.floor(Date.now() / 1000);
    astronaut.timeLastEdited = Math.floor(Date.now() / 1000);
    setData(data);

    return {};
  } catch (e) {
    const ne = normalizeError(e);
    throwErrorForFunction(ne.errorCategory, ne.error);
  }
}
