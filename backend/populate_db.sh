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

# Register User 3
echo -e "\n👤 Registering User 3: Charlie..."
REGISTER3=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "charlie",
    "email": "charlie@example.com",
    "password": "password123"
  }')

TOKEN3=$(echo $REGISTER3 | grep -o '"token":"[^"]*' | grep -o '[^"]*$')
USER3_ID=$(echo $REGISTER3 | grep -o '"id":"[^"]*' | grep -o '[^"]*$' | head -1)

echo "✅ User 3 registered (ID: $USER3_ID)"

# Register User 4
echo -e "\n👤 Registering User 4: Diana..."
REGISTER4=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "diana",
    "email": "diana@example.com",
    "password": "password123"
  }')

TOKEN4=$(echo $REGISTER4 | grep -o '"token":"[^"]*' | grep -o '[^"]*$')
USER4_ID=$(echo $REGISTER4 | grep -o '"id":"[^"]*' | grep -o '[^"]*$' | head -1)

echo "✅ User 4 registered (ID: $USER4_ID)"

# Register User 5
echo -e "\n👤 Registering User 5: Eve..."
REGISTER5=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "eve",
    "email": "eve@example.com",
    "password": "password123"
  }')

TOKEN5=$(echo $REGISTER5 | grep -o '"token":"[^"]*' | grep -o '[^"]*$')
USER5_ID=$(echo $REGISTER5 | grep -o '"id":"[^"]*' | grep -o '[^"]*$' | head -1)

echo "✅ User 5 registered (ID: $USER5_ID)"

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

# Create Profile for Charlie
echo -e "\n📝 Creating profile for Charlie..."
curl -s -X POST $BASE_URL/profiles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN3" \
  -d '{
    "displayName": "Charlie Brown",
    "bio": "Fantasy and adventure lover. Always looking for the next great quest!",
    "avatarUrl": "https://i.pravatar.cc/150?img=12"
  }' > /dev/null

echo "✅ Profile created for Charlie"

# Create Profile for Diana
echo -e "\n📝 Creating profile for Diana..."
curl -s -X POST $BASE_URL/profiles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN4" \
  -d '{
    "displayName": "Diana Prince",
    "bio": "Mystery and thriller fan. Love books that keep me on the edge of my seat!",
    "avatarUrl": "https://i.pravatar.cc/150?img=20"
  }' > /dev/null

echo "✅ Profile created for Diana"

# Create Profile for Eve
echo -e "\n📝 Creating profile for Eve..."
curl -s -X POST $BASE_URL/profiles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN5" \
  -d '{
    "displayName": "Eve Anderson",
    "bio": "Romance and contemporary fiction reader. Love stories that touch the heart.",
    "avatarUrl": "https://i.pravatar.cc/150?img=25"
  }' > /dev/null

echo "✅ Profile created for Eve"

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

