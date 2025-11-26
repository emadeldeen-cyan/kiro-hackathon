import { Router, Response } from 'express';
import { IReviewService } from '../services';
import { authenticate, AuthRequest } from './middleware';

const router = Router();

// Initialize with review service (will be injected)
let reviewService: IReviewService;

export function initReviewRoutes(service: IReviewService): Router {
  reviewService = service;
  return router;
}

/**
 * POST /api/reviews
 * Create a new review
 */
router.post('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { bookId, rating, text } = req.body;
    const userId = req.user!.userId;

    // Validate required fields
    if (!bookId || rating === undefined || !text) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'Book ID, rating, and text are required',
        statusCode: 400,
      });
      return;
    }

    // Create review
    const review = await reviewService.createReview(userId, bookId, rating, text);

    res.status(201).json(review);
  } catch (error) {
    if (error instanceof Error) {
      // Handle validation errors
      if (error.message.includes('Rating must be') || error.message.includes('already reviewed')) {
        res.status(409).json({
          error: 'Conflict',
          message: error.message,
          statusCode: 409,
        });
        return;
      }

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
    console.error('Review creation error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred while creating review',
      statusCode: 500,
    });
  }
});

/**
 * PUT /api/reviews/:reviewId
 * Update an existing review
 */
router.put('/:reviewId', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { reviewId } = req.params;
    const { rating, text } = req.body;
    const userId = req.user!.userId;

    // Update review (authorization check is done in service)
    const review = await reviewService.updateReview(reviewId, userId, rating, text);

    res.status(200).json(review);
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

      // Handle authorization errors
      if (error.message.includes('Unauthorized')) {
        res.status(403).json({
          error: 'Forbidden',
          message: error.message,
          statusCode: 403,
        });
        return;
      }

      // Handle validation errors
      if (error.message.includes('Rating must be')) {
        res.status(400).json({
          error: 'Validation Error',
          message: error.message,
          statusCode: 400,
        });
        return;
      }
    }

    // Handle unexpected errors
    console.error('Review update error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred while updating review',
      statusCode: 500,
    });
  }
});

/**
 * DELETE /api/reviews/:reviewId
 * Delete a review
 */
router.delete('/:reviewId', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { reviewId } = req.params;
    const userId = req.user!.userId;

    // Delete review (authorization check is done in service)
    await reviewService.deleteReview(reviewId, userId);

    res.status(200).json({
      message: 'Review deleted successfully',
    });
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

      // Handle authorization errors
      if (error.message.includes('Unauthorized')) {
        res.status(403).json({
          error: 'Forbidden',
          message: error.message,
          statusCode: 403,
        });
        return;
      }
    }

    // Handle unexpected errors
    console.error('Review deletion error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred while deleting review',
      statusCode: 500,
    });
  }
});

/**
 * GET /api/books/:bookId/reviews
 * Get all reviews for a specific book
 */
router.get('/books/:bookId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { bookId } = req.params;

    // Get reviews for book
    const reviews = await reviewService.getReviewsByBook(bookId);

    res.status(200).json(reviews);
  } catch (error) {
    // Handle unexpected errors
    console.error('Review retrieval error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred while retrieving reviews',
      statusCode: 500,
    });
  }
});

/**
 * GET /api/users/:userId/reviews
 * Get all reviews by a specific user
 */
router.get('/users/:userId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    // Get reviews by user
    const reviews = await reviewService.getReviewsByUser(userId);

    res.status(200).json(reviews);
  } catch (error) {
    // Handle unexpected errors
    console.error('Review retrieval error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred while retrieving reviews',
      statusCode: 500,
    });
  }
});

export default router;
