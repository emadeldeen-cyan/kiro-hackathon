# Design Document

## Overview

The Book Management System is a full-stack application that enables users to register accounts, manage profiles, catalog books, and write reviews. The system integrates with the OpenLibrary API to provide comprehensive book search and metadata retrieval. Users search for books via OpenLibrary, and selected books are automatically added to the local database for review and discussion. The system follows a clean architecture pattern with clear separation between data models, business logic, external API integration, and API layers. The design prioritizes data integrity, security, and testability.

## Architecture

The system uses a layered architecture:

- **Data Layer**: Models and schemas defining the core entities (User, Profile, Book, Review)
- **Repository Layer**: Data access abstractions for CRUD operations
- **Service Layer**: Business logic and validation
- **External API Layer**: Integration with OpenLibrary API for book search and metadata
- **API Layer**: RESTful endpoints for client interaction
- **Authentication Layer**: User authentication and authorization

The architecture supports both relational (PostgreSQL) and document-based (MongoDB) database implementations through the repository pattern. The OpenLibrary integration is abstracted through a client interface to enable testing and potential future integration with other book APIs.

## Components and Interfaces

### User Management Component

**Responsibilities:**
- User registration with validation
- Password hashing and verification
- User authentication

**Interfaces:**
```typescript
interface IUserRepository {
  create(userData: CreateUserDTO): Promise<User>
  findByUsername(username: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findById(id: string): Promise<User | null>
}

interface IUserService {
  registerUser(username: string, email: string, password: string): Promise<User>
  authenticateUser(username: string, password: string): Promise<AuthToken>
  validatePassword(password: string): boolean
}
```

### Profile Management Component

**Responsibilities:**
- Profile creation and updates
- Profile retrieval
- Profile validation

**Interfaces:**
```typescript
interface IProfileRepository {
  create(userId: string, profileData: CreateProfileDTO): Promise<Profile>
  update(userId: string, profileData: UpdateProfileDTO): Promise<Profile>
  findByUserId(userId: string): Promise<Profile | null>
}

interface IProfileService {
  createProfile(userId: string, displayName: string, bio?: string, avatarUrl?: string): Promise<Profile>
  updateProfile(userId: string, updates: Partial<ProfileData>): Promise<Profile>
  getProfile(userId: string): Promise<Profile>
}
```

### Book Management Component

**Responsibilities:**
- Book cataloging from OpenLibrary data
- Local book search and retrieval
- OpenLibrary Key uniqueness validation
- Integration with OpenLibrary API

**Interfaces:**
```typescript
interface IBookRepository {
  create(bookData: CreateBookDTO): Promise<Book>
  findByOpenLibraryKey(openLibraryKey: string): Promise<Book | null>
  findById(id: string): Promise<Book | null>
  search(query: string): Promise<Book[]>
  findAll(): Promise<Book[]>
}

interface IOpenLibraryClient {
  searchBooks(query: string): Promise<OpenLibrarySearchResult[]>
  getBookDetails(openLibraryKey: string): Promise<OpenLibraryBook>
}

interface IBookService {
  searchOpenLibrary(query: string): Promise<OpenLibrarySearchResult[]>
  addBookFromOpenLibrary(openLibraryKey: string): Promise<Book>
  getBook(bookId: string): Promise<Book>
  searchLocalBooks(query: string): Promise<BookSearchResult[]>
}
```

### Review Management Component

**Responsibilities:**
- Review creation, updates, and deletion
- Review retrieval by book or user
- Rating validation
- Duplicate review prevention

**Interfaces:**
```typescript
interface IReviewRepository {
  create(reviewData: CreateReviewDTO): Promise<Review>
  update(reviewId: string, reviewData: UpdateReviewDTO): Promise<Review>
  delete(reviewId: string): Promise<void>
  findById(reviewId: string): Promise<Review | null>
  findByBookId(bookId: string): Promise<Review[]>
  findByUserId(userId: string): Promise<Review[]>
  findByUserAndBook(userId: string, bookId: string): Promise<Review | null>
}

interface IReviewService {
  createReview(userId: string, bookId: string, rating: number, text: string): Promise<Review>
  updateReview(reviewId: string, userId: string, rating?: number, text?: string): Promise<Review>
  deleteReview(reviewId: string, userId: string): Promise<void>
  getReviewsByBook(bookId: string): Promise<Review[]>
  getReviewsByUser(userId: string): Promise<ReviewWithBook[]>
}
```

