# Shared Books Feature

## Overview
This feature allows users to discover other users who have reviewed the same books as them. Results are sorted by the number of shared books (descending), then alphabetically by username.

## API Endpoint

### GET /api/users/shared-books

Find users who have reviewed the same books as the authenticated user.

**Authentication Required:** Yes (Bearer token)

**Request:**
```
GET /api/users/shared-books
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "user_3",
    "username": "charlie",
    "email": "charlie@example.com",
    "sharedBookCount": 3
  },
  {
    "id": "user_2",
    "username": "bob",
    "email": "bob@example.com",
    "sharedBookCount": 2
  }
]
```

**Status Codes:**
- `200 OK` - Successfully retrieved users with shared books
- `401 Unauthorized` - Missing or invalid authentication token
- `404 Not Found` - User not found
- `500 Internal Server Error` - Server error

## Implementation Details

### Service Layer
- **Method:** `UserService.findUsersWithSameBooks(userId: string)`
- **Returns:** Array of `UserWithSharedBooks` objects
- **Sorting:** By shared book count (descending), then username (ascending)

### Repository Layer
- **Method:** `UserRepository.findUsersWithSharedBooks(userId: string)`
- **Logic:**
  1. Gets all books reviewed by the current user
  2. For each book, finds other users who reviewed it
  3. Counts shared books per user
  4. Sorts results by count (desc) and username (asc)

## Testing

Run the test script to verify functionality:

```bash
npm run build
node dist/test-shared-books.js
```

## Example Usage

```bash
# Login to get token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "alice", "password": "password123"}'

# Find users with shared books
curl -X GET http://localhost:3000/api/users/shared-books \
  -H "Authorization: Bearer <your-token>"
```
