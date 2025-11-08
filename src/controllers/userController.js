import { v4 as uuidv4 } from 'uuid';
import * as db from '../db/db.js';
import { isValidUUID, validateUserData } from '../utils/validator.js';
import { sendJSON, parseBody } from '../utils/helpers.js';

//get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await db.getAllUsers();
    sendJSON(res, 200, users);
  } catch (error) {
    sendJSON(res, 500, { message: 'Internal server error' });
  }
};

//get user
export const getUserById = async (req, res, userId) => {
  if (!isValidUUID(userId)) {
    sendJSON(res, 400, { message: 'Invalid userId (not UUID)' });
    return;
  }

  const user = await db.getUserById(userId);
  
  if (!user) {
    sendJSON(res, 404, { message: 'User not found' });
    return;
  }

  sendJSON(res, 200, user);
};

// create user
export const createUser = async (req, res) => {
  try {
    const userData = await parseBody(req);
    const validation = validateUserData(userData);
    
    if (!validation.valid) {
      sendJSON(res, 400, { 
        message: 'Required fields are missing', 
        errors: validation.errors 
      });
      return;
    }

    const newUser = {
      id: uuidv4(),
      ...userData
    };

    const createdUser = await db.createUser(newUser);
    sendJSON(res, 201, createdUser);
  } catch (error) {
    sendJSON(res, 400, { message: 'Invalid JSON' });
  }
};

// update user
export const updateUser = async (req, res, userId) => {
  if (!isValidUUID(userId)) {
    sendJSON(res, 400, { message: 'Invalid userId (not UUID)' });
    return;
  }

  try {
    const userData = await parseBody(req);
    const validation = validateUserData(userData);
    
    if (!validation.valid) {
      sendJSON(res, 400, { 
        message: 'Required fields are missing', 
        errors: validation.errors 
      });
      return;
    }

    const updatedUser = {
      id: userId,
      ...userData
    };

    const result = await db.updateUser(userId, updatedUser);
    
    if (!result) {
      sendJSON(res, 404, { message: 'User not found' });
      return;
    }

    sendJSON(res, 200, result);
  } catch (error) {
    sendJSON(res, 400, { message: 'Invalid JSON' });
  }
};

//del user
export const deleteUser = async (req, res, userId) => {
  if (!isValidUUID(userId)) {
    sendJSON(res, 400, { message: 'Invalid userId (not UUID)' });
    return;
  }

  const deleted = await db.deleteUser(userId);
  
  if (!deleted) {
    sendJSON(res, 404, { message: 'User not found' });
    return;
  }

  res.writeHead(204);
  res.end();
};