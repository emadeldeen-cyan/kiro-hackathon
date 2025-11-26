#!/bin/bash

# Book Management API - Database Population Script
# This script demonstrates the complete API workflow

BASE_URL="http://localhost:3000/api"

echo "🚀 Book Management API - Database Population"
echo "=============================================="

# Check if server is running
echo -e "\n📡 Checking server status..."
if ! curl -s http://localhost:3000/health > /dev/null; then
    echo "❌ Server is not running!"
    echo "Please start the server with: npm run dev"
    exit 1
fi
echo "✅ Server is running"

# Register User 1
echo -e "\n👤 Registering User 1: Alice..."
REGISTER1=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "alice",
    "email": "alice@example.com",
    "password": "password123"
  }')

TOKEN1=$(echo $REGISTER1 | grep -o '"token":"[^"]*' | grep -o '[^"]*$')
USER1_ID=$(echo $REGISTER1 | grep -o '"id":"[^"]*' | grep -o '[^"]*$' | head -1)

if [ -z "$TOKEN1" ]; then
    echo "❌ Failed to register user 1"
    echo $REGISTER1
    exit 1
fi

echo "✅ User 1 registered (ID: $USER1_ID)"

# Register User 2
echo -e "\n👤 Registering User 2: Bob..."
REGISTER2=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "bob",
    "email": "bob@example.com",
    "password": "password123"
  }')

TOKEN2=$(echo $REGISTER2 | grep -o '"token":"[^"]*' | grep -o '[^"]*$')
USER2_ID=$(echo $REGISTER2 | grep -o '"id":"[^"]*' | grep -o '[^"]*$' | head -1)

echo "✅ User 2 registered (ID: $USER2_ID)"

# Create Profile for Alice
echo -e "\n📝 Creating profile for Alice..."
curl -s -X POST $BASE_URL/profiles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN1" \
  -d '{
    "displayName": "Alice Johnson",
    "bio": "Book lover and avid reader. Especially love classic literature!",
    "avatarUrl": "https://i.pravatar.cc/150?img=1"
  }' > /dev/null

echo "✅ Profile created for Alice"

# Create Profile for Bob
echo -e "\n📝 Creating profile for Bob..."
curl -s -X POST $BASE_URL/profiles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN2" \
  -d '{
    "displayName": "Bob Smith",
    "bio": "Science fiction enthusiast and tech geek",
    "avatarUrl": "https://i.pravatar.cc/150?img=5"
  }' > /dev/null

echo "✅ Profile created for Bob"

# Add Books
echo -e "\n📚 Adding books from OpenLibrary..."

