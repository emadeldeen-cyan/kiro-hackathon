# Book Management API Documentation

## Base URL
```
Development: http://localhost:3000/api
Production: Update based on your deployment
```

## Quick Start

1. **Start the server**: `npm run dev`
2. **Register a user**: `POST /api/auth/register`
3. **Login**: `POST /api/auth/login` (receive JWT token)
4. **Use token**: Include `Authorization: Bearer <token>` header in all subsequent requests

## CORS Configuration

The API supports Cross-Origin Resource Sharing (CORS) for frontend integration:

- **Allowed Origins**: Configured via `FRONTEND_URL` environment variable
- **Credentials**: Enabled (supports cookies and authorization headers)
- **Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Headers**: Content-Type, Authorization

For detailed frontend integration instructions, see [FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md).

## Authentication

All endpoints except `/auth/register` and `/auth/login` require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

**Token Expiration**: Tokens expire after 24 hours (configurable via `JWT_EXPIRES_IN` environment variable)

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string (min 8 characters)"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "createdAt": "date"
  },
  "token": "string"
}
```

**Error Responses:**
- `400` - Missing required fields
- `409` - Username or email already exists

---

### Login
**POST** `/auth/login`

Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "userId": "string",
  "username": "string",
  "token": "string"
}
```

**Error Responses:**
- `400` - Missing required fields
- `401` - Invalid credentials

---

## Profile Endpoints

### Create Profile
**POST** `/profiles`

Create a profile for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "displayName": "string (max 100 characters)",
  "bio": "string (optional)",
  "avatarUrl": "string (optional)"
}
```

**Response (201):**
```json
{
  "message": "Profile created successfully",
  "profile": {
    "id": "string",
    "userId": "string",
    "displayName": "string",
    "bio": "string | null",
    "avatarUrl": "string | null",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

**Error Responses:**
- `400` - Missing display name
- `401` - Unauthorized
- `409` - Profile already exists or validation error

---

### Update Profile
**PUT** `/profiles/:userId`

Update a user's profile. Users can only update their own profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "displayName": "string (optional)",
  "bio": "string (optional)",
  "avatarUrl": "string (optional)"
}
```

**Response (200):**
```json
{
  "message": "Profile updated successfully",
  "profile": { /* profile object */ }
}
```

**Error Responses:**
- `401` - Unauthorized
- `403` - Cannot update another user's profile
- `404` - Profile not found

---

### Get Profile
**GET** `/profiles/:userId`

Get a user's profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "profile": { /* profile object */ }
}
```

**Error Responses:**
- `401` - Unauthorized
- `404` - Profile not found

---

## Book Endpoints

### Search OpenLibrary
**GET** `/books/search/openlibrary?q={query}`

Search for books using the OpenLibrary API.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `q` (required) - Search query string

**Response (200):**
```json
{
  "results": [
    {
      "key": "string",
      "title": "string",
      "author_name": ["string"],
      "first_publish_year": "number",
      "isbn": ["string"],
      "cover_i": "number"
    }
  ],
  "count": "number"
}
```

**Error Responses:**
- `400` - Missing query parameter
- `401` - Unauthorized
- `503` - OpenLibrary API unavailable

---

### Add Book from OpenLibrary
**POST** `/books/from-openlibrary`

Add a book from OpenLibrary to the local database.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "openLibraryKey": "string"
}
```

**Response (201):**
```json
{
  "message": "Book added successfully",
  "book": {
    "id": "string",
    "openLibraryKey": "string",
    "title": "string",
    "author": "string",
    "isbn": "string | null",
    "description": "string | null",
    "coverImageUrl": "string | null",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

**Error Responses:**
- `400` - Missing OpenLibrary key
- `401` - Unauthorized
- `503` - OpenLibrary API unavailable

---

### Get Book
**GET** `/books/:bookId`

Get book details by ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "book": { /* book object */ }
}
```

**Error Responses:**
- `401` - Unauthorized
- `404` - Book not found

---

### Search Local Books
**GET** `/books/search?q={query}`

Search for books in the local database.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `q` (optional) - Search query string (empty returns all books)

**Response (200):**
```json
{
  "results": [
    {
      "id": "string",
      "openLibraryKey": "string",
      "title": "string",
      "author": "string",
      "isbn": "string | null",
      "description": "string | null",
      "coverImageUrl": "string | null",
      "averageRating": "number | null"
    }
  ],
  "count": "number"
}
```

**Error Responses:**
- `401` - Unauthorized

---

## User Endpoints

### Find Users with Shared Books
**GET** `/users/shared-books`

Find users who have reviewed the same books as the authenticated user. Results are sorted by the number of shared books (descending), then alphabetically by username.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": "string",
    "username": "string",
    "email": "string",
    "sharedBookCount": "number"
  }
]
```

**Error Responses:**
- `401` - Unauthorized
- `404` - User not found
- `500` - Internal Server Error

**Example:**
```bash
curl -X GET http://localhost:3000/api/users/shared-books \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Review Endpoints

### Create Review
**POST** `/reviews`

Create a new review for a book.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "bookId": "string",
  "rating": "number (1-5)",
  "text": "string"
}
```

**Response (201):**
```json
{
  "message": "Review created successfully",
  "review": {
    "id": "string",
    "userId": "string",
    "bookId": "string",
    "rating": "number",
    "text": "string",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

**Error Responses:**
- `400` - Missing required fields
- `401` - Unauthorized
- `404` - Book not found
- `409` - User already reviewed this book or invalid rating

---

### Update Review
**PUT** `/reviews/:reviewId`

Update an existing review. Users can only update their own reviews.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "rating": "number (optional, 1-5)",
  "text": "string (optional)"
}
```

**Response (200):**
```json
{
  "message": "Review updated successfully",
  "review": { /* review object */ }
}
```

**Error Responses:**
- `400` - Invalid rating
- `401` - Unauthorized
- `403` - Cannot update another user's review
- `404` - Review not found

---

### Delete Review
**DELETE** `/reviews/:reviewId`

Delete a review. Users can only delete their own reviews.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Review deleted successfully"
}
```

**Error Responses:**
- `401` - Unauthorized
- `403` - Cannot delete another user's review
- `404` - Review not found

---

### Get Reviews by Book
**GET** `/reviews/books/:bookId`

Get all reviews for a specific book.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "reviews": [
    { /* review object */ }
  ],
  "count": "number"
}
```

