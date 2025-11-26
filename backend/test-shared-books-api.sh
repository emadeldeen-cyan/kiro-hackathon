#!/bin/bash

# Test script for shared books API endpoint
# Make sure the server is running before executing this script

BASE_URL="http://localhost:3000/api"

echo "=== Testing Shared Books API Endpoint ==="
echo ""

# Register test users
echo "1. Registering test users..."
USER1=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser1", "email": "test1@example.com", "password": "password123"}')
echo "User 1: $USER1"

USER2=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser2", "email": "test2@example.com", "password": "password123"}')
echo "User 2: $USER2"

USER3=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser3", "email": "test3@example.com", "password": "password123"}')
echo "User 3: $USER3"
echo ""

# Login as user1
echo "2. Logging in as testuser1..."
LOGIN1=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser1", "password": "password123"}')
TOKEN1=$(echo $LOGIN1 | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Token: $TOKEN1"
echo ""

# Login as user2
echo "3. Logging in as testuser2..."
LOGIN2=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser2", "password": "password123"}')
TOKEN2=$(echo $LOGIN2 | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo ""

# Login as user3
echo "4. Logging in as testuser3..."
LOGIN3=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser3", "password": "password123"}')
TOKEN3=$(echo $LOGIN3 | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo ""

# Add books
echo "5. Adding books from OpenLibrary..."
BOOK1=$(curl -s -X POST "$BASE_URL/books" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN1" \
  -d '{"openLibraryKey": "/works/OL45804W"}')
BOOK1_ID=$(echo $BOOK1 | grep -o '"id":"[^"]*' | cut -d'"' -f4)
echo "Book 1 ID: $BOOK1_ID"

BOOK2=$(curl -s -X POST "$BASE_URL/books" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN1" \
  -d '{"openLibraryKey": "/works/OL27258W"}')
BOOK2_ID=$(echo $BOOK2 | grep -o '"id":"[^"]*' | cut -d'"' -f4)
echo "Book 2 ID: $BOOK2_ID"
echo ""

# Create reviews to establish shared books
echo "6. Creating reviews..."
# User1 reviews both books
curl -s -X POST "$BASE_URL/reviews" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN1" \
  -d "{\"bookId\": \"$BOOK1_ID\", \"rating\": 5, \"text\": \"Great book!\"}" > /dev/null
echo "User1 reviewed Book1"

curl -s -X POST "$BASE_URL/reviews" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN1" \
  -d "{\"bookId\": \"$BOOK2_ID\", \"rating\": 4, \"text\": \"Good read!\"}" > /dev/null
echo "User1 reviewed Book2"

# User2 reviews both books (2 shared with User1)
curl -s -X POST "$BASE_URL/reviews" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN2" \
  -d "{\"bookId\": \"$BOOK1_ID\", \"rating\": 4, \"text\": \"Nice!\"}" > /dev/null
echo "User2 reviewed Book1"

curl -s -X POST "$BASE_URL/reviews" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN2" \
  -d "{\"bookId\": \"$BOOK2_ID\", \"rating\": 5, \"text\": \"Excellent!\"}" > /dev/null
echo "User2 reviewed Book2"

# User3 reviews only Book1 (1 shared with User1)
curl -s -X POST "$BASE_URL/reviews" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN3" \
  -d "{\"bookId\": \"$BOOK1_ID\", \"rating\": 3, \"text\": \"Okay!\"}" > /dev/null
echo "User3 reviewed Book1"
echo ""

# Test the shared books endpoint
echo "7. Finding users with shared books (as testuser1)..."
SHARED=$(curl -s -X GET "$BASE_URL/users/shared-books" \
  -H "Authorization: Bearer $TOKEN1")
echo "Response:"
echo $SHARED | python3 -m json.tool 2>/dev/null || echo $SHARED
echo ""

echo "=== Test Complete ==="
echo ""
echo "Expected: testuser2 should appear first (2 shared books), then testuser3 (1 shared book)"
