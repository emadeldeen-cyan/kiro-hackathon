import request from 'supertest';
import express, { Application } from 'express';
import { initApiRoutes } from './index';
import { UserService, ProfileService, BookService, ReviewService } from '../services';
import {
  InMemoryUserRepository,
  InMemoryProfileRepository,
  InMemoryBookRepository,
  InMemoryReviewRepository,
} from '../repositories';
import { OpenLibraryClient } from '../clients/openlibrary';

describe('API Integration Tests', () => {
  let app: Application;
  let authToken: string;
  let userId: string;

  beforeAll(() => {
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

    // Create Express app
    app = express();
    app.use(express.json());

    // Initialize and mount API routes
    const apiRouter = initApiRoutes({
      userService,
      profileService,
      bookService,
      reviewService,
    });

    app.use('/api', apiRouter);
  });

  describe('Authentication Endpoints', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('username', 'testuser');
      expect(response.body.user).toHaveProperty('email', 'test@example.com');

      // Save token and userId for subsequent tests
      authToken = response.body.token;
      userId = response.body.user.id;
    });

    it('should reject registration with duplicate username', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'different@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(409);
      expect(response.body.message).toContain('already exists');
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('username', 'testuser');
    });

    it('should reject login with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
    });
  });

  describe('Profile Endpoints', () => {
    it('should create a profile', async () => {
      const response = await request(app)
        .post('/api/profiles')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          displayName: 'Test User',
          bio: 'This is a test bio',
          avatarUrl: 'https://example.com/avatar.jpg',
        });

      expect(response.status).toBe(201);
      expect(response.body.profile).toHaveProperty('displayName', 'Test User');
      expect(response.body.profile).toHaveProperty('bio', 'This is a test bio');
    });

    it('should get a profile', async () => {
      const response = await request(app)
        .get(`/api/profiles/${userId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.profile).toHaveProperty('displayName', 'Test User');
    });

    it('should update a profile', async () => {
      const response = await request(app)
        .put(`/api/profiles/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          displayName: 'Updated Name',
          bio: 'Updated bio',
        });

      expect(response.status).toBe(200);
      expect(response.body.profile).toHaveProperty('displayName', 'Updated Name');
    });

    it('should reject profile access without authentication', async () => {
      const response = await request(app).get(`/api/profiles/${userId}`);

      expect(response.status).toBe(401);
    });
  });
});
