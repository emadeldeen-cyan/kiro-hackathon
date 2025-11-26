import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { IUserService } from '../services';

const router = Router();

// JWT secret from environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Initialize with user service (will be injected)
let userService: IUserService;

export function initAuthRoutes(service: IUserService): Router {
  userService = service;
  return router;
}

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'Username, email, and password are required',
        statusCode: 400,
      });
      return;
    }

    // Register user
    const user = await userService.registerUser(username, email, password);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET
    );

    // Return user data (without password hash) and token
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    if (error instanceof Error) {
      // Handle specific validation errors
      if (error.message.includes('already exists') || error.message.includes('Password must be')) {
        res.status(409).json({
          error: 'Conflict',
          message: error.message,
          statusCode: 409,
        });
        return;
      }
    }

    // Handle unexpected errors
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred during registration',
      statusCode: 500,
    });
  }
});

/**
 * POST /api/auth/login
 * Authenticate a user and return JWT token
 */
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    // Validate required fields
    if (!username || !password) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'Username and password are required',
        statusCode: 400,
      });
      return;
    }

    // Authenticate user
    const authResult = await userService.authenticateUser(username, password);

    // Generate JWT token
    const token = jwt.sign(
      { userId: authResult.userId, username: authResult.username },
      JWT_SECRET
    );

    // Return authentication result
    res.status(200).json({
      message: 'Login successful',
      userId: authResult.userId,
      username: authResult.username,
      token,
    });
  } catch (error) {
    if (error instanceof Error) {
      // Handle authentication errors
      if (error.message.includes('Invalid username or password')) {
        res.status(401).json({
          error: 'Unauthorized',
          message: error.message,
          statusCode: 401,
        });
        return;
      }
    }

    // Handle unexpected errors
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred during login',
      statusCode: 500,
    });
  }
});

export default router;
