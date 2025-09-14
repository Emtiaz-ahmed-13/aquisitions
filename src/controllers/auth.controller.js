import logger from '#config/logger.js';
import { createUser } from '#services/auth.service.js';
import { jwttoken } from '#utils/jwt.js';
import { cookies } from '#utils/cookies.js';

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
      role: 'user' 
    });
    
    // Generate JWT token
    const token = jwttoken.sign({ 
      id: user.id, 
      email: user.email, 
      role: user.role 
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
    logger.error('Error during signup', { error: error.message, stack: error.stack });

    // Handle specific business logic errors
    if (error.message === 'User with this email already exists') {
      return res.status(409).json({ 
        error: 'Email already exists',
        details: 'A user with this email address already exists' 
      });
    }

    // Handle validation errors from service layer
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'validation failed',
        details: error.message 
      });
    }

    // Pass other errors to error handler middleware
    next(error);
  }
};