# Pride and Prejudice
echo "  Adding: Pride and Prejudice by Jane Austen..."
BOOK6=$(curl -s -X POST $BASE_URL/books/from-openlibrary \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN3" \
  -d '{"openLibraryKey": "/works/OL66554W"}')
BOOK6_ID=$(echo $BOOK6 | grep -o '"id":"[^"]*' | grep -o '[^"]*$' | head -1)

# The Catcher in the Rye
echo "  Adding: The Catcher in the Rye by J.D. Salinger..."
BOOK7=$(curl -s -X POST $BASE_URL/books/from-openlibrary \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN4" \
  -d '{"openLibraryKey": "/works/OL3335490W"}')
BOOK7_ID=$(echo $BOOK7 | grep -o '"id":"[^"]*' | grep -o '[^"]*$' | head -1)

echo "✅ 7 books added to library"

# Add Reviews
echo -e "\n⭐ Adding reviews..."
echo "  Creating intersecting book reviews for shared books feature..."

# Alice's reviews (1984, Great Gatsby, Harry Potter)
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

# Bob's reviews (1984, To Kill a Mockingbird, The Hobbit) - 1 shared with Alice
echo "  Bob reviewing 1984..."
curl -s -X POST $BASE_URL/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN2" \
  -d "{
    \"bookId\": \"$BOOK1_ID\",
    \"rating\": 4,
    \"text\": \"Disturbing but important. Makes you think about privacy and freedom in the digital age.\"
  }" > /dev/null

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

# Charlie's reviews (1984, Harry Potter, The Hobbit) - 2 shared with Alice
echo "  Charlie reviewing 1984..."
curl -s -X POST $BASE_URL/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN3" \
  -d "{
    \"bookId\": \"$BOOK1_ID\",
    \"rating\": 5,
    \"text\": \"Absolutely brilliant! The concept of Big Brother is terrifying and thought-provoking.\"
  }" > /dev/null

echo "  Charlie reviewing Harry Potter..."
curl -s -X POST $BASE_URL/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN3" \
  -d "{
    \"bookId\": \"$BOOK4_ID\",
    \"rating\": 5,
    \"text\": \"Pure magic! This book sparked my love for fantasy. Hogwarts feels like home.\"
  }" > /dev/null

echo "  Charlie reviewing The Hobbit..."
curl -s -X POST $BASE_URL/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN3" \
  -d "{
    \"bookId\": \"$BOOK5_ID\",
    \"rating\": 4,
    \"text\": \"A wonderful adventure! Tolkien's world-building is incredible.\"
  }" > /dev/null

# Diana's reviews (Great Gatsby, Harry Potter, Pride and Prejudice) - 2 shared with Alice
echo "  Diana reviewing The Great Gatsby..."
curl -s -X POST $BASE_URL/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN4" \
  -d "{
    \"bookId\": \"$BOOK2_ID\",
    \"rating\": 5,
    \"text\": \"The symbolism is incredible! Every time I read it, I discover something new.\"
  }" > /dev/null

echo "  Diana reviewing Harry Potter..."
curl -s -X POST $BASE_URL/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN4" \
  -d "{
    \"bookId\": \"$BOOK4_ID\",
    \"rating\": 4,
    \"text\": \"A delightful read! The characters are so well-developed and relatable.\"
  }" > /dev/null

echo "  Diana reviewing Pride and Prejudice..."
curl -s -X POST $BASE_URL/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN4" \
  -d "{
    \"bookId\": \"$BOOK6_ID\",
    \"rating\": 5,
    \"text\": \"Austen's wit is unmatched! Elizabeth Bennet is one of literature's greatest heroines.\"
  }" > /dev/null

# Eve's reviews (Harry Potter, The Hobbit, Pride and Prejudice) - 1 shared with Alice
echo "  Eve reviewing Harry Potter..."
curl -s -X POST $BASE_URL/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN5" \
  -d "{
    \"bookId\": \"$BOOK4_ID\",
    \"rating\": 5,
    \"text\": \"Enchanting from start to finish! A timeless classic that appeals to all ages.\"
  }" > /dev/null

echo "  Eve reviewing The Hobbit..."
curl -s -X POST $BASE_URL/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN5" \
  -d "{
    \"bookId\": \"$BOOK5_ID\",
    \"rating\": 4,
    \"text\": \"A charming tale of courage and friendship. Bilbo's transformation is inspiring.\"
  }" > /dev/null

echo "  Eve reviewing Pride and Prejudice..."
curl -s -X POST $BASE_URL/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN5" \
  -d "{
    \"bookId\": \"$BOOK6_ID\",
    \"rating\": 5,
    \"text\": \"The romance is perfect! Mr. Darcy and Elizabeth's relationship is beautifully written.\"
  }" > /dev/null

echo "✅ 18 reviews added with intersecting books"

# Display Summary
echo -e "\n" 
echo "=============================================="
echo "✅ Database Population Complete!"
echo "=============================================="
echo ""
echo "📊 Summary:"
echo "  • 5 users registered"
echo "  • 5 profiles created"
echo "  • 7 books added"
echo "  • 18 reviews written"
echo ""
echo "🔑 User Credentials:"
echo "  User 1: alice / password123"
echo "  User 2: bob / password123"
echo "  User 3: charlie / password123"
echo "  User 4: diana / password123"
echo "  User 5: eve / password123"
echo ""
echo "📚 Shared Books Matrix (for testing shared books feature):"
echo "  Alice's books: 1984, Great Gatsby, Harry Potter"
echo "  • Charlie shares 2 books with Alice (1984, Harry Potter)"
echo "  • Diana shares 2 books with Alice (Great Gatsby, Harry Potter)"
echo "  • Eve shares 1 book with Alice (Harry Potter)"
echo "  • Bob shares 1 book with Alice (1984)"
echo ""
echo "🎯 Try these commands:"
echo ""
echo "# Find users with shared books (as Alice)"
echo "curl -X GET '$BASE_URL/users/shared-books' \\"
echo "  -H 'Authorization: Bearer $TOKEN1'"
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
echo "# Get reviews for Harry Potter (most reviewed book)"
echo "curl -X GET '$BASE_URL/reviews/books/$BOOK4_ID' \\"
echo "  -H 'Authorization: Bearer $TOKEN1'"
echo ""
echo "📚 Happy reading!"
