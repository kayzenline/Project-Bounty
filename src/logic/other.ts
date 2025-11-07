// This file should contain your functions relating to:
// - clear
import { getData, setData } from '../dataStore';
import type { Request, Response } from 'express';
// Reset application state
// Function to clear all data (for testing)

export function clear() {
  const data = getData();
  data.controlUsers = [];
  data.spaceMissions = [];
  data.sessions = [];
  data.nextControlUserId = 1;
  data.nextMissionId = 1;
  data.nextAstronautId = 1;
  data.astronauts = [];
  setData(data);
  return {};
}

export function clearHandler(_req: Request, res: Response) {
  return res.status(200).json(clear());
}
