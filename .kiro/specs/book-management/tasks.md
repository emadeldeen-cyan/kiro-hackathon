# Implementation Plan

- [ ] 1. Set up project structure and dependencies
  - Create backend directory structure (models, repositories, services, api, utils)
  - Initialize package.json with required dependencies (express, bcrypt, jsonwebtoken, axios, etc.)
  - Set up TypeScript configuration
  - Configure testing framework (Jest) and property-based testing library (fast-check)
  - _Requirements: All_

- [ ] 2. Implement User model and authentication
- [ ] 2.1 Create User data model and repository interface
  - Define User TypeScript interface
  - Implement IUserRepository interface
  - Create in-memory or database-backed user repository
  - _Requirements: 1.1_

- [ ]* 2.2 Write property test for username uniqueness
  - **Property 1: Username uniqueness enforcement**
  - **Validates: Requirements 1.2**

- [ ]* 2.3 Write property test for email uniqueness
  - **Property 2: Email uniqueness enforcement**
  - **Validates: Requirements 1.3**

- [ ]* 2.4 Write property test for password length validation
  - **Property 3: Password length validation**
  - **Validates: Requirements 1.4**

- [ ] 2.5 Implement password hashing with bcrypt
  - Add bcrypt password hashing to user creation
  - Implement password verification function
  - _Requirements: 1.5_

- [ ]* 2.6 Write property test for password hashing
  - **Property 4: Password hashing**
  - **Validates: Requirements 1.5**

- [ ] 2.7 Implement UserService with registration logic
  - Create UserService class implementing IUserService
  - Implement registerUser method with all validations
  - Implement authenticateUser method
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ]* 2.8 Write unit tests for user registration edge cases
  - Test successful registration
  - Test various validation failures
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 3. Implement Profile model and management
- [ ] 3.1 Create Profile data model and repository
  - Define Profile TypeScript interface
  - Implement IProfileRepository interface
  - Create profile repository implementation
  - _Requirements: 2.1_

- [ ]* 3.2 Write property test for profile data persistence
  - **Property 5: Profile data persistence**
  - **Validates: Requirements 2.1, 2.3**

- [ ]* 3.3 Write property test for profile update persistence
  - **Property 6: Profile update persistence**
  - **Validates: Requirements 2.2**

- [ ]* 3.4 Write property test for display name length validation
  - **Property 7: Display name length validation**
  - **Validates: Requirements 2.4**

- [ ] 3.5 Implement ProfileService
  - Create ProfileService class implementing IProfileService
  - Implement createProfile, updateProfile, and getProfile methods
  - Add display name length validation
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 4. Implement OpenLibrary API client
- [ ] 4.1 Create OpenLibrary client interface and implementation
  - Define IOpenLibraryClient interface
  - Implement searchBooks method using OpenLibrary search API
  - Implement getBookDetails method using OpenLibrary works API
  - Add error handling for network failures and timeouts
  - _Requirements: 3.1, 3.6_

- [ ]* 4.2 Write unit tests for OpenLibrary client with mocked responses
  - Test successful search with mocked API response
  - Test successful book details retrieval
  - Test error handling for API failures
  - _Requirements: 3.1, 3.6_

- [ ]* 4.3 Write property test for OpenLibrary search integration
  - **Property 11: OpenLibrary search integration**
  - **Validates: Requirements 3.1**

- [ ] 5. Implement Book model and management
- [ ] 5.1 Create Book data model and repository
  - Define Book TypeScript interface
  - Define OpenLibrary data type interfaces
  - Implement IBookRepository interface
  - Create book repository with findByOpenLibraryKey method
  - _Requirements: 3.2, 3.3, 3.4, 3.5_

- [ ]* 5.2 Write property test for OpenLibrary Key uniqueness
  - **Property 8: OpenLibrary Key uniqueness enforcement**
  - **Validates: Requirements 3.2, 3.4**

- [ ]* 5.3 Write property test for book creation from OpenLibrary
  - **Property 9: Book creation from OpenLibrary data**
  - **Validates: Requirements 3.3**

- [ ]* 5.4 Write property test for OpenLibrary data persistence
  - **Property 10: OpenLibrary data persistence**
  - **Validates: Requirements 3.5**

- [ ] 5.5 Implement BookService
  - Create BookService class implementing IBookService
  - Implement searchOpenLibrary method
  - Implement addBookFromOpenLibrary method (check local DB first, then create if needed)
  - Implement getBook method
  - Implement searchLocalBooks method
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ]* 5.6 Write unit tests for book service operations
  - Test adding book from OpenLibrary (new book)
  - Test adding book from OpenLibrary (existing book)
  - Test local search functionality
  - _Requirements: 3.2, 3.3, 3.4_

