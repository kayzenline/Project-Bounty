// Global data store
let data = {
  missionControlUsers: [],
  spaceMissions: [],
  nextControlUserId: 1,
  nextMissionId: 1,
};

export function getData() {
  return data;
}

export function setData(newData) {
  data = newData;
}

export function clear() {
  data = {
    missionControlUsers: [],
    spaceMissions: [],
    nextControlUserId: 1,
    nextMissionId: 1,
  };
  return {};
}