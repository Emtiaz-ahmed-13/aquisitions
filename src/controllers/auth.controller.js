import { db } from '#config/database.js';
import logger from '#config/logger.js';
import { users } from '#models/user.model.js';
import { createUser } from '#services/auth.service.js';
import { cookies } from '#utils/cookies.js';
import { jwttoken } from '#utils/jwt.js';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

export const signup = async (req, res, next) => {
  try {
    // Check if req.body exists
    if (!req.body) {
      return res.status(400).json({
        error: 'validation failed',
        details: 'Invalid input - no data provided',
      });
    }

    const { name, email, password } = req.body;

    // Input validation (should be done BEFORE any processing)
    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'validation failed',
        details: 'Invalid input - Name, email, and password are required',
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'validation failed',
        details: 'Invalid input - Invalid email format',
      });
    }

    // Create user through service layer
    const user = await createUser({
      name,
      email,
      password,
      role: 'user',
    });

    // Generate JWT token
    const token = jwttoken.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Set authentication cookie
    cookies.set(res, 'token', token);

    // Log successful signup
    logger.info(`User signed up successfully: ${email}`);

    // Return success response
    res.status(201).json({
      message: 'User signed up successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error('Error during signup', {
      error: error.message,
      stack: error.stack,
    });

    // Handle specific business logic errors
    if (error.message === 'User with this email already exists') {
      return res.status(409).json({
        error: 'Email already exists',
        details: 'A user with this email address already exists',
      });
    }

    // Handle validation errors from service layer
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'validation failed',
        details: error.message,
      });
    }

    // Pass other errors to error handler middleware
    next(error);
  }
};

// Add the missing authenticateUser function to the controller
export const authenticateUser = async ({ email, password }) => {
  try {
    // Find user by email
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!existingUser) {
      throw new Error('User not found');
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    logger.info(`User ${existingUser.email} authenticated successfully`);
    return {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.role,
    };
  } catch (error) {
    logger.error(`Error authenticating user: ${error.message}`);
    throw error;
  }
};

export const signIn = async (req, res, next) => {
  try {
    // Check if req.body exists
    if (!req.body) {
      return res.status(400).json({
        error: 'validation failed',
        details: 'Invalid input - no data provided',
      });
    }

    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'validation failed',
        details: 'Invalid input - Email and password are required',
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'validation failed',
        details: 'Invalid input - Invalid email format',
      });
    }

    // Authenticate user through service layer
    const user = await authenticateUser({ email, password });

    // Generate JWT token
    const token = jwttoken.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Set authentication cookie
    cookies.set(res, 'token', token);

    // Log successful signin
    logger.info(`User signed in successfully: ${email}`);

    // Return success response
    res.status(200).json({
      message: 'User signed in successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error('Error during signin', {
      error: error.message,
      stack: error.stack,
    });

    // Handle specific business logic errors
    if (
      error.message === 'User not found' ||
      error.message === 'Invalid password'
    ) {
      return res.status(401).json({
        error: 'Invalid credentials',
        details: 'The email or password you entered is incorrect',
      });
    }

    // Pass other errors to error handler middleware
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    // Clear authentication cookie
    cookies.clear(res, 'token');

    // Log successful signout
    logger.info('User signed out successfully');

    // Return success response
    res.status(200).json({
      message: 'User signed out successfully',
    });
  } catch (error) {
    logger.error('Error during signout', {
      error: error.message,
      stack: error.stack,
    });
    // Pass errors to error handler middleware
    next(error);
  }
};
