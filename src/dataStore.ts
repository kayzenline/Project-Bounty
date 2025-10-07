import fs from "fs";
import path from "path";

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
  controlUserId: number;
  name: string;
  description: string;
  target: string;
  timeCreated: number;
  timeLastEdited: number;
}

interface DataStore {
  controlUsers: MissionControlUser[];
  spaceMissions: Mission[];
  nextControlUserId: number;
  nextMissionId: number;
}

let data: DataStore = {
  controlUsers: [],
  spaceMissions: [],
  nextControlUserId: 1,
  nextMissionId: 1,
};

export function getData(): DataStore {
  return data;
}

export function setData(newData: DataStore) {
  data = newData;

  fs.writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(data, null, 2));
};

export function loadData() {
  const newData = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json'), 'utf-8'))

  data = newData;
}


export {
  Mission,
  MissionControlUser,
  DataStore
}
