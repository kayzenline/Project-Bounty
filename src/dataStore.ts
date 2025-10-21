import fs from 'fs';
import path from 'path';
import { string } from 'yaml/dist/schema/common/string';

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
  sessions: Session[];
  astronauts: Astronaut[];
}

interface Session {
  controlUserSessionId:string;
  controlUserId: number;
}

interface Astronaut {
  astronautId: number;
  designation: string;
  timeAdded: number;
  timeLastEdited: number;
  nameFirst: string;
  nameLast: string;
  rank: number;
  age: number;
  weight: number;
  height: number;
  assignedMission: {
    missionId: number;
    objective: string;
  }
}

const DB_PATH = path.join(__dirname, 'db.json');

let data: DataStore = {
  controlUsers: [],
  spaceMissions: [],
  nextControlUserId: 1,
  nextMissionId: 1,
  sessions: [],
  astronauts: [],
};

function createIfNotExist() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  }
}

export function getData(): DataStore {
  return data;
}

export function setData(newData: DataStore) {
  data = newData;
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export function loadData() {
  createIfNotExist();
  const newData = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  data = newData;
}
export function saveData() {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export {
  Mission,
  MissionControlUser,
  DataStore,
  Session
};
