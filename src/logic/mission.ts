// This file should contain your functions relating to:
// - adminMission*
import { getData, setData } from '../dataStore';
import {
  controlUserIdCheck,
  missionIdCheck,
  missionNameValidity,
  missionDescriptionValidity,
  missionTargetValidity,
  missionIdGen,
  normalizeError,
  throwErrorForFunction,
  buildError
} from './helper';
import { errorCategories as EC } from '../testSamples';

export function adminMissionList(controlUserId: number) {
  try {
    controlUserIdCheck(controlUserId);

    const data = getData();
    const missions = (data.spaceMissions || [])
      .filter(m => m.controlUserId === controlUserId)
      .map(m => ({ missionId: m.missionId, name: m.name }));

    return { missions };
  } catch (e) {
    const ne = normalizeError(e);
    throwErrorForFunction(ne.errorCategory, ne.error);
  }
}

// remove mission
export function adminMissionRemove(controlUserId: number, missionId: number) {
  try {
    const user = controlUserIdCheck(controlUserId);
    const mission = missionIdCheck(missionId);
    if (mission.controlUserId !== user.controlUserId) {
      buildError('Mission does not belong to this user', EC.INACCESSIBLE_VALUE);
    }
    const data = getData();
    if ((mission.assignedAstronauts ?? []).length > 0 || (data.astronauts || []).some(a => a.assignedMission?.missionId === missionId)) {
      buildError('Astronauts have been assigned to this mission', EC.BAD_INPUT);
    }
    const missions = data.spaceMissions || [];
    data.spaceMissions = missions.filter(m => m.missionId !== missionId);
    setData(data);
    return {};
  } catch (e) {
    const ne = normalizeError(e);
    throwErrorForFunction(ne.errorCategory, ne.error);
  }
}

// create a new mission
export function adminMissionCreate(controlUserId: number, name: string, description: string, target: string) {
  try {
    // check the information
    const user = controlUserIdCheck(controlUserId);
    const fixedName = missionNameValidity(name);
    const fixedDescription = missionDescriptionValidity(description);
    const fixedTarget = missionTargetValidity(target);

    const data = getData();
    const duplicate = (data.spaceMissions || []).some(mission =>
      mission.controlUserId === user.controlUserId &&
      mission.name.trim().toLowerCase() === fixedName.trim().toLowerCase()
    );
    // check duplicated
    if (duplicate) {
      buildError('mission name already exists', EC.BAD_INPUT);
    }

    const missionId = missionIdGen();
    const timestamp = Math.floor(Date.now() / 1000);
    // check exist
    if (!data.spaceMissions) {
      data.spaceMissions = [];
    }
    data.spaceMissions.push({
      missionId,
      controlUserId: user.controlUserId,
      name: fixedName,
      description: fixedDescription,
      target: fixedTarget,
      timeCreated: timestamp,
      timeLastEdited: timestamp,
      assignedAstronauts: []
    });

    data.nextMissionId++;
    setData(data);
    return { missionId: missionId };
  } catch (e) {
    const ne = normalizeError(e);
    throwErrorForFunction(ne.errorCategory, ne.error);
  }
}

export function adminMissionInfo(controlUserId: number, missionId: number) {
  try {
    const user = controlUserIdCheck(controlUserId);
    const mission = missionIdCheck(missionId);
    if (mission.controlUserId !== user.controlUserId) {
      buildError('mission not accessible', EC.INACCESSIBLE_VALUE);
    }

    return {
      missionId: mission.missionId,
      name: mission.name,
      timeCreated: mission.timeCreated,
      timeLastEdited: mission.timeLastEdited,
      description: mission.description,
      target: mission.target,
      assignedAstronauts: mission.assignedAstronauts ?? []
    };
  } catch (e) {
    const ne = normalizeError(e);
    throwErrorForFunction(ne.errorCategory, ne.error);
  }
}

// Update mission name
export function adminMissionNameUpdate(controlUserId: number, missionId: number, name: string) {
  try {
    controlUserIdCheck(controlUserId);
    const mission = missionIdCheck(missionId);
    const validname = missionNameValidity(name);
    const data = getData();

    if (mission.controlUserId !== controlUserId) {
      buildError('Mission does not belong to this user', EC.INACCESSIBLE_VALUE);
    }

    const duplicate = data.spaceMissions.some(m =>
      m.name.toLowerCase() === validname.toLowerCase()
    );
    if (duplicate) {
      buildError('mission name already exists', EC.BAD_INPUT);
    }
    const rightMission = data.spaceMissions.find(m => m.missionId === missionId);
    rightMission.name = validname;
    rightMission.timeLastEdited = Math.floor(Date.now() / 1000);

    setData(data);
    return {};
  } catch (e) {
    const ne = normalizeError(e);
    throwErrorForFunction(ne.errorCategory, ne.error);
  }
}

// Update mission target
export function adminMissionTargetUpdate(controlUserId: number, missionId: number, target: string) {
  try {
    controlUserIdCheck(controlUserId);
    const mission = missionIdCheck(missionId);
    const validTarget = missionTargetValidity(target);
    const data = getData();

    if (mission.controlUserId !== controlUserId) {
      buildError('Mission does not belong to this user', EC.INACCESSIBLE_VALUE);
    }

    const rightMission = data.spaceMissions.find(m => m.missionId === missionId);
    rightMission.target = validTarget;
    rightMission.timeLastEdited = Math.floor(Date.now() / 1000);
    setData(data);
    return {};
  } catch (e) {
    const ne = normalizeError(e);
    throwErrorForFunction(ne.errorCategory, ne.error);
  }
}

// Update mission description
export function adminMissionDescriptionUpdate(controlUserId: number, missionId: number, description: string) {
  try {
    // create check condition
    controlUserIdCheck(controlUserId);
    const mission = missionIdCheck(missionId);
    const validDescription = missionDescriptionValidity(description);
    const data = getData();

    if (mission.controlUserId !== controlUserId) {
      buildError('Mission does not belong to this user', EC.INACCESSIBLE_VALUE);
    }

    const rightMission = data.spaceMissions.find(m => m.missionId === missionId);
    rightMission.description = validDescription;
    rightMission.timeLastEdited = Math.floor(Date.now() / 1000);
    setData(data);
    return {};
  } catch (e) {
    const ne = normalizeError(e);
    throwErrorForFunction(ne.errorCategory, ne.error);
  }
}
