// This file should contain your functions relating to:
// - clear
import { getData } from './dataStore';

// Reset application state
// Function to clear all data (for testing)

export function clear() {
  const data = getData();
  data.controlUsers = [];
  data.spaceMissions = [];
  data.nextControlUserId = 1;
  data.nextMissionId = 1;
  return {};
}
