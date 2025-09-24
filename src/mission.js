// This file should contain your functions relating to:
// - adminMission*
import { getData,setData } from './data.js';
import { controlUserIdCheck, missionIdCheck, missionNameValidity } from './helper.js';
import { errorCategories as EC } from './errors.js';
import { missionIdGen } from './helper.js';

function adminMissionList(controlUserId) {
  return {
    missions: [
      {
        missionId: 1,
        name: "Mercury",
      },
      {
        missionId: 2,
        name: "Apollo",
      },
    ],
  };
}
//remove mission
function adminMissionRemove(controlUserId, missionId) {
  let user;
  try {
    user = controlUserIdCheck(controlUserId);
  } catch (e) {
    if(e.code===EC.BAD_INPUT){
      return { error:'controlUserId must be integer'}; 
    }
    if(e.code===EC.INACCESSIBLE_VALUE){
      return { error:'controlUserId not found'};
    }
    return { error: 'Unknown error' };
  }
  let mission;
  try {
    mission = missionIdCheck(missionId);
  } catch (e) {
    if(e.code===EC.BAD_INPUT){
      return { error:'missionId must be integer'}; 
    }
    if(e.code===EC.INACCESSIBLE_VALUE){
      return { error:'missionId not found'};
    }
    return { error: 'Unknown error' };
  }
  const data = getData();
  data.spaceMissions = data.spaceMissions.filter(m => m.missionId !== missionId);
  setData(data);
  return {};
}

// create a mission for a control user
function adminMissionCreate(controlUserId, name, description, target) {
  try {
    // validate control user and mission name
    const user = controlUserIdCheck(controlUserId);
    const fixedName = missionNameValidity(name, 100);

    // generate missionId
    const data = getData();
    const nextId = missionIdGen();


    // persist mission
    const now = Math.floor(Date.now() / 1000);
    data.spaceMissions.push({
      missionId: nextId,
      ownerId: user.controlUserId,
      name: fixedName,
      description: description.trim(),
      target: target.trim(),
      timeCreated: now,
      timeLastEdited: now,
    });

    return { missionId: nextId };
  } catch (e) {
    return { error: String(e.message), errorCategory: e.code ?? e.cause ?? EC.UNKNOWN };
  }
}



function adminMissionInfo(controlUserId, missionId) {
  try {
    // check user id
    const user = controlUserIdCheck(controlUserId);
    // check mission id
    if (!Number.isInteger(missionId) || missionId <= 0) {
      const e = new Error('missionId must be a positive integer');
      e.code = EC.BAD_INPUT;
      throw e;
    }
    // check mission id is matched
    const data = getData();
    const mission = data.spaceMissions.find(m => m.missionId === missionId);
    if (!mission || mission.ownerId !== user.controlUserId) {
      const e = new Error('mission not accessible');
      e.code = EC.INACCESSIBLE_VALUE;
      throw e;
    }

    return {
      missionId: mission.missionId,
      name: mission.name,
      timeCreated: mission.timeCreated,
      timeLastEdited: mission.timeLastEdited,
      description: mission.description,
      target: mission.target,
    };
    // try failed
  } catch (e) {
    return { error: String(e.message), errorCategory: e.code ?? EC.UNKNOWN };
  }
}


function adminMissionNameUpdate(controlUserId, missionId, name) {
  return {}
}



// Update mission target
function adminMissionTargetUpdate(controlUserId, missionId, target) {
  return {};
}

// Update mission description
function adminMissionDescriptionUpdate(controlUserId, missionId, description) {
  return {};
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
