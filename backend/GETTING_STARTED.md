# Getting Started with Book Management Backend

## 🎯 Current Status

✅ **Backend is FULLY IMPLEMENTED and ready for frontend integration!**

All core features are complete:
- ✅ User registration and authentication (JWT-based)
- ✅ Profile management
- ✅ OpenLibrary API integration for book search
- ✅ Book management (add from OpenLibrary, local search)
- ✅ Review system (create, update, delete, view)
- ✅ CORS configured for frontend integration
- ✅ All 39 tests passing

## 🗄️ Database

**Current Setup**: In-memory database (data resets on server restart)

This is perfect for:
- Development and testing
- Quick prototyping
- Frontend integration without database setup
- **No PostgreSQL installation required!**

**Configuration**: Set `USE_IN_MEMORY=true` in `.env` (default)

**Future**: Can be easily switched to PostgreSQL by:
1. Setting `USE_IN_MEMORY=false` in `.env`
2. Configuring PostgreSQL connection details
3. Installing and running PostgreSQL

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
```bash
# .env file is already created with in-memory database enabled
# No PostgreSQL required!

# If you want to customize settings:
# cp .env.example .env
# Edit .env as needed
```

### 3. Start the Server
```bash
npm run dev
```

Server will start at: **http://localhost:3000**

## 🧪 Test the API

### Step 1: Register a User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "alice",
    "email": "alice@example.com",
    "password": "password123"
  }'
```

**Save the token from the response!**

### Step 2: Create a Profile
```bash
# Replace YOUR_TOKEN with the token from registration
curl -X POST http://localhost:3000/api/profiles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "displayName": "Alice Johnson",
    "bio": "Book lover and avid reader",
    "avatarUrl": "https://i.pravatar.cc/150?img=1"
  }'
```

### Step 3: Search for Books on OpenLibrary
```bash
curl -X GET "http://localhost:3000/api/books/search/openlibrary?q=harry+potter" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Step 4: Add a Book to Your Library
```bash
# Use a key from the search results (e.g., /works/OL82563W for Harry Potter)
curl -X POST http://localhost:3000/api/books/from-openlibrary \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "openLibraryKey": "/works/OL82563W"
  }'
```

**Save the book ID from the response!**

### Step 5: Write a Review
```bash
# Replace BOOK_ID with the ID from step 4
curl -X POST http://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "bookId": "BOOK_ID",
    "rating": 5,
    "text": "Amazing book! Loved every page."
  }'
```

### Step 6: Get Your Reviews
```bash
# Replace USER_ID with your user ID from registration
curl -X GET "http://localhost:3000/api/reviews/users/USER_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Step 7: Search Local Books
```bash
curl -X GET "http://localhost:3000/api/books/search?q=harry" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📝 Complete Workflow Script

Here's a complete bash script to populate your database:

