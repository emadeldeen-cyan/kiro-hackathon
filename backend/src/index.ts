import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection, initializeDatabase } from './utils/database';
import { initApiRoutes } from './api';
import { UserService, ProfileService, BookService, ReviewService } from './services';
import { 
  InMemoryUserRepository, 
  InMemoryProfileRepository, 
  InMemoryBookRepository, 
  InMemoryReviewRepository 
} from './repositories';
import { OpenLibraryClient } from './clients/openlibrary';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Initialize repositories
const userRepository = new InMemoryUserRepository();
const profileRepository = new InMemoryProfileRepository();
const bookRepository = new InMemoryBookRepository();
const reviewRepository = new InMemoryReviewRepository();

// Initialize OpenLibrary client
const openLibraryClient = new OpenLibraryClient();

// Initialize services
const userService = new UserService(userRepository);
const profileService = new ProfileService(profileRepository);
const bookService = new BookService(bookRepository, openLibraryClient, reviewRepository);
const reviewService = new ReviewService(reviewRepository, bookRepository);

// Initialize and mount API routes
const apiRouter = initApiRoutes({
  userService,
  profileService,
  bookService,
  reviewService,
});

app.use('/api', apiRouter);

// Root API endpoint
app.get('/api', (_req, res) => {
  res.json({ message: 'Book Management API' });
});

// Start server
async function startServer() {
  try {
    // Test database connection
    const connected = await testConnection();
    if (!connected) {
      console.error('Failed to connect to database. Please check your configuration.');
      process.exit(1);
    }

    // Initialize database tables
    await initializeDatabase();

    // Start listening
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
