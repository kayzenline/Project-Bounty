import { LaunchInput, LaunchVehicleInfo } from '../../src/dataStore';

export const sampleUser1 = {
  nameFirst: 'fnameOne',
  nameLast: 'lnameOne',
  email: 'user1@test.com',
  password: 'user1password'
};

export const sampleUser2 = {
  nameFirst: 'fnameTwo',
  nameLast: 'lnameTwo',
  email: 'user2@test.com',
  password: 'user2password'
};

export const sampleMission1 = {
  name : "Mission1Name",
  description : "Mission1Desc",
  target : "Mission1Target"
};

export const sampleMission2 = {
  name : "Mission2Name",
  description : "Mission2Desc",
  target : "Mission2Target"
};

export const sampleAstronaut = {
  nameFirst: "James",
  nameLast: "Kirk",
  rank: "Captain",
  age: 35,
  height: 178,
  weight: 70
};
  
export const sampleLaunchVehicle1 = {
  name: "Saturn V",
  description: "Multi-stage Booster Rocket",
  maxCrewWeight: 500,
  maxPayloadWeight: 1000,
  launchVehicleWeight: 4000,
  thrustCapacity: 1000000,
  maneuveringFuel: 10
};

export const sampleLaunchVehicle2 = {
  name: "Saturn VI",
  description: "Multi-stage Booster Rocket Pro",
  maxCrewWeight: 400,
  maxPayloadWeight: 900,
  launchVehicleWeight: 3000,
  thrustCapacity: 900000,
  maneuveringFuel: 20
};

export const sampleLaunchVehicle3 = {
  name: "Saturn VII",
  description: "Multi-stage Booster Rocket",
  maxCrewWeight: 120,
  maxPayloadWeight: 1000,
  launchVehicleWeight: 4000,
  thrustCapacity: 1000000,
  maneuveringFuel: 10
};

export const samplePayload1 = {
  description: "UNSW Cubesat",
  weight: 400
};

export const samplePayload2 = {
  description: "MIT Cubesat",
  weight: 300
};

export const sampleLaunchParameters1 = {
  targetDistance: 12000,
  fuelBurnRate: 20,
  thrustFuel: 1000,
  activeGravityForce: 9.8,
  maneuveringDelay: 2
};

export const sampleLaunchParameters2 = {
  targetDistance: 13000,
  fuelBurnRate: 30,
  thrustFuel: 1100,
  activeGravityForce: 9.8,
  maneuveringDelay: 3
};

export const sampleLaunch1: LaunchInput = {
  launchVehicleId : -1,
  payload: {
    description: "UNSW Cubesat",
    weight: 400
  },
  launchParameters: {
    targetDistance: 12000,
    fuelBurnRate: 20,
    thrustFuel: 1000,
    activeGravityForce: 9.8,
    maneuveringDelay: 2
  }
};

export const launchVehicleInfo: LaunchVehicleInfo = {
  name: sampleLaunchVehicle1.name,
  description: sampleLaunchVehicle1.description,
  maxCrewWeight: sampleLaunchVehicle1.maxCrewWeight,
  maxPayloadWeight: sampleLaunchVehicle1.maxPayloadWeight,
  launchVehicleWeight: sampleLaunchVehicle1.launchVehicleWeight,
  thrustCapacity: sampleLaunchVehicle1.thrustCapacity,
  startingManeuveringFuel: sampleLaunchVehicle1.maneuveringFuel,
  retired: false,
  launches: []
};