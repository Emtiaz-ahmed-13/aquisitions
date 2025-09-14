import logger from '#config/logger.js';
import bcrypt from 'bcrypt';

// In-memory user store for development
const users = [];

export const hashPassword = async (password) => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    logger.error(`Error in hashing password: ${error.message}`);
    throw new Error('Error in hashing password');
  }
};

export const createUser = async ({ name, email, password, role }) => {
  try {
    // Check if user already exists
    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash the password
    const passwordHash = await hashPassword(password);

    // Create new user
    const newUser = {
      id: users.length + 1,
      name,
      email,
      password: passwordHash,
      role: role || 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    users.push(newUser);

    logger.info(`New user created: ${email}`);
    
    // Return user without password
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  } catch (error) {
    logger.error(`Error in creating user: ${error.message}`);
    throw error;
  }
};

export const authenticateUser = async ({ email, password }) => {
  try {
    // Find user by email
    const existingUser = users.find(user => user.email === email);

    if (!existingUser) {
      throw new Error('User not found');
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    logger.info(`User ${existingUser.email} authenticated successfully`);
    
    // Return user without password
    const { password, ...userWithoutPassword } = existingUser;
    return userWithoutPassword;
  } catch (error) {
    logger.error(`Error authenticating user: ${error.message}`);
    throw error;
  }
};