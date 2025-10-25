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
    const result: AstronautDetail[] = [];

    for (const astronaut of data.astronauts) {
      if (astronaut.assignedMission) {
        result.push({
          astronautId: astronaut.astronautId,
          designation: astronaut.designation,
          assigned: true
        });
      } else {
        result.push({
          astronautId: astronaut.astronautId,
          designation: astronaut.designation,
          assigned: false
        });
      }
    }

    return { result: result };
  } catch (e) {
    const ne = normalizeError(e);
    return { error: ne.error, errorCategory: ne.errorCategory };
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
    console.log(controlUserSessionId);

    if (!controlUserSessionId || typeof controlUserSessionId !== 'string') {
      buildError('ControlUserSessionId is empty or invalid', EC.INVALID_CREDENTIALS);
    }

    if (!findSessionFromSessionId(controlUserSessionId)) {
      buildError('ControlUserSessionId is empty or invalid', EC.INVALID_CREDENTIALS);
    }

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

    return { response: response };
  } catch (e) {
    const ne = normalizeError(e);
    return { error: ne.error, errorCategory: ne.errorCategory };
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
    if (astronaut.assignedMission !== undefined) {
      buildError('astronaut is currently assigned to a mission', EC.BAD_INPUT);
    }
    mission.assignedAstronauts.push({
      astronautId,
      designation: `${astronaut.rank} ${astronaut.nameFirst} ${astronaut.nameLast}`
    });
    mission.timeLastEdited = Math.floor(Date.now() / 1000);
    astronaut.assignedMission = {
      missionId,
      objective: 'Training for mission',
    };
    astronaut.timeLastEdited = Math.floor(Date.now() / 1000);
    setData(data);
    return {};
  } catch (e) {
    const ne = normalizeError(e);
    return { error: ne.error, errorCategory: ne.errorCategory };
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
    const missionLink = (astronaut as { assignedMission: { missionId: number } }).assignedMission;
    if (missionLink.missionId === missionId) {
      delete (astronaut as { assignedMission: { missionId: number } }).assignedMission;
    }

    mission.timeLastEdited = Math.floor(Date.now() / 1000);
    astronaut.timeLastEdited = Math.floor(Date.now() / 1000);
    setData(data);

    return {};
  } catch (e) {
    const ne = normalizeError(e);
    return { error: ne.error, errorCategory: ne.errorCategory };
  }
}
