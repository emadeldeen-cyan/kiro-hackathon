import { Router } from 'express';
import { initAuthRoutes } from './auth';
import { initProfileRoutes } from './profiles';
import { initBookRoutes } from './books';
import { initReviewRoutes } from './reviews';
import { IUserService, IProfileService, IBookService, IReviewService } from '../services';

export interface ApiServices {
  userService: IUserService;
  profileService: IProfileService;
  bookService: IBookService;
  reviewService: IReviewService;
}

/**
 * Initialize all API routes with their respective services
 */
export function initApiRoutes(services: ApiServices): Router {
  const router = Router();

  // Mount route handlers
  router.use('/auth', initAuthRoutes(services.userService));
  router.use('/profiles', initProfileRoutes(services.profileService));
  router.use('/books', initBookRoutes(services.bookService));
  router.use('/reviews', initReviewRoutes(services.reviewService));

  return router;
}

export * from './middleware';
