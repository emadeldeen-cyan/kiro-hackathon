import { Router, Response } from 'express';
import { IUserService } from '../services';
import { authenticate, AuthRequest } from './middleware';

/**
 * Initialize user-related routes
 */
export function initUserRoutes(userService: IUserService): Router {
  const router = Router();

  /**
   * GET /api/users/shared-books
   * Find users who have reviewed the same books as the authenticated user
   * Requires authentication
   */
  router.get('/shared-books', authenticate, async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.userId;
      
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const usersWithSharedBooks = await userService.findUsersWithSameBooks(userId);
      
      res.json(usersWithSharedBooks);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'User not found') {
          res.status(404).json({ error: error.message });
          return;
        }
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unexpected error occurred' });
      }
    }
  });

  return router;
}