- [ ] 6. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Implement Review model and management
- [ ] 7.1 Create Review data model and repository
  - Define Review TypeScript interface
  - Implement IReviewRepository interface
  - Create review repository with all required methods
  - _Requirements: 4.1, 4.3_

- [ ]* 7.2 Write property test for rating range validation
  - **Property 12: Rating range validation**
  - **Validates: Requirements 4.2**

- [ ]* 7.3 Write property test for review associations
  - **Property 13: Review associations**
  - **Validates: Requirements 4.3**

- [ ]* 7.4 Write property test for one review per user per book
  - **Property 14: One review per user per book**
  - **Validates: Requirements 4.5**

- [ ] 7.5 Implement ReviewService
  - Create ReviewService class implementing IReviewService
  - Implement createReview with rating validation and duplicate check
  - Implement updateReview with authorization check
  - Implement deleteReview with authorization check
  - Implement getReviewsByBook method
  - Implement getReviewsByUser method with book data
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 5.1, 5.2, 5.3, 5.4, 6.1, 6.2, 6.3_

- [ ]* 7.6 Write property test for review update persistence
  - **Property 15: Review update persistence and timestamp**
  - **Validates: Requirements 5.1**

- [ ]* 7.7 Write property test for review deletion
  - **Property 16: Review deletion**
  - **Validates: Requirements 5.2**

- [ ]* 7.8 Write property test for review authorization
  - **Property 17: Review authorization**
  - **Validates: Requirements 5.3, 5.4**

- [ ]* 7.9 Write property test for user review filtering
  - **Property 18: User review filtering**
  - **Validates: Requirements 6.1**

- [ ]* 7.10 Write property test for review history includes book data
  - **Property 19: Review history includes book data**
  - **Validates: Requirements 6.2**

- [ ]* 7.11 Write unit tests for review operations
  - Test review creation with valid data
  - Test review update by owner
  - Test review deletion by owner
  - Test authorization failures
  - Test getting reviews by book
  - Test getting reviews by user
  - _Requirements: 4.1, 4.4, 5.1, 5.2, 5.3, 5.4, 6.1, 6.2_

- [ ] 8. Implement local book search
- [ ] 8.1 Add search functionality to book repository
  - Implement case-insensitive search on title and author fields
  - Handle empty query to return all books
  - _Requirements: 7.1, 7.2, 7.3_

- [ ]* 8.2 Write property test for local search query matching
  - **Property 20: Local search query matching**
  - **Validates: Requirements 7.1**

- [ ]* 8.3 Write property test for empty query returns all books
  - **Property 21: Empty query returns all local books**
  - **Validates: Requirements 7.3**

- [ ]* 8.4 Write property test for search results completeness
  - **Property 22: Local search results completeness**
  - **Validates: Requirements 7.4**

- [ ] 9. Implement REST API endpoints
- [ ] 9.1 Create authentication endpoints
  - POST /api/auth/register - User registration
  - POST /api/auth/login - User login
  - Add JWT token generation
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ] 9.2 Create profile endpoints
  - POST /api/profiles - Create profile
  - PUT /api/profiles/:userId - Update profile
  - GET /api/profiles/:userId - Get profile
  - Add authentication middleware
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 9.3 Create book endpoints
  - GET /api/books/search/openlibrary?q={query} - Search OpenLibrary
  - POST /api/books/from-openlibrary - Add book from OpenLibrary
  - GET /api/books/:bookId - Get book details
  - GET /api/books/search?q={query} - Search local books
  - Add authentication middleware
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 7.1, 7.2, 7.3, 7.4_

- [ ] 9.4 Create review endpoints
  - POST /api/reviews - Create review
  - PUT /api/reviews/:reviewId - Update review
  - DELETE /api/reviews/:reviewId - Delete review
  - GET /api/books/:bookId/reviews - Get reviews for book
  - GET /api/users/:userId/reviews - Get reviews by user
  - Add authentication and authorization middleware
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 5.1, 5.2, 5.3, 5.4, 6.1, 6.2, 6.3_

- [ ]* 9.5 Write integration tests for API endpoints
  - Test authentication flow
  - Test profile CRUD operations via API
  - Test book operations via API
  - Test review operations via API
  - Test authorization enforcement
  - _Requirements: All_

- [ ] 10. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
