import { getData } from './data.js';

// Helper function to generate unique control user ID
function controlUserIdGen() {
  const data = getData();
  return data.nextControlUserId++;
}

// Helper function to validate password
function isValidPassword(password) {
  // Password must be at least 8 characters long
  return typeof password === 'string' && password.length >= 8;
}

// Helper function to validate name
function isValidName(name) {
  // Name must be a non-empty string with only letters and spaces
  return typeof name === 'string' && 
         name.trim().length > 0 && 
         /^[a-zA-Z\s]+$/.test(name.trim());
}

// Helper function to validate email
function isValidEmail(email) {
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === 'string' && emailRegex.test(email);
}

// Helper function to find user by email
function findUserByEmail(email) {
  const data = getData();
  return data.missionControlUsers.find(user => user.email === email);
}

// Helper function to find user by controlUserId
function findUserById(controlUserId) {
  const data = getData();
  return data.missionControlUsers.find(user => user.controlUserId === controlUserId);
}

export {
  controlUserIdGen,
  isValidPassword,
  isValidName,
  isValidEmail,
  findUserByEmail,
  findUserById
};