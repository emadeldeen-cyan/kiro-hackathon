import { Router, Response } from 'express';
import { IProfileService } from '../services';
import { authenticate, AuthRequest } from './middleware';

const router = Router();

// Initialize with profile service (will be injected)
let profileService: IProfileService;

export function initProfileRoutes(service: IProfileService): Router {
  profileService = service;
  return router;
}

/**
 * POST /api/profiles
 * Create a new profile for the authenticated user
 */
router.post('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { displayName, bio, avatarUrl } = req.body;
    const userId = req.user!.userId;

    // Validate required fields
    if (!displayName) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'Display name is required',
        statusCode: 400,
      });
      return;
    }

    // Create profile
    const profile = await profileService.createProfile(userId, displayName, bio, avatarUrl);

    res.status(201).json(profile);
  } catch (error) {
    if (error instanceof Error) {
      // Handle validation errors
      if (error.message.includes('must not exceed') || error.message.includes('already exists')) {
        res.status(409).json({
          error: 'Conflict',
          message: error.message,
          statusCode: 409,
        });
        return;
      }
    }

    // Handle unexpected errors
    console.error('Profile creation error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred while creating profile',
      statusCode: 500,
    });
  }
});

/**
 * PUT /api/profiles/:userId
 * Update a user's profile
 */
router.put('/:userId', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { displayName, bio, avatarUrl } = req.body;
    const authenticatedUserId = req.user!.userId;

    // Check authorization - users can only update their own profile
    if (userId !== authenticatedUserId) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'You can only update your own profile',
        statusCode: 403,
      });
      return;
    }

    // Update profile
    const profile = await profileService.updateProfile(userId, {
      displayName,
      bio,
      avatarUrl,
    });

    res.status(200).json(profile);
  } catch (error) {
    if (error instanceof Error) {
      // Handle not found errors
      if (error.message.includes('not found')) {
        res.status(404).json({
          error: 'Not Found',
          message: error.message,
          statusCode: 404,
        });
        return;
      }

      // Handle validation errors
      if (error.message.includes('must not exceed')) {
        res.status(400).json({
          error: 'Validation Error',
          message: error.message,
          statusCode: 400,
        });
        return;
      }
    }

    // Handle unexpected errors
    console.error('Profile update error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred while updating profile',
      statusCode: 500,
    });
  }
});

/**
 * GET /api/profiles/:userId
 * Get a user's profile
 */
router.get('/:userId', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    // Get profile
    const profile = await profileService.getProfile(userId);

    res.status(200).json(profile);
  } catch (error) {
    if (error instanceof Error) {
      // Handle not found errors
      if (error.message.includes('not found')) {
        res.status(404).json({
          error: 'Not Found',
          message: error.message,
          statusCode: 404,
        });
        return;
      }
    }

    // Handle unexpected errors
    console.error('Profile retrieval error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred while retrieving profile',
      statusCode: 500,
    });
  }
});

export default router;
