//user obj
// id 
// username 
// age 
// hobbies 



const users = new Map();

export const getAllUsers = async () => {
  return Array.from(users.values());
};

export const getUserById = async (id) => {
  return users.get(id);
};

export const createUser = async (user) => {
  users.set(user.id, user);
  return user;
};

export const updateUser = async (id, user) => {
  if (!users.has(id)) {
    return undefined;
  }
  users.set(id, user);
  return user;
};

export const deleteUser = async (id) => {
  return users.delete(id);
};

export const clearAll = async () => {
  users.clear();
};