## Data Models

### User
```typescript
interface User {
  id: string
  username: string
  email: string
  passwordHash: string
  createdAt: Date
  updatedAt: Date
}
```

### Profile
```typescript
interface Profile {
  id: string
  userId: string
  displayName: string
  bio: string | null
  avatarUrl: string | null
  createdAt: Date
  updatedAt: Date
}
```

### Book
```typescript
interface Book {
  id: string
  openLibraryKey: string
  title: string
  author: string
  isbn: string | null
  description: string | null
  coverImageUrl: string | null
  createdAt: Date
  updatedAt: Date
}
```

### OpenLibrary Data Types
```typescript
interface OpenLibrarySearchResult {
  key: string // e.g., "/works/OL45804W"
  title: string
  author_name?: string[]
  first_publish_year?: number
  isbn?: string[]
  cover_i?: number // cover image ID
}

interface OpenLibraryBook {
  key: string
  title: string
  description?: string | { value: string }
  authors?: Array<{ author: { key: string } }>
  covers?: number[]
}
```

### Review
```typescript
interface Review {
  id: string
  userId: string
  bookId: string
  rating: number
  text: string
  createdAt: Date
  updatedAt: Date
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### User Registration Properties

**Property 1: Username uniqueness enforcement**
*For any* existing user with username U, attempting to register a new user with the same username U should be rejected by the system.
**Validates: Requirements 1.2**

**Property 2: Email uniqueness enforcement**
*For any* existing user with email E, attempting to register a new user with the same email E should be rejected by the system.
**Validates: Requirements 1.3**

**Property 3: Password length validation**
*For any* password string with length less than 8 characters, user registration should be rejected by the system.
**Validates: Requirements 1.4**

**Property 4: Password hashing**
*For any* successfully created user account, the stored password hash should not equal the original plaintext password.
**Validates: Requirements 1.5**

### Profile Management Properties

**Property 5: Profile data persistence**
*For any* profile created with display name D, bio B, and avatar URL A, retrieving that profile should return the same values for D, B, and A.
**Validates: Requirements 2.1, 2.3**

**Property 6: Profile update persistence**
*For any* existing profile, updating it with new values and then retrieving it should return the updated values.
**Validates: Requirements 2.2**

**Property 7: Display name length validation**
*For any* display name string with length exceeding 100 characters, profile creation or update should be rejected by the system.
**Validates: Requirements 2.4**

### Book Management Properties

**Property 8: OpenLibrary Key uniqueness enforcement**
*For any* existing book with OpenLibrary Key K, attempting to add a book with the same OpenLibrary Key K should return the existing book rather than creating a duplicate.
**Validates: Requirements 3.2, 3.4**

**Property 9: Book creation from OpenLibrary data**
*For any* OpenLibrary Key K that does not exist in the local database, adding the book should create a new book entry with metadata retrieved from OpenLibrary.
**Validates: Requirements 3.3**

**Property 10: OpenLibrary data persistence**
*For any* book created from OpenLibrary, the stored book should contain the OpenLibrary Key, title, author, ISBN, description, and cover image URL from the OpenLibrary response.
**Validates: Requirements 3.5**

**Property 11: OpenLibrary search integration**
*For any* search query Q, the system should return results from the OpenLibrary API containing books that match the query.
**Validates: Requirements 3.1**

### Review Management Properties

**Property 12: Rating range validation**
*For any* rating value outside the range [1, 5], review creation should be rejected by the system.
**Validates: Requirements 4.2**

**Property 13: Review associations**
*For any* review created by user U for book B, the review's userId should equal U and bookId should equal B.
**Validates: Requirements 4.3**

**Property 14: One review per user per book**
*For any* user U and book B, if a review already exists for that user-book pair, attempting to create another review for the same pair should be rejected by the system.
**Validates: Requirements 4.5**

**Property 15: Review update persistence and timestamp**
*For any* existing review, updating its rating or text should persist the changes and result in an updatedAt timestamp that is greater than the original timestamp.
**Validates: Requirements 5.1**

**Property 16: Review deletion**
*For any* review R, after deleting R, attempting to retrieve R should return null or not found.
**Validates: Requirements 5.2**

**Property 17: Review authorization**
*For any* review created by user U1, attempting to update or delete that review as a different user U2 should be rejected by the system.
**Validates: Requirements 5.3, 5.4**

**Property 18: User review filtering**
*For any* user U, retrieving reviews by user U should return only reviews where userId equals U.
**Validates: Requirements 6.1**

**Property 19: Review history includes book data**
*For any* user's review history, each review should include the associated book's title, author, and ISBN.
**Validates: Requirements 6.2**

### Local Search Properties

**Property 20: Local search query matching**
*For any* search query Q against the local database, every book in the result set should have Q as a substring of either its title or author (case-insensitive).
**Validates: Requirements 7.1**

**Property 21: Empty query returns all local books**
*For any* local book collection, searching with an empty string should return all books in the local database.
**Validates: Requirements 7.3**

**Property 22: Local search results completeness**
*For any* local search result, the returned data should include title, author, cover image, and average rating for each book.
**Validates: Requirements 7.4**

## OpenLibrary API Integration

### API Endpoints Used

**Search API:**
- Endpoint: `https://openlibrary.org/search.json?q={query}`
- Returns: List of books matching the search query
- Rate Limit: No official limit, but implement respectful delays

