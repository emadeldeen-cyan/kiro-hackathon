# Implementation Plan

## Backend Tasks

- [x] 1. Set up backend project structure and dependencies
  - Create backend directory structure (models, repositories, services, api, utils)
  - Initialize package.json with required dependencies (express, bcrypt, jsonwebtoken, axios, etc.)
  - Set up TypeScript configuration
  - Configure testing framework (Jest) and property-based testing library (fast-check)
  - Set up database connection (PostgreSQL or MongoDB)
  - _Requirements: All_

- [x] 2. Implement User model and authentication
- [x] 2.1 Create User data model and repository interface
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

- [x] 2.5 Implement password hashing with bcrypt
  - Add bcrypt password hashing to user creation
  - Implement password verification function
  - _Requirements: 1.5_

- [ ]* 2.6 Write property test for password hashing
  - **Property 4: Password hashing**
  - **Validates: Requirements 1.5**

- [x] 2.7 Implement UserService with registration logic
  - Create UserService class implementing IUserService
  - Implement registerUser method with all validations
  - Implement authenticateUser method
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ]* 2.8 Write unit tests for user registration edge cases
  - Test successful registration
  - Test various validation failures
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [-] 3. Implement Profile model and management
- [x] 3.1 Create Profile data model and repository
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

- [x] 3.5 Implement ProfileService
  - Create ProfileService class implementing IProfileService
  - Implement createProfile, updateProfile, and getProfile methods
  - Add display name length validation
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 4. Implement OpenLibrary API client
- [x] 4.1 Create OpenLibrary client interface and implementation
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

- [-] 5. Implement Book model and management
- [x] 5.1 Create Book data model and repository
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

- [x] 5.5 Implement BookService
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

- [x] 6. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Implement Review model and management
- [x] 7.1 Create Review data model and repository
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

- [x] 7.5 Implement ReviewService
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

- [x] 8. Implement local book search
- [x] 8.1 Add search functionality to book repository
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

- [x] 9. Implement REST API endpoints
- [x] 9.1 Create authentication endpoints
  - POST /api/auth/register - User registration
  - POST /api/auth/login - User login
  - Add JWT token generation
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 9.2 Create profile endpoints
  - POST /api/profiles - Create profile
  - PUT /api/profiles/:userId - Update profile
  - GET /api/profiles/:userId - Get profile
  - Add authentication middleware
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 9.3 Create book endpoints
  - GET /api/books/search/openlibrary?q={query} - Search OpenLibrary
  - POST /api/books/from-openlibrary - Add book from OpenLibrary
  - GET /api/books/:bookId - Get book details
  - GET /api/books/search?q={query} - Search local books
  - Add authentication middleware
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 7.1, 7.2, 7.3, 7.4_

- [x] 9.4 Create review endpoints
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

- [x] 10. Add CORS and prepare backend for frontend integration
  - Configure CORS middleware to allow frontend requests
  - Add environment variables for frontend URL
  - Document API endpoints and request/response formats
  - _Requirements: All_

- [x] 11. Final Backend Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Frontend Tasks

- [x] 12. Set up Angular project structure
  - Initialize Angular project in frontend directory with TypeScript
  - Configure Angular routing
  - Install required dependencies (HttpClient, Angular Material or Bootstrap, etc.)
  - Set up HttpClient service for backend API communication
  - Configure environment files for backend API URL
  - Set up proxy configuration for development
  - _Requirements: All_

- [x] 13. Implement authentication services and guards
- [x] 13.1 Create authentication service
  - Create AuthService with login, register, and logout methods
  - Implement JWT token storage in localStorage
  - Add methods to check authentication status
  - Create HTTP interceptor to attach JWT token to requests
  - _Requirements: 1.1_

- [x] 13.2 Create authentication guard
  - Implement AuthGuard to protect routes
  - Redirect unauthenticated users to login page
  - _Requirements: 1.1_

- [x] 13.3 Create registration component
  - Generate registration component with Angular CLI
  - Build reactive form with username, email, and password fields
  - Add form validators for password length (min 8 characters)
  - Implement registration API call using AuthService
  - Handle and display error messages
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 13.4 Create login component
  - Generate login component with Angular CLI
  - Build reactive form with username/email and password fields
  - Implement login API call using AuthService
  - Redirect to home page on successful login
  - Handle and display error messages
  - _Requirements: 1.1_

- [x] 14. Implement profile management
- [x] 14.1 Create profile service
  - Create ProfileService with methods for create, update, and get profile
  - Implement API calls using HttpClient
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 14.2 Create profile form component
  - Generate profile-form component with Angular CLI
  - Build reactive form with display name, bio, and avatar URL fields
  - Add form validators for display name length (max 100 characters)
  - Implement create/update profile using ProfileService
  - Handle and display error messages
  - _Requirements: 2.1, 2.2, 2.4_

- [x] 14.3 Create profile view component
  - Generate profile component with Angular CLI
  - Display user profile information
  - Show user's reviews on profile page using ReviewService
  - Add edit profile button for profile owner
  - Implement route parameter to view any user's profile
  - _Requirements: 2.3, 6.1, 6.2_

- [x] 15. Implement book search and management
- [x] 15.1 Create book service
  - Create BookService with methods for OpenLibrary search, add book, get book, and local search
  - Implement API calls using HttpClient
  - _Requirements: 3.1, 3.2, 3.3, 7.1_

