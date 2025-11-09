import { validate as uuidValidate } from 'uuid';

export const isValidUUID = (id) => {
  return uuidValidate(id);
};

export const validateUserData = (data) => {
  const errors = [];
  
  if (!data.username || typeof data.username !== 'string') {
    errors.push('username is required and must be a string');
  }
  
  if (data.age === undefined || typeof data.age !== 'number') {
    errors.push('age is required and must be a number');
  }
  
  if (!Array.isArray(data.hobbies)) {
    errors.push('hobbies is required and must be an array');
  }
  
  return { valid: errors.length === 0, errors };
};