**Error Responses:**
- `401` - Unauthorized

---

### Get Reviews by User
**GET** `/reviews/users/:userId`

Get all reviews by a specific user with associated book data.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "reviews": [
    {
      "id": "string",
      "userId": "string",
      "bookId": "string",
      "rating": "number",
      "text": "string",
      "createdAt": "date",
      "updatedAt": "date",
      "book": {
        "id": "string",
        "title": "string",
        "author": "string",
        "isbn": "string | null"
      }
    }
  ],
  "count": "number"
}
```

**Error Responses:**
- `401` - Unauthorized

---

## Error Response Format

All error responses follow this format:

```json
{
  "error": "Error Type",
  "message": "Detailed error message",
  "statusCode": "number"
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource or validation error)
- `500` - Internal Server Error
- `503` - Service Unavailable (external API error)

---

## Testing the API

### Using cURL

**Health Check:**
```bash
curl http://localhost:3000/health
```

**Register User:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

**Authenticated Request (replace TOKEN with actual token):**
```bash
curl http://localhost:3000/api/profiles/USER_ID \
  -H "Authorization: Bearer TOKEN"
```

### Using Postman

1. Import the API endpoints into Postman
2. Set base URL: `http://localhost:3000/api`
3. For authenticated requests:
   - Go to Authorization tab
   - Select "Bearer Token"
   - Paste your JWT token

### Using Browser DevTools

```javascript
// In browser console
fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'testuser',
    password: 'password123'
  })
})
.then(r => r.json())
.then(data => console.log(data));
```

---

## Additional Resources

- [Frontend Integration Guide](./FRONTEND_INTEGRATION.md) - Detailed guide for integrating with frontend applications
- [README](./README.md) - Backend setup and development guide