- [x] 15.2 Create OpenLibrary search component
  - Generate book-search component with Angular CLI
  - Build search form with input field
  - Implement search on submit or with debounce for real-time search
  - Display OpenLibrary search results with book covers
  - Show book title, author, and publication year
  - Add "Add to Library" button for each result
  - _Requirements: 3.1_

- [x] 15.3 Implement add book functionality
  - Handle "Add to Library" button click in search component
  - Call BookService to add book from OpenLibrary
  - Show success toast or existing book notification
  - Navigate to book detail page after adding
  - _Requirements: 3.2, 3.3, 3.4, 3.5_

- [x] 15.4 Create local book search component
  - Generate local-books component with Angular CLI
  - Build search form for local database
  - Display local search results with covers and average ratings
  - Handle empty query to show all books
  - Add router links to book detail pages
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 15.5 Create book detail component
  - Generate book-detail component with Angular CLI
  - Get book ID from route parameters
  - Display complete book information (title, author, ISBN, description, cover)
  - Show all reviews for the book using ReviewService
  - Add "Write Review" button if user hasn't reviewed yet
  - Display average rating and review count
  - _Requirements: 3.5, 4.4_

- [x] 16. Implement review management
- [x] 16.1 Create review service
  - Create ReviewService with methods for create, update, delete, get by book, and get by user
  - Implement API calls using HttpClient
  - _Requirements: 4.1, 5.1, 5.2, 6.1_

- [x] 16.2 Create review form component
  - Generate review-form component with Angular CLI
  - Build reactive form with rating selector (1-5 stars) and text area
  - Add form validators for rating range (1-5)
  - Support both create and edit modes via Input properties
  - Emit events on successful create/update
  - Handle and display error messages
  - _Requirements: 4.1, 4.2, 5.1_

- [x] 16.3 Create review card component
  - Generate review-card component with Angular CLI
  - Display review rating as stars
  - Show review text and timestamp (use date pipe)
  - Display reviewer name with router link to profile
  - Add edit/delete buttons for review owner (check current user)
  - Emit events for edit and delete actions
  - _Requirements: 4.4_

- [x] 16.4 Implement review edit and delete functionality
  - Create edit review dialog/modal using Angular Material Dialog or Bootstrap Modal
  - Implement delete confirmation dialog
  - Call ReviewService update/delete methods
  - Handle authorization errors with appropriate messages
  - Update UI after successful operations (refresh review list)
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 16.5 Create user reviews component
  - Generate my-reviews component with Angular CLI
  - Display all reviews by the current user using ReviewService
  - Show associated book information for each review
  - Add router links to book detail pages
  - Handle empty state when user has no reviews
  - _Requirements: 6.1, 6.2, 6.3_

- [x] 17. Implement navigation and layout
- [x] 17.1 Create navigation component
  - Generate navbar component with Angular CLI
  - Add navigation links using routerLink (Home, Search Books, My Library, My Reviews, Profile)
  - Show login/register links for unauthenticated users (check AuthService)
  - Show user menu with logout for authenticated users
  - Implement logout functionality calling AuthService
  - Make navigation responsive for mobile using Angular Material or Bootstrap
  - _Requirements: All_

- [x] 17.2 Create main layout component
  - Generate app-layout component with Angular CLI
  - Include navbar component in header
  - Add router-outlet for content area
  - Add footer with app information
  - Implement responsive design
  - _Requirements: All_

- [x] 17.3 Configure routing module
  - Set up all application routes in app-routing.module.ts
  - Apply AuthGuard to protected routes
  - Configure lazy loading for feature modules if needed
  - Set up route redirects (default route, after login, etc.)
  - _Requirements: All_

- [x] 18. Add error handling and loading states
- [x] 18.1 Create HTTP error interceptor
  - Implement HttpInterceptor to catch HTTP errors globally
  - Handle 401 errors by redirecting to login
  - Handle 403, 404, 500 errors with appropriate messages
  - Log errors for debugging
  - _Requirements: All_

- [x] 18.2 Create loading interceptor and spinner
  - Generate loading-spinner component with Angular CLI
  - Implement HttpInterceptor to track pending requests
  - Create LoadingService to manage loading state
  - Display spinner overlay when requests are pending
  - _Requirements: All_

- [x] 18.3 Implement toast notification service
  - Install Angular toast library (ngx-toastr or Angular Material Snackbar)
  - Create NotificationService wrapper
  - Show success messages for operations (review created, profile updated, etc.)
  - Display error messages from API responses
  - Use in all components for user feedback
  - _Requirements: All_

- [x] 19. Polish UI and add styling
- [x] 19.1 Apply consistent styling
  - Choose and implement Angular Material or Bootstrap for Angular
  - Configure theme with consistent color scheme and typography
  - Style all components with responsive design
  - Add hover states and transitions using Angular animations
  - Create reusable SCSS mixins and variables
  - _Requirements: All_

- [x] 19.2 Improve accessibility
  - Add proper ARIA labels to all interactive elements
  - Ensure keyboard navigation works (tab order, enter/space for actions)
  - Test with screen readers
  - Add focus indicators and focus management
  - Ensure proper heading hierarchy
  - _Requirements: All_

- [ ] 20. Final Frontend Checkpoint - Test end-to-end flows
  - Test complete user registration and login flow
  - Test searching OpenLibrary and adding books
  - Test creating, editing, and deleting reviews
  - Test profile management
  - Test local book search
  - Test navigation and routing
  - Test authentication guard on protected routes
  - Ensure all error cases are handled gracefully
  - Verify responsive design on different screen sizes
  - Ask the user if questions arise.
