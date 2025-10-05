// Global data store
interface MissionControlUser {
  controlUserId: number;
  email: string;
  password: string;
  nameFirst: string;
  nameLast: string;
  numSuccessfulLogins: number;
  numFailedPasswordsSinceLastLogin: number;
  passwordHistory: string[];
}

interface Mission {
  missionId: number;
  ownerId: number;
  name: string;
  description: string;
  target: string;
  timeCreated: number;
  timeLastEdited: number;
}

interface DataStore {
  missionControlUsers: MissionControlUser[];
  spaceMissions: Mission[];
  nextControlUserId: number;
  nextMissionId: number;
}

let data: DataStore = {
  missionControlUsers: [],
  spaceMissions: [],
  nextControlUserId: 1,
  nextMissionId: 1,
};

export function getData(): DataStore {
  return data;
}

export function setData(newData: DataStore) {
  data = newData;
};
