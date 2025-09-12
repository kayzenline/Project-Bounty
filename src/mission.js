// This file should contain your functions relating to:
// - adminMission*
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
function adminMissionRemove(controlUserId, missionId) {
  return {};
}


function adminMissionCreate(controlUserId, name, description, target ) {
    
  return {
    missionId: 2
  };
}
function adminMissionInfo(controlUserId, missionId) {
  return { 
  missionId: 1,
  name: 'Mercury',
  timeCreated: 1683125870,
  timeLastEdited: 1683125871,
  description: "Place a manned spacecraft in orbital flight around the earth. Investigate a persons performance capabilities and their ability to function in the environment of space. Recover the person and the spacecraft safely",
  target: 'Earth orbit'

  }
}