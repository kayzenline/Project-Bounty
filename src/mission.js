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