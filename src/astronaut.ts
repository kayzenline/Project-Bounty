// This file should contain your functions relating to:
// - adminAstronaut*

import { getData, setData, Astronaut } from './dataStore';
import {
  isValidName,
  isValidRank,
  isValidAge,
  isValidWeight,
  isValidHeight,
  astronautIdGen,
  astronautIdCheck,
  findAstronautById,
  normalizeError,
  ServiceError
} from './helper';
import { errorCategories as EC } from './testSamples';

function buildError(message: string, code: string): never {
  throw new ServiceError(message, code);
}

// Create a new astronaut
function adminAstronautCreate(
  nameFirst: string,
  nameLast: string,
  rank: string,
  age: number,
  weight: number,
  height: number
) {
  try {
    // Validate first name
    if (!isValidName(nameFirst)) {
      buildError('Invalid first name', EC.BAD_INPUT);
    }

    // Validate last name
    if (!isValidName(nameLast)) {
      buildError('Invalid last name', EC.BAD_INPUT);
    }

    // Validate rank
    if (!isValidRank(rank)) {
      buildError('Invalid rank', EC.BAD_INPUT);
    }

    // Validate age
    if (!isValidAge(age)) {
      buildError('Invalid age', EC.BAD_INPUT);
    }

    // Validate weight
    if (!isValidWeight(weight)) {
      buildError('Invalid weight', EC.BAD_INPUT);
    }

    // Validate height
    if (!isValidHeight(height)) {
      buildError('Invalid height', EC.BAD_INPUT);
    }

    const data = getData();

    // Check for duplicate astronaut (same first and last name)
    const duplicate = data.astronauts.find(a =>
      a.nameFirst.toLowerCase() === nameFirst.toLowerCase() &&
      a.nameLast.toLowerCase() === nameLast.toLowerCase()
    );

    if (duplicate) {
      buildError('Astronaut with same name already exists', EC.BAD_INPUT);
    }

    // Create new astronaut
    const astronautId = astronautIdGen();
    const timestamp = Math.floor(Date.now() / 1000);

    const newAstronaut: Astronaut = {
      astronautId,
      nameFirst: nameFirst.trim(),
      nameLast: nameLast.trim(),
      rank: rank.trim(),
      age,
      weight,
      height,
      timeAdded: timestamp,
      timeLastEdited: timestamp
    };

    if (!data.astronauts) {
      data.astronauts = [];
    }

    data.astronauts.push(newAstronaut);
    setData(data);

    return { astronautId };
  } catch (e) {
    const ne = normalizeError(e);
    return { error: ne.error, errorCategory: ne.errorCategory };
  }
}

export {
  adminAstronautCreate,
};
