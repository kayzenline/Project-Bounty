// This file should contain your functions relating to:
// - adminMission*
import { getData, setData } from './dataStore';
import {
  controlUserIdCheck,
  missionIdCheck,
  missionNameValidity,
  missionDescriptionValidity,
  missionTargetValidity,
  missionIdGen,
  normalizeError,
  ServiceError
} from './helper';
import { errorCategories as EC } from './testSamples';

function buildError(message: string, code: string): never {
  throw new ServiceError(message, code);
}

function adminMissionList(controlUserId: number) {
  try {
    controlUserIdCheck(controlUserId);
  } catch (e) {
    // Contract expects INVALID_CREDENTIALS for unknown users here
    const ne = normalizeError(e);
    return { error: ne.error || 'invalid user', errorCategory: EC.INVALID_CREDENTIALS };
  }

  try {
    const data = getData();
    const missions = (data.spaceMissions || [])
      .filter(m => m.controlUserId === controlUserId)
      .map(m => ({ missionId: m.missionId, name: m.name }));

    return { missions };
  } catch (e) {
    return normalizeError(e);
  }
}

// remove mission
function adminMissionRemove(controlUserId: number, missionId: number) {
  try {
    const user = controlUserIdCheck(controlUserId);
    const mission = missionIdCheck(missionId);
    if (mission.controlUserId !== user.controlUserId) {
      buildError('Mission does not belong to this user', EC.INACCESSIBLE_VALUE);
    }
    const data = getData();
    const missions = data.spaceMissions || [];
    data.spaceMissions = missions.filter(m => m.missionId !== missionId);
    setData(data);
    return {};
  } catch (e) {
    return normalizeError(e);
  }
}

// create a new mission
function adminMissionCreate(controlUserId: number, name: string, description: string, target: string) {
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
      throw buildError('mission name already exists', EC.BAD_INPUT);
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
    });

    setData(data);
    return { missionId };
  } catch (e) {
    const ne = normalizeError(e);
    return { error: ne.error, errorCategory: ne.errorCategory };
  }
}

function adminMissionInfo(controlUserId: number, missionId: number) {
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
    };
  } catch (err) {
    const ne = normalizeError(err);
    return { error: ne.error, errorCategory: ne.errorCategory };
  }
}

// Update mission name
function adminMissionNameUpdate(controlUserId: number, missionId: number, name: string) {
  try {
    const user = controlUserIdCheck(controlUserId);
    missionIdCheck(missionId);
    const validname = missionNameValidity(name);
    const data = getData();
    const missiontarget = data.spaceMissions.find(m => m.missionId === missionId);
    if (missiontarget.controlUserId !== user.controlUserId) {
      buildError('Mission does not belong to this user', EC.INACCESSIBLE_VALUE);
    }

    const duplicate = data.spaceMissions.some(m =>
      m.controlUserId === user.controlUserId &&
      m.missionId !== missionId &&
      m.name.toLowerCase() === validname.toLowerCase()
    );
    if (duplicate) {
      buildError('mission name already exists', EC.BAD_INPUT);
    }
    missiontarget.name = validname;
    missiontarget.timeLastEdited = Math.floor(Date.now() / 1000);
    setData(data);
    return {};
  } catch (e) {
    const ne = normalizeError(e);
    return { error: ne.error, errorCategory: ne.errorCategory };
  }
}

// Update mission target
function adminMissionTargetUpdate(controlUserId: number, missionId: number, target: string) {
  try {
    const user = controlUserIdCheck(controlUserId);
    const mission = missionIdCheck(missionId);
    const validTarget = missionTargetValidity(target);

    if (mission.controlUserId !== user.controlUserId) {
      buildError('Mission does not belong to this user', EC.INACCESSIBLE_VALUE);
    }

    const data = getData();
    const foundMission = data.spaceMissions.find(missionObj => missionObj.missionId === missionId);
    foundMission.target = validTarget;
    foundMission.timeLastEdited = Math.floor(Date.now() / 1000);
    setData(data);
    return {};
  } catch (e) {
    const ne = normalizeError(e);
    return { error: ne.error, errorCategory: ne.errorCategory };
  }
}

// Update mission description
function adminMissionDescriptionUpdate(controlUserId: number, missionId: number, description: string) {
  try {
    // create check condition
    const user = controlUserIdCheck(controlUserId);
    const mission = missionIdCheck(missionId);
    const validDescription = missionDescriptionValidity(description);

    if (mission.controlUserId !== user.controlUserId) {
      buildError('Mission does not belong to this user', EC.INACCESSIBLE_VALUE);
    }

    const data = getData();
    const foundMission = data.spaceMissions.find(missionObj => missionObj.missionId === missionId);
    foundMission.description = validDescription;
    foundMission.timeLastEdited = Math.floor(Date.now() / 1000);
    setData(data);
    return {};
  } catch (e) {
    const ne = normalizeError(e);
    return { error: ne.error, errorCategory: ne.errorCategory };
  }
}
// Transfer mission ownership to another control user by email
function adminMissionTransfer(controlUserId: number, missionId: number, userEmail: string) {
  try {
    // Validate user and mission
    const user = controlUserIdCheck(controlUserId);
    const mission = missionIdCheck(missionId);

    // Check mission ownership
    if (mission.controlUserId !== user.controlUserId) {
      buildError('Mission does not belong to this user', EC.INACCESSIBLE_VALUE);
    }

    // Validate email
    if (!userEmail || typeof userEmail !== 'string') {
      buildError('Missing userEmail', EC.BAD_INPUT);
    }

    // Find target user
    const data = getData();
    const controlUsers = data.controlUsers || [];
    const target = controlUsers.find((u: { email: string; controlUserId: number }) => u.email === userEmail);
    if (!target) {
      buildError('Target user does not exist', EC.BAD_INPUT);
    }

    // Prevent self-transfer
    if (target.controlUserId === user.controlUserId) {
      buildError('Cannot transfer to yourself', EC.INACCESSIBLE_VALUE);
    }

    // Check duplicate mission name
    const fixedName = mission.name.trim().toLowerCase();
    type MissionRow = { controlUserId: number; name: string };
    const duplicate = (data.spaceMissions || []).some((m: MissionRow) =>
      m.controlUserId === target.controlUserId &&
      (m.name ?? '').trim().toLowerCase() === fixedName
    );
    if (duplicate) {
      buildError('Duplicate mission name for target user', EC.INACCESSIBLE_VALUE);
    }

    // Transfer ownership
    mission.controlUserId = target.controlUserId;
    mission.timeLastEdited = Math.floor(Date.now() / 1000);
    setData(data);

    return {};
  } catch (e) {
    return normalizeError(e);
  }
}

export {
  adminMissionList,
  adminMissionCreate,
  adminMissionInfo,
  adminMissionRemove,
  adminMissionNameUpdate,
  adminMissionTargetUpdate,
  adminMissionDescriptionUpdate,
  adminMissionTransfer,
};
