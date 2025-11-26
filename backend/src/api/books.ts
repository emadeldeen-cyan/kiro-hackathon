import { Router, Response } from 'express';
import { IBookService } from '../services';
import { authenticate, AuthRequest } from './middleware';

const router = Router();

// Initialize with book service (will be injected)
let bookService: IBookService;

export function initBookRoutes(service: IBookService): Router {
  bookService = service;
  return router;
}

/**
 * GET /api/books/search/openlibrary?q={query}
 * Search for books using OpenLibrary API
 */
router.get('/search/openlibrary', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const query = req.query.q as string;

    // Validate query parameter
    if (!query) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'Search query parameter "q" is required',
        statusCode: 400,
      });
      return;
    }

    // Search OpenLibrary
    const results = await bookService.searchOpenLibrary(query);

    res.status(200).json({
      results,
      count: results.length,
    });
  } catch (error) {
    // Handle OpenLibrary API errors
    console.error('OpenLibrary search error:', error);
    res.status(503).json({
      error: 'Service Unavailable',
      message: 'OpenLibrary API is temporarily unavailable',
      statusCode: 503,
    });
  }
});

/**
 * POST /api/books/from-openlibrary
 * Add a book from OpenLibrary to the local database
 */
router.post('/from-openlibrary', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { openLibraryKey } = req.body;

    // Validate required fields
    if (!openLibraryKey) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'OpenLibrary key is required',
        statusCode: 400,
      });
      return;
    }

    // Add book from OpenLibrary
    const book = await bookService.addBookFromOpenLibrary(openLibraryKey);

    res.status(201).json({
      message: 'Book added successfully',
      book,
    });
  } catch (error) {
    if (error instanceof Error) {
      // Handle OpenLibrary API errors
      if (error.message.includes('OpenLibrary') || error.message.includes('API')) {
        res.status(503).json({
          error: 'Service Unavailable',
          message: 'OpenLibrary API is temporarily unavailable',
          statusCode: 503,
        });
        return;
      }
    }

    // Handle unexpected errors
    console.error('Book creation error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred while adding book',
      statusCode: 500,
    });
  }
});

/**
 * GET /api/books/:bookId
 * Get book details by ID
 */
router.get('/:bookId', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { bookId } = req.params;

    // Get book
    const book = await bookService.getBook(bookId);

    res.status(200).json({
      book,
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
    }

    // Handle unexpected errors
    console.error('Book retrieval error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred while retrieving book',
      statusCode: 500,
    });
  }
});

/**
 * GET /api/books/search?q={query}
 * Search for books in the local database
 */
router.get('/search', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const query = (req.query.q as string) || '';

    // Search local books
    const results = await bookService.searchLocalBooks(query);

    res.status(200).json({
      results,
      count: results.length,
    });
  } catch (error) {
    // Handle unexpected errors
    console.error('Local book search error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred while searching books',
      statusCode: 500,
    });
  }
});

export default router;
