# Book Management API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication

All endpoints except `/auth/register` and `/auth/login` require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

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
