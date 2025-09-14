import logger from '#config/logger.js';

// Use the same in-memory user store
let users = [];

// Initialize with some sample users for testing
users = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    password: '$2b$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', // dummy hash
    role: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Regular User',
    email: 'user@example.com',
    password: '$2b$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', // dummy hash
    role: 'user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const getAllUsers = async () => {
  try {
    // Return users without passwords
    return users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  } catch (e) {
    logger.error('Error getting users', e);
    throw e;
  }
};

export const getUserById = async (id) => {
  try {
    const user = users.find(user => user.id === parseInt(id));

    if (!user) {
      throw new Error('User not found');
    }

    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (e) {
    logger.error(`Error getting user by id ${id}:`, e);
    throw e;
  }
};

export const updateUser = async (id, updates) => {
  try {
    const userIndex = users.findIndex(user => user.id === parseInt(id));

    if (userIndex === -1) {
      throw new Error('User not found');
    }

    // Check if email is being updated and if it already exists
    if (updates.email && updates.email !== users[userIndex].email) {
      const emailExists = users.some(user => user.email === updates.email);
      if (emailExists) {
        throw new Error('Email already exists');
      }
    }

    // Update user
    users[userIndex] = {
      ...users[userIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    // Return user without password
    const { password, ...updatedUser } = users[userIndex];
    logger.info(`User ${updatedUser.email} updated successfully`);
    return updatedUser;
  } catch (e) {
    logger.error(`Error updating user ${id}:`, e);
    throw e;
  }
};

export const deleteUser = async (id) => {
  try {
    const userIndex = users.findIndex(user => user.id === parseInt(id));

    if (userIndex === -1) {
      throw new Error('User not found');
    }

    // Remove user and return it without password
    const [deletedUser] = users.splice(userIndex, 1);
    const { password, ...userWithoutPassword } = deletedUser;
    
    logger.info(`User ${userWithoutPassword.email} deleted successfully`);
    return userWithoutPassword;
  } catch (e) {
    logger.error(`Error deleting user ${id}:`, e);
    throw e;
  }
};