**Works API:**
- Endpoint: `https://openlibrary.org/works/{key}.json`
- Returns: Detailed information about a specific work
- Used to fetch complete metadata when adding a book

**Cover Images:**
- Endpoint: `https://covers.openlibrary.org/b/id/{cover_id}-{size}.jpg`
- Sizes: S (small), M (medium), L (large)
- Returns: Cover image for display

### Data Mapping

OpenLibrary data is mapped to the local Book model:
- `key` → `openLibraryKey`
- `title` → `title`
- `author_name[0]` → `author` (first author)
- `isbn[0]` → `isbn` (first ISBN if available)
- `description.value` or `description` → `description`
- `cover_i` → `coverImageUrl` (constructed URL)

### Caching Strategy

- Cache OpenLibrary search results for 1 hour to reduce API calls
- Cache book details for 24 hours
- Invalidate cache on manual refresh requests

### Error Handling for External API

- Network timeouts: 10 second timeout for API requests
- API unavailable: Return user-friendly error message
- Invalid responses: Log error and return empty results
- Rate limiting: Implement exponential backoff if rate limited

## Error Handling

The system implements comprehensive error handling across all layers:

### Validation Errors
- Input validation failures return 400 Bad Request with descriptive error messages
- Examples: password too short, invalid rating, field length exceeded

### Uniqueness Constraint Violations
- Duplicate username or email return 409 Conflict with specific error details
- Duplicate review attempts return 409 Conflict
- Duplicate OpenLibrary Key returns existing book (not an error)

### Authorization Errors
- Unauthorized modification attempts return 403 Forbidden
- Missing or invalid authentication returns 401 Unauthorized

### Not Found Errors
- Requests for non-existent resources return 404 Not Found
- Examples: user not found, book not found, review not found

### Server Errors
- Database connection failures return 500 Internal Server Error
- Unexpected exceptions are logged and return 500 with generic message

### External API Errors
- OpenLibrary API unavailable returns 503 Service Unavailable
- OpenLibrary API timeout returns 504 Gateway Timeout
- Invalid OpenLibrary responses are logged and return 502 Bad Gateway

All errors follow a consistent format:
```typescript
interface ErrorResponse {
  error: string
  message: string
  statusCode: number
  details?: any
}
```

## Testing Strategy

The system employs a dual testing approach combining unit tests and property-based tests to ensure comprehensive coverage.

### Unit Testing

Unit tests verify specific examples, edge cases, and integration points:

