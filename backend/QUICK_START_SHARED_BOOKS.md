# Quick Start: Shared Books Feature

## Setup & Test (3 steps)

### 1. Start the Server
```bash
cd backend
npm run dev
```

### 2. Populate Test Data
In a new terminal:
```bash
cd backend
./populate_db.sh
```

This creates:
- 5 users (alice, bob, charlie, diana, eve)
- 7 books from OpenLibrary
- 18 reviews with strategic overlaps

### 3. Test the Feature
```bash
./test-shared-books-populated.sh
```

## Quick API Test

```bash
# Login as Alice
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"password123"}' \
  | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# Find users with shared books
curl -X GET http://localhost:3000/api/users/shared-books \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
```

## Expected Result

Alice should find:
1. **Charlie** (2 shared books: 1984, Harry Potter)
2. **Diana** (2 shared books: Great Gatsby, Harry Potter)
3. **Bob** (1 shared book: 1984)
4. **Eve** (1 shared book: Harry Potter)

## Test with Different Users

```bash
# Login as Charlie
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"charlie","password":"password123"}' \
  | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# Find Charlie's matches
curl -X GET http://localhost:3000/api/users/shared-books \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
```

Charlie should find:
1. **Alice** (2 shared books)
2. **Bob** (2 shared books)
3. **Eve** (2 shared books)
4. **Diana** (1 shared book)

## Files Reference

- `populate_db.sh` - Creates test data with 5 users and intersecting reviews
- `test-shared-books-populated.sh` - Tests the shared books API
- `SHARED_BOOKS_TEST_DATA.md` - Detailed breakdown of test data
- `SHARED_BOOKS_FEATURE.md` - Complete feature documentation
- `API_DOCUMENTATION.md` - Full API reference

## Troubleshooting

**Server not running?**
```bash
npm run dev
```

**Need to reset data?**
Restart the server (it uses in-memory storage) and run `populate_db.sh` again.

**Token expired?**
Login again to get a fresh token.
