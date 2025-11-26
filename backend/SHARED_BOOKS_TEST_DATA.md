# Shared Books Test Data

## Overview
The `populate_db.sh` script creates a test dataset with 5 users and 7 books, with strategically placed reviews to demonstrate the shared books feature.

## Users
1. **Alice** - Classic literature lover
2. **Bob** - Science fiction enthusiast
3. **Charlie** - Fantasy and adventure lover
4. **Diana** - Mystery and thriller fan
5. **Eve** - Romance and contemporary fiction reader

## Books
1. **1984** by George Orwell
2. **The Great Gatsby** by F. Scott Fitzgerald
3. **To Kill a Mockingbird** by Harper Lee
4. **Harry Potter and the Philosopher's Stone** by J.K. Rowling
5. **The Hobbit** by J.R.R. Tolkien
6. **Pride and Prejudice** by Jane Austen
7. **The Catcher in the Rye** by J.D. Salinger

## Review Matrix

| User    | 1984 | Gatsby | Mockingbird | Harry Potter | Hobbit | Pride & Prejudice | Catcher |
|---------|------|--------|-------------|--------------|--------|-------------------|---------|
| Alice   | ✓    | ✓      |             | ✓            |        |                   |         |
| Bob     | ✓    |        | ✓           |              | ✓      |                   |         |
| Charlie | ✓    |        |             | ✓            | ✓      |                   |         |
| Diana   |      | ✓      |             | ✓            |        | ✓                 |         |
| Eve     |      |        |             | ✓            | ✓      | ✓                 |         |

## Shared Books Analysis

### From Alice's Perspective
Alice has reviewed: **1984**, **The Great Gatsby**, **Harry Potter**

**Users with shared books (sorted by count, then alphabetically):**

1. **Charlie** - 2 shared books
   - 1984 ✓
   - Harry Potter ✓

2. **Diana** - 2 shared books
   - The Great Gatsby ✓
   - Harry Potter ✓

3. **Bob** - 1 shared book
   - 1984 ✓

4. **Eve** - 1 shared book
   - Harry Potter ✓

### From Charlie's Perspective
Charlie has reviewed: **1984**, **Harry Potter**, **The Hobbit**

**Users with shared books:**

1. **Alice** - 2 shared books (1984, Harry Potter)
2. **Bob** - 2 shared books (1984, The Hobbit)
3. **Diana** - 1 shared book (Harry Potter)
4. **Eve** - 2 shared books (Harry Potter, The Hobbit)

### Most Popular Book
**Harry Potter** is the most reviewed book with 4 reviews (Alice, Charlie, Diana, Eve)

## Testing the Feature

### 1. Populate the Database
```bash
cd backend
./populate_db.sh
```

### 2. Test Shared Books Feature
```bash
./test-shared-books-populated.sh
```

### 3. Manual API Test
```bash
# Login as Alice
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "alice", "password": "password123"}'

# Use the token from the response
curl -X GET http://localhost:3000/api/users/shared-books \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Expected API Response (for Alice)

```json
[
  {
    "id": "user_3",
    "username": "charlie",
    "email": "charlie@example.com",
    "sharedBookCount": 2
  },
  {
    "id": "user_4",
    "username": "diana",
    "email": "diana@example.com",
    "sharedBookCount": 2
  },
  {
    "id": "user_2",
    "username": "bob",
    "email": "bob@example.com",
    "sharedBookCount": 1
  },
  {
    "id": "user_5",
    "username": "eve",
    "email": "eve@example.com",
    "sharedBookCount": 1
  }
]
```

## Sorting Logic

The results are sorted by:
1. **Shared book count** (descending) - Users with more shared books appear first
2. **Username** (alphabetically ascending) - When counts are equal, sort by username

This ensures:
- Charlie and Diana (both with 2 shared books) are listed first, with Charlie before Diana
- Bob and Eve (both with 1 shared book) are listed next, with Bob before Eve

## Use Cases Demonstrated

1. **Finding reading buddies** - Users can discover others with similar reading interests
2. **Book recommendations** - Users with shared books might have similar tastes
3. **Community building** - Connect users based on common interests
4. **Social features** - Foundation for friend suggestions or reading groups