- **User registration**: Test successful registration with valid data, specific error cases
- **Profile management**: Test profile CRUD operations with specific data
- **Book operations**: Test book creation from OpenLibrary data, retrieval, and local search with known data
- **OpenLibrary integration**: Test API client with mocked responses for search and book details
- **Review operations**: Test review lifecycle with specific user-book combinations
- **Authorization**: Test that users can only modify their own reviews
- **Edge cases**: Empty search results, users with no reviews, empty query strings

Unit tests use a testing framework appropriate for the implementation language (Jest for TypeScript/JavaScript, pytest for Python, etc.).

### Property-Based Testing

Property-based tests verify universal properties across randomly generated inputs using **fast-check** (for TypeScript/JavaScript) or **Hypothesis** (for Python).

**Configuration:**
- Each property test runs a minimum of 100 iterations
- Tests use smart generators that constrain inputs to valid domains
- Each test is tagged with a comment referencing the design document property

**Property Test Requirements:**
- Each correctness property listed above must be implemented as a single property-based test
- Tests must be tagged with: `**Feature: book-management, Property {number}: {property_text}**`
- Tests should avoid mocking where possible to validate real functionality

**Example Property Test Structure:**
```typescript
// **Feature: book-management, Property 1: Username uniqueness enforcement**
test('username uniqueness is enforced', () => {
  fc.assert(
    fc.asyncProperty(
      fc.string(), // username
      fc.emailAddress(), // email
      fc.string({ minLength: 8 }), // password
      async (username, email, password) => {
        // Create first user
        await userService.registerUser(username, email, password)
        
        // Attempt to create second user with same username
        await expect(
          userService.registerUser(username, 'different@email.com', password)
        ).rejects.toThrow()
      }
    ),
    { numRuns: 100 }
  )
})
```

### Integration Testing

Integration tests verify that components work together correctly:
- API endpoints with database operations
- Service layer interactions with repositories
- Authentication flow from login to protected operations

### Test Data Management

- Use in-memory databases or test containers for isolated test execution
- Clean up test data between test runs
- Use factories or builders for generating test data consistently

## Security Considerations

### Password Security
- Passwords are hashed using bcrypt with appropriate salt rounds (minimum 10)
- Plain text passwords are never logged or stored
- Password validation enforces minimum length of 8 characters

### Authentication
- JWT tokens or session-based authentication for API access
- Tokens expire after a reasonable period (e.g., 24 hours)
- Refresh token mechanism for extended sessions

### Authorization
- Users can only modify their own profiles and reviews
- Book contributor information is read-only after creation
- Admin roles can be added for moderation if needed

### Input Validation
- All user inputs are validated before processing
- SQL injection prevention through parameterized queries or ORM
- XSS prevention through output encoding

### Rate Limiting
- API endpoints implement rate limiting to prevent abuse
- Registration endpoints have stricter limits

## Performance Considerations

### Database Indexing
- Index on User.username and User.email for fast lookups
- Index on Book.openLibraryKey for uniqueness checks and fast lookups
- Index on Book.title and Book.author for search queries
- Index on Review.userId and Review.bookId for efficient queries
- Composite index on (Review.userId, Review.bookId) for duplicate prevention

### Caching Strategy
- Cache frequently accessed books and profiles
- Cache OpenLibrary search results (1 hour TTL)
- Cache OpenLibrary book details (24 hour TTL)
- Invalidate cache on updates
- Use Redis or similar for distributed caching

### Query Optimization
- Use pagination for list endpoints (reviews, search results)
- Limit search result size to prevent performance issues
- Use database query optimization for complex joins

## Deployment Considerations

### Environment Configuration
- Separate configurations for development, staging, and production
- Environment variables for sensitive data (database credentials, JWT secrets)
- Configuration validation on startup

### Database Migrations
- Version-controlled migration scripts
- Automated migration execution in CI/CD pipeline
- Rollback capability for failed migrations

### Monitoring and Logging
- Application logs for debugging and audit trails
- Performance monitoring for slow queries
- Error tracking for production issues
- Health check endpoints for load balancers
