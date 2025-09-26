// This file should contain your functions relating to:
// - adminMission*
import { getData, setData } from './data.js';
import {
  controlUserIdCheck,
  missionIdCheck,
  missionNameValidity,
  missionDescriptionValidity,
  missionTargetValidity,
  normalizeError,
} from './helper.js';
import { errorCategories as EC } from './testSamples.js';

function buildError(message, code) {
  throw { error: message, errorCategory: code };
}

function adminMissionList(controlUserId) {
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
      .filter(m => m.ownerId === controlUserId)
      .map(m => ({ missionId: m.missionId, name: m.name }));

    return { missions };
  } catch (e) {
    return normalizeError(e);
  }
}

//remove mission
function adminMissionRemove(controlUserId, missionId) {
  try {
    const user = controlUserIdCheck(controlUserId);
    const mission = missionIdCheck(missionId);
    const data = getData();
    const missiontarget = data.spaceMissions.find(m => m.missionId === missionId);
    if (missiontarget.ownerId !== user.controlUserId) {
      buildError('Mission does not belong to this user', EC.INACCESSIBLE_VALUE);
    }
    data.spaceMissions = data.spaceMissions.filter(m => m.missionId !== missionId);
    setData(data);
    return {};
  } catch (e) {
    return normalizeError(e);
  }
}

// create a new mission
function adminMissionCreate(controlUserId, name, description, target) {
  try {
    // check the information
    const user = controlUserIdCheck(controlUserId);
    const fixedName = missionNameValidity(name);
    const fixedDescription = missionDescriptionValidity(description);
    const fixedTarget = missionTargetValidity(target);

    const data = getData();
    const duplicate = (data.spaceMissions || []).some(
      mission => mission.ownerId === user.controlUserId && mission.name.toLowerCase() === fixedName.toLowerCase(),
    );
    if (duplicate) {
      buildError('mission name already exists', EC.BAD_INPUT);
    }

    const missionId = (getData().spaceMissions || []).length;
    const timestamp = Math.floor(Date.now() / 1000);
    data.spaceMissions.push({
      missionId,
      ownerId: user.controlUserId,
      name: fixedName,
      description: fixedDescription,
      target: fixedTarget,
      timeCreated: timestamp,
      timeLastEdited: timestamp,
    });

    return { missionId };
  } catch (e) {
    const ne = normalizeError(e);
    return { error: ne.error, errorCategory: ne.errorCategory };
  }
}


function adminMissionInfo(controlUserId, missionId) {
  try {
    const user = controlUserIdCheck(controlUserId);
    const mission = missionIdCheck(missionId);
    if (mission.ownerId !== user.controlUserId) {
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
    // For this API, tests expect missionId-not-found to map to INVALID_CREDENTIALS
    let mappedCategory = ne.errorCategory;
    if (ne.error === 'missionId not found' && ne.errorCategory === EC.INACCESSIBLE_VALUE) {
      mappedCategory = EC.INVALID_CREDENTIALS;
    }
    return { error: ne.error, errorCategory: mappedCategory };
  }
}

//Update mission name
function adminMissionNameUpdate(controlUserId, missionId, name) {
  try {
    const user = controlUserIdCheck(controlUserId);
    const mission = missionIdCheck(missionId);
    const validname = missionNameValidity(name);
    const data = getData();
    const missiontarget = data.spaceMissions.find(m => m.missionId === missionId);
    if (missiontarget.ownerId !== user.controlUserId) {
      buildError('Mission does not belong to this user', EC.INACCESSIBLE_VALUE);
    }
    missiontarget.name = validname;
    setData(data);
    return {}
  } catch (e) {
    return normalizeError(e);
  }
}



// Update mission target
function adminMissionTargetUpdate(controlUserId, missionId, target) {
  try {
    controlUserIdCheck(controlUserId);
    missionIdCheck(missionId);
    missionTargetValidity(target);

    const data = getData();
    const foundMission = data.spaceMissions.find(mission => mission.missionId === missionId);
    foundMission.target = target;
    return {};
  } catch (e) {
    const ne = normalizeError(e);
    return { error: ne.error, errorCategory: ne.errorCategory };
  }
}

// Update mission description
function adminMissionDescriptionUpdate(controlUserId, missionId, description) {
  try {
    controlUserIdCheck(controlUserId);
    missionIdCheck(missionId);
    missionDescriptionValidity(description);

    const data = getData();
    const foundMission = data.spaceMissions.find(mission => mission.missionId === missionId);
    foundMission.description = description;
    return {};
  } catch (e) {
    const ne = normalizeError(e);
    return { error: ne.error, errorCategory: ne.errorCategory };
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
};
