# Quick Test Commands

## Prerequisites
Make sure the server is running:
```bash
cd backend
npm run dev
```

## 1. Health Check
```bash
curl http://localhost:3000/health
```

## 2. Register a User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**📝 Copy the `token` and `id` from the response!**

## 3. Login (if already registered)
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

## 4. Create Profile
```bash
# Replace YOUR_TOKEN with your actual token
export TOKEN="YOUR_TOKEN"

curl -X POST http://localhost:3000/api/profiles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "displayName": "Test User",
    "bio": "I love reading books!",
    "avatarUrl": "https://i.pravatar.cc/150?img=3"
  }'
```

## 5. Search OpenLibrary
```bash
curl -X GET "http://localhost:3000/api/books/search/openlibrary?q=harry+potter" \
  -H "Authorization: Bearer $TOKEN"
```

## 6. Add Book from OpenLibrary
```bash
# Harry Potter and the Philosopher's Stone
curl -X POST http://localhost:3000/api/books/from-openlibrary \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "openLibraryKey": "/works/OL82563W"
  }'
```

**📝 Copy the book `id` from the response!**

## 7. Write a Review
```bash
# Replace BOOK_ID with your actual book ID
export BOOK_ID="YOUR_BOOK_ID"

curl -X POST http://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"bookId\": \"$BOOK_ID\",
    \"rating\": 5,
    \"text\": \"Amazing book! Loved every page.\"
  }"
```

## 8. Get Reviews for a Book
```bash
curl -X GET "http://localhost:3000/api/reviews/books/$BOOK_ID" \
  -H "Authorization: Bearer $TOKEN"
```

## 9. Get Your Reviews
```bash
# Replace USER_ID with your actual user ID
export USER_ID="YOUR_USER_ID"

curl -X GET "http://localhost:3000/api/reviews/users/$USER_ID" \
  -H "Authorization: Bearer $TOKEN"
```

## 10. Search Local Books
```bash
# Search for specific books
curl -X GET "http://localhost:3000/api/books/search?q=harry" \
  -H "Authorization: Bearer $TOKEN"

# Get all books (empty query)
curl -X GET "http://localhost:3000/api/books/search?q=" \
  -H "Authorization: Bearer $TOKEN"
```

## 11. Update a Review
```bash
# Replace REVIEW_ID with your actual review ID
export REVIEW_ID="YOUR_REVIEW_ID"

curl -X PUT "http://localhost:3000/api/reviews/$REVIEW_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "rating": 4,
    "text": "Updated my review - still great but not perfect."
  }'
```

## 12. Delete a Review
```bash
curl -X DELETE "http://localhost:3000/api/reviews/$REVIEW_ID" \
  -H "Authorization: Bearer $TOKEN"
```

## 🚀 Quick Populate Script

Instead of running commands manually, use the populate script:

```bash
chmod +x populate_db.sh
./populate_db.sh
```

This will:
- Create 2 users (alice and bob)
- Create profiles for both
- Add 5 classic books
- Write 6 reviews

## 📊 Useful Queries

### Get a specific book
```bash
curl -X GET "http://localhost:3000/api/books/$BOOK_ID" \
  -H "Authorization: Bearer $TOKEN"
```

### Get a user's profile
```bash
curl -X GET "http://localhost:3000/api/profiles/$USER_ID" \
  -H "Authorization: Bearer $TOKEN"
```

### Update your profile
```bash
curl -X PUT "http://localhost:3000/api/profiles/$USER_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "displayName": "Updated Name",
    "bio": "New bio text"
  }'
```

## 💡 Tips

1. **Save your token**: Export it as an environment variable for easier testing
   ```bash
   export TOKEN="your_token_here"
   ```

2. **Use jq for pretty output**: If you have jq installed
   ```bash
   curl ... | jq
   ```

3. **Check server logs**: Watch the terminal where `npm run dev` is running

4. **Data resets on restart**: The in-memory database clears when you restart the server

## 🔍 Popular Books to Try

Here are some OpenLibrary keys for popular books:

- **1984** by George Orwell: `/works/OL1168007W`
- **The Great Gatsby**: `/works/OL468516W`
- **To Kill a Mockingbird**: `/works/OL15434989W`
- **Harry Potter**: `/works/OL82563W`
- **The Hobbit**: `/works/OL27482W`
- **Pride and Prejudice**: `/works/OL66554W`
- **The Catcher in the Rye**: `/works/OL3335490W`
- **Lord of the Rings**: `/works/OL27448W`

## 🐛 Troubleshooting

**401 Unauthorized?**
- Check your token is correct
- Token might have expired (24 hours)
- Re-login to get a new token

**404 Not Found?**
- Check the ID is correct
- Make sure the resource exists

**409 Conflict?**
- Username/email already taken
- Already reviewed this book
- Display name too long (max 100 chars)

**CORS Error?**
- Add your origin to FRONTEND_URL in .env
- Restart the server after changing .env
