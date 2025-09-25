// This file should contain your functions relating to:
// - adminMission*
import { getData, setData } from './data.js';
import {
  controlUserIdCheck,
  missionIdCheck,
  missionNameValidity,
  missionDescriptionValidity,
  missionTargetValidity,
  handleMissonError,
} from './helper.js';
import { errorCategories as EC } from './errors.js';
import { missionIdGen } from './helper.js';

function adminMissionList(controlUserId) {
  try {
    controlUserIdCheck(controlUserId);
  } catch (e) {
    return { error: String(e.message || 'invalid user'), errorCategory: EC.INVALID_CREDENTIALS };
  }

  try {
    const data = getData();
    const missions = (data.spaceMissions || [])
      .filter(m => m.ownerId === controlUserId)
      .map(m => ({ missionId: m.missionId, name: m.name }));

    return { missions };
  } catch (e) {
    return handleMissonError(e);
  }
}
//remove mission
function adminMissionRemove(controlUserId, missionId) {
  try {
    const user = controlUserIdCheck(controlUserId);
    const mission = missionIdCheck(missionId);
    const data = getData();
    const missiontarget= data.spaceMissions.find(m => m.missionId === missionId);//mission ID does not refer to a valid space mission.
    if (missiontarget.ownerId !== controlUserId) {
      //ownerId from missioncreate 
      const e = new Error('Mission does not belong to this user');
      e.code = EC.INACCESSIBLE_VALUE;
      throw e;
    }
    data.spaceMissions = data.spaceMissions.filter(m => m.missionId !== missionId);
    setData(data);
    return {};
  } catch (e) {
    if(e.code===EC.BAD_INPUT){
      return { error:e.message,errorCategory: e.code}; 
    }
    if(e.code===EC.INACCESSIBLE_VALUE){
      return { error:e.message,errorCategory: e.code};
    }
    if (e.code === EC.INVALID_CREDENTIALS) {
      return { error: e.message, errorCategory: e.code };
    }
    return { error: 'Unknown error',errorCategory: 'UNKNOWN'};
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
    const duplicate = data.spaceMissions.some(
      mission => mission.ownerId === user.controlUserId,
    );
    if (duplicate) {
      const e = new Error('mission name already exists');
      e.code = EC.BAD_INPUT;
    }

    const missionId = data.spaceMissions.length;
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
    //console.log('sofjioe', e);
    return e;
    //return handleMissonError(e);
  }
}


function adminMissionInfo(controlUserId, missionId) {
  try {
    const user = controlUserIdCheck(controlUserId);
    const mission = missionIdCheck(missionId);

    //console.log('foej3j', mission.ownerId, user.controlUserId);
    if (mission.ownerId !== user.controlUserId) {
      throw {
        error: 'sdiofje',
        errorCategory: EC.INACCESSIBLE_VALUE,
      }
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
    return handleMissonError(err);
  }
}

//Update mission name
function adminMissionNameUpdate(controlUserId, missionId, name) {
  try {
    const user = controlUserIdCheck(controlUserId);
    const mission = missionIdCheck(missionId);
    const validname = missionNameValidity(name);
    const data = getData();
    const missiontarget= data.spaceMissions.find(m => m.missionId === missionId);//mission ID does not refer to a valid space mission.
    //mission ID does not refer to a space mission that this mission control user owns.
    if (missiontarget.ownerId !== controlUserId) {
      //ownerId from missioncreate 
      const e = new Error('Mission does not belong to this user');
      e.code = EC.INACCESSIBLE_VALUE;
      throw e;
    }
    missiontarget.name = validname;
    setData(data);
    return {}
  } catch (e) {
    if(e.code===EC.BAD_INPUT){
      return { error:e.message,errorCategory: e.code}; 
    }
    if(e.code===EC.INACCESSIBLE_VALUE){
      return { error:e.message,errorCategory: e.code};
    }
    if (e.code === EC.INVALID_CREDENTIALS) {
      return { error: e.message, errorCategory: e.code };
    }
    return { error: 'Unknown error' ,errorCategory: 'UNKNOWN'};
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
    return { error: String(e.message), errorCategory: e.code ?? EC.UNKNOWN };
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
    return { error: String(e.message), errorCategory: e.code ?? EC.UNKNOWN };
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