```bash
#!/bin/bash

BASE_URL="http://localhost:3000/api"

echo "=== Registering User ==="
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "bookworm",
    "email": "bookworm@example.com",
    "password": "reading123"
  }')

TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
USER_ID=$(echo $REGISTER_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)

echo "Token: $TOKEN"
echo "User ID: $USER_ID"

echo -e "\n=== Creating Profile ==="
curl -s -X POST $BASE_URL/profiles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "displayName": "The Bookworm",
    "bio": "Reading is my superpower",
    "avatarUrl": "https://i.pravatar.cc/150?img=5"
  }' | jq

echo -e "\n=== Searching OpenLibrary ==="
curl -s -X GET "$BASE_URL/books/search/openlibrary?q=1984+orwell" \
  -H "Authorization: Bearer $TOKEN" | jq

echo -e "\n=== Adding 1984 to Library ==="
BOOK_RESPONSE=$(curl -s -X POST $BASE_URL/books/from-openlibrary \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "openLibraryKey": "/works/OL1168007W"
  }')

BOOK_ID=$(echo $BOOK_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)
echo $BOOK_RESPONSE | jq
echo "Book ID: $BOOK_ID"

echo -e "\n=== Writing Review ==="
curl -s -X POST $BASE_URL/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"bookId\": \"$BOOK_ID\",
    \"rating\": 5,
    \"text\": \"A masterpiece! Orwell's vision is more relevant than ever.\"
  }" | jq

echo -e "\n=== Adding More Books ==="
# The Great Gatsby
curl -s -X POST $BASE_URL/books/from-openlibrary \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"openLibraryKey": "/works/OL468516W"}' | jq

# To Kill a Mockingbird
BOOK2_RESPONSE=$(curl -s -X POST $BASE_URL/books/from-openlibrary \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"openLibraryKey": "/works/OL15434989W"}')

BOOK2_ID=$(echo $BOOK2_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)

echo -e "\n=== Writing Another Review ==="
curl -s -X POST $BASE_URL/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"bookId\": \"$BOOK2_ID\",
    \"rating\": 4,
    \"text\": \"A powerful story about justice and morality.\"
  }" | jq

echo -e "\n=== Getting All My Reviews ==="
curl -s -X GET "$BASE_URL/reviews/users/$USER_ID" \
  -H "Authorization: Bearer $TOKEN" | jq

echo -e "\n=== Searching Local Books ==="
curl -s -X GET "$BASE_URL/books/search?q=" \
  -H "Authorization: Bearer $TOKEN" | jq

echo -e "\n✅ Database populated successfully!"
```

Save this as `populate_db.sh`, make it executable (`chmod +x populate_db.sh`), and run it!

## 🔧 Useful Commands

### Run Tests
```bash
npm test
```

### Check Server Health
```bash
curl http://localhost:3000/health
```

### Login (if you already have an account)
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "alice",
    "password": "password123"
  }'
```

## 📚 API Documentation

Full API documentation is available in:
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Complete endpoint reference
- **[FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md)** - Frontend integration guide

## 🎨 Frontend Integration

The backend is **100% ready** for frontend integration:

1. **CORS is configured** - Set `FRONTEND_URL` in `.env`
2. **JWT authentication** - Include token in `Authorization: Bearer <token>` header
3. **RESTful API** - Standard HTTP methods and JSON responses
4. **Error handling** - Consistent error response format

See [FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md) for React, Angular, and Vue examples.

## 🔐 Authentication Flow

1. **Register** → Receive token
2. **Store token** (localStorage, sessionStorage, or memory)
3. **Include token** in all subsequent requests
4. **Token expires** after 24 hours (configurable)

## 📊 What's Implemented

### ✅ User Management
- Registration with validation
- Login with JWT tokens
- Password hashing with bcrypt

### ✅ Profile Management
- Create profile
- Update profile
- View any user's profile

### ✅ Book Management
- Search OpenLibrary API
- Add books from OpenLibrary
- Local book search
- Automatic deduplication

### ✅ Review System
- Create reviews (1-5 stars)
- Update own reviews
- Delete own reviews
- View reviews by book
- View reviews by user
- One review per user per book

### ✅ Security
- JWT authentication
- Password hashing
- Authorization checks
- CORS protection

## 🚧 What's Next

The backend is complete! Next steps:

1. **Frontend Development** (Tasks 12-20 in tasks.md)
   - Angular application
   - User interface
   - Integration with this backend

2. **Optional Enhancements**
   - Switch to PostgreSQL/MongoDB
   - Add property-based tests (marked optional in tasks)
   - Add more features

## 💡 Tips

- **Data persists** only while server is running (in-memory)
- **Restart server** to reset database
- **Use Postman** for easier API testing
- **Check logs** for debugging information

## 🐛 Troubleshooting

**Port already in use?**
```bash
# Change PORT in .env file
PORT=3001
```

**CORS errors?**
```bash
# Add your frontend URL to .env
FRONTEND_URL=http://localhost:4200,http://localhost:3000
```

**Tests failing?**
```bash
# Run tests to see what's wrong
npm test
```

## 📞 Need Help?

- Check [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for endpoint details
- Check [FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md) for integration examples
- Review test files in `src/**/*.test.ts` for usage examples