# 1984 by George Orwell
echo "  Adding: 1984 by George Orwell..."
BOOK1=$(curl -s -X POST $BASE_URL/books/from-openlibrary \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN1" \
  -d '{"openLibraryKey": "/works/OL1168007W"}')
BOOK1_ID=$(echo $BOOK1 | grep -o '"id":"[^"]*' | grep -o '[^"]*$' | head -1)

# The Great Gatsby
echo "  Adding: The Great Gatsby by F. Scott Fitzgerald..."
BOOK2=$(curl -s -X POST $BASE_URL/books/from-openlibrary \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN1" \
  -d '{"openLibraryKey": "/works/OL468516W"}')
BOOK2_ID=$(echo $BOOK2 | grep -o '"id":"[^"]*' | grep -o '[^"]*$' | head -1)

# To Kill a Mockingbird
echo "  Adding: To Kill a Mockingbird by Harper Lee..."
BOOK3=$(curl -s -X POST $BASE_URL/books/from-openlibrary \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN1" \
  -d '{"openLibraryKey": "/works/OL15434989W"}')
BOOK3_ID=$(echo $BOOK3 | grep -o '"id":"[^"]*' | grep -o '[^"]*$' | head -1)

# Harry Potter
echo "  Adding: Harry Potter and the Philosopher's Stone..."
BOOK4=$(curl -s -X POST $BASE_URL/books/from-openlibrary \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN2" \
  -d '{"openLibraryKey": "/works/OL82563W"}')
BOOK4_ID=$(echo $BOOK4 | grep -o '"id":"[^"]*' | grep -o '[^"]*$' | head -1)

# The Hobbit
echo "  Adding: The Hobbit by J.R.R. Tolkien..."
BOOK5=$(curl -s -X POST $BASE_URL/books/from-openlibrary \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN2" \
  -d '{"openLibraryKey": "/works/OL27482W"}')
BOOK5_ID=$(echo $BOOK5 | grep -o '"id":"[^"]*' | grep -o '[^"]*$' | head -1)

echo "✅ 5 books added to library"

# Add Reviews
echo -e "\n⭐ Adding reviews..."

# Alice's reviews
echo "  Alice reviewing 1984..."
curl -s -X POST $BASE_URL/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN1" \
  -d "{
    \"bookId\": \"$BOOK1_ID\",
    \"rating\": 5,
    \"text\": \"A masterpiece! Orwell's vision is more relevant than ever. The themes of surveillance and control are chilling.\"
  }" > /dev/null

echo "  Alice reviewing The Great Gatsby..."
curl -s -X POST $BASE_URL/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN1" \
  -d "{
    \"bookId\": \"$BOOK2_ID\",
    \"rating\": 4,
    \"text\": \"Beautiful prose and a tragic story. Fitzgerald captures the Jazz Age perfectly.\"
  }" > /dev/null

echo "  Alice reviewing Harry Potter..."
curl -s -X POST $BASE_URL/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN1" \
  -d "{
    \"bookId\": \"$BOOK4_ID\",
    \"rating\": 5,
    \"text\": \"Magical! A perfect introduction to the wizarding world. Loved it as a kid and still love it now.\"
  }" > /dev/null

# Bob's reviews
echo "  Bob reviewing To Kill a Mockingbird..."
curl -s -X POST $BASE_URL/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN2" \
  -d "{
    \"bookId\": \"$BOOK3_ID\",
    \"rating\": 5,
    \"text\": \"A powerful story about justice and morality. Scout is an unforgettable narrator.\"
  }" > /dev/null

echo "  Bob reviewing The Hobbit..."
curl -s -X POST $BASE_URL/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN2" \
  -d "{
    \"bookId\": \"$BOOK5_ID\",
    \"rating\": 5,
    \"text\": \"An adventure for the ages! Bilbo's journey is both exciting and heartwarming.\"
  }" > /dev/null

echo "  Bob reviewing 1984..."
curl -s -X POST $BASE_URL/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN2" \
  -d "{
    \"bookId\": \"$BOOK1_ID\",
    \"rating\": 4,
    \"text\": \"Disturbing but important. Makes you think about privacy and freedom in the digital age.\"
  }" > /dev/null

echo "✅ 6 reviews added"

# Display Summary
echo -e "\n" 
echo "=============================================="
echo "✅ Database Population Complete!"
echo "=============================================="
echo ""
echo "📊 Summary:"
echo "  • 2 users registered"
echo "  • 2 profiles created"
echo "  • 5 books added"
echo "  • 6 reviews written"
echo ""
echo "🔑 User Credentials:"
echo "  User 1: alice / password123"
echo "  User 2: bob / password123"
echo ""
echo "🎯 Try these commands:"
echo ""
echo "# Get all books"
echo "curl -X GET '$BASE_URL/books/search?q=' \\"
echo "  -H 'Authorization: Bearer $TOKEN1'"
echo ""
echo "# Get Alice's reviews"
echo "curl -X GET '$BASE_URL/reviews/users/$USER1_ID' \\"
echo "  -H 'Authorization: Bearer $TOKEN1'"
echo ""
echo "# Search for books"
echo "curl -X GET '$BASE_URL/books/search?q=harry' \\"
echo "  -H 'Authorization: Bearer $TOKEN1'"
echo ""
echo "# Get reviews for 1984"
echo "curl -X GET '$BASE_URL/reviews/books/$BOOK1_ID' \\"
echo "  -H 'Authorization: Bearer $TOKEN1'"
echo ""
echo "📚 Happy reading!"
