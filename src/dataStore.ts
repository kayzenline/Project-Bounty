import fs from 'fs';
import path from 'path';

// Global data store
export interface MissionControlUser {
  controlUserId: number,
  email: string,
  password: string,
  nameFirst: string,
  nameLast: string,
  flagLastLogin: boolean,
  numSuccessfulLogins: number,
  numFailedPasswordsSinceLastLogin: number,
  passwordHistory: string[]
}

export interface LaunchDetailsVehicleSummary {
  launchVehicleId: number,
  name: string,
  maneuveringFuelRemaining: number
}

export interface LaunchDetailsAstronautSummary {
  astronautId: number,
  designation: string
}

export interface LaunchDetails {
  launchId: number,
  missionCopy: Mission,
  timeCreated: number,
  state: missionLaunchState,
  launchVehicle: LaunchDetailsVehicleSummary,
  payload: Payload,
  allocatedAstronauts: LaunchDetailsAstronautSummary[],
  launchCalculationParameters: LaunchCalcParameters
}
export interface AstronautDetail {
  astronautId: number,
  designation: string,
  assigned: boolean
}

export interface AssignedMission {
  missionId: number;
  objective: string;
}
export interface AstronautResponse {
  astronautId: number;
  designation: string;
  timeAdded: number;
  timeLastEdited: number;
  age: number;
  weight: number;
  height: number;
  assignedMission?: AssignedMission;
}
interface Mission {
  missionId: number,
  controlUserId: number,
  name: string,
  description: string,
  target: string,
  timeCreated: number,
  timeLastEdited: number,
  assignedAstronauts: { astronautId: number, designation: string }[]
}

interface ChatHistory {
  launchId: number
  astronautId: number
  messageLog: MessageLog[]
}

interface MessageLog {
  astronautId: number
  messageId: number
  chatbotResponse: boolean
  messageContent: string
  timeSent: number
}
interface Session {
  controlUserSessionId: string,
  controlUserId: number
}

export interface Astronaut {
  astronautId: number,
  designation: string,
  timeAdded: number,
  timeLastEdited: number,
  nameFirst: string,
  nameLast: string,
  rank: string,
  age: number,
  weight: number;
  height: number,
  assignedMission: {
    missionId: number,
    objective: string,
  }
}

// these would most likely be defined in your dataStore or interfaces
export enum missionLaunchState {
  READY_TO_LAUNCH = 'READY_TO_LAUNCH',
  LAUNCHING = 'LAUNCHING',
  MANEUVERING = 'MANEUVERING',
  COASTING = 'COASTING',
  MISSION_COMPLETE = 'MISSION_COMPLETE',
  REENTRY = 'REENTRY',
  ON_EARTH = 'ON_EARTH'
}

export enum missionLaunchAction {
  LIFTOFF = 'LIFTOFF',
  CORRECTION = 'CORRECTION',
  FIRE_THRUSTERS = 'FIRE_THRUSTERS',
  DEPLOY_PAYLOAD = 'DEPLOY_PAYLOAD',
  GO_HOME = 'GO_HOME',
  FAULT = 'FAULT',
  RETURN = 'RETURN',
  SKIP_WAITING = 'SKIP_WAITING'
}
export interface LaunchVehicle {
  launchVehicleId: number, // an id for this entity
  name: string, // a name for this launch vehicle
  description: string, // a description for this launch vehicle
  maxCrewWeight: number, // maximum weight (kg) of astronauts this launch vehicle can carry
  maxPayloadWeight: number, // maximum weight (kg) of payload this launch vehicle can carry
  launchVehicleWeight: number, // weight (kg) of this launch vehicle
  thrustCapacity: number, // amount of force this launch vehicle generates when it burns thrustFuel
  maneuveringFuel: number, // amount of maneuvering fuel (units) this launch vehicle has to start each launch
  timeAdded: number, // created time in seconds
  timeLastEdited: number, // last time a value was edited in seconds
  retired: boolean, // is this launch vehicle active or not
  assigned: boolean // is this launch vehicle assigned
}

export interface LaunchVehicleHistoryEntry {
  launch: string;
  state: string;
}

export interface LaunchVehicleInfo {
  launchVehicleId: number;
  name: string;
  description: string;
  maxCrewWeight: number;
  maxPayloadWeight: number;
  launchVehicleWeight: number;
  thrustCapacity: number;
  startingManeuveringFuel: number;
  retired: boolean;
  timeAdded: number;
  timeLastEdited: number;
  launches: LaunchVehicleHistoryEntry[];
}

export interface Payload {
  payloadId: number, // an id for this entity
  description: string, // a description for this payload
  weight: number, // a weight (kg) for this payload
  deployed: boolean, // has this payload been deployed or not?
  timeOfDeployment: number,
  deployedLaunchId: number
  // extra properties can be added to this payload to help with the bonus tasks
}

export interface PayloadInput {
  description: string,
  weight: number
}

export interface LaunchCalcParameters {
  targetDistance: number, // distance (m) to the target destination for this launch
  thrustFuel: number, // amount of fuel that is allocated to the launch vehicle for this launch
  fuelBurnRate: number, // rate at which the launch vehicle burns its `thrustFuel`
  activeGravityForce: number, // downward force of gravity acting against the thrust capacity of the launch vehicle
  maneuveringDelay: number // how long does the launch wait before automatically going from `MANEUVERING` state to `COASTING` state
}

export interface Launch {
  launchId: number, // an id for this entity
  missionCopy: Mission, // copy of the mission that this launch is based on. Note - it must be deep copy so that if the original mission is changed, this copy remains unchanged
  createdAt: number, // time in seconds that this launch was created
  state: missionLaunchState, // what is the current state of this launch, always begins at 'READY_TO_LAUNCH'
  assignedLaunchVehicleId: number, // launch vehicle assigned to this launch
  remainingLaunchVehicleManeuveringFuel: number, // how much maneuvering fuel is left in the launch vehicle currently assigned to this launch
  payloadId: number, // payload assigned to this launch
  allocatedAstronauts: number[], // array of astronautId's that are allocated to this launch
  launchCalculationParameters: LaunchCalcParameters
}

export interface LaunchInput {
  launchVehicleId: number,
  payload: PayloadInput,
  launchParameters: LaunchCalcParameters
}

const DB_PATH = path.join(__dirname, 'db.json');

interface DataStore {
  controlUsers: MissionControlUser[],
  spaceMissions: Mission[],
  nextControlUserId: number,
  nextMissionId: number,
  nextAstronautId: number,
  nextLaunchVehicleId: number,
  newtLaunchId: number,
  nextPayloadId: number,
  sessions: Session[],
  astronauts: Astronaut[],
  launchVehicles: LaunchVehicle[],
  launches: Launch[],
  payload: Payload[]
  chatHistory: ChatHistory[]
}

let data: DataStore = {
  controlUsers: [],
  spaceMissions: [],
  nextControlUserId: 1,
  nextMissionId: 1,
  nextAstronautId: 1,
  nextLaunchVehicleId: 1,
  newtLaunchId: 1,
  nextPayloadId: 1,
  sessions: [],
  astronauts: [],
  launchVehicles: [],
  launches: [],
  payload: [],
  chatHistory: []
};

function createIfNotExist() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  }
}

export function getData(): DataStore {
  loadData();
  return data;
}

export function setData(newData: DataStore) {
  data = newData;
  saveData();
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
  DataStore,
  Session,
  MessageLog,
  ChatHistory
};
