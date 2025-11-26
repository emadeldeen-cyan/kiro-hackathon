#!/bin/bash

# Test script to demonstrate the shared books feature with populated data
# Run populate_db.sh first to set up the test data

BASE_URL="http://localhost:3000/api"

echo "=== Testing Shared Books Feature with Populated Data ==="
echo ""

# Check if server is running
if ! curl -s http://localhost:3000/health > /dev/null; then
    echo "❌ Server is not running!"
    echo "Please start the server with: npm run dev"
    exit 1
fi

echo "✅ Server is running"
echo ""

# Login as Alice
echo "1. Logging in as Alice..."
LOGIN=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "alice", "password": "password123"}')

TOKEN=$(echo $LOGIN | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo "❌ Failed to login. Make sure you've run populate_db.sh first!"
    exit 1
fi

echo "✅ Logged in successfully"
echo ""

# Get Alice's reviews to show what books she has
echo "2. Alice's reviewed books:"
ALICE_REVIEWS=$(curl -s -X GET "$BASE_URL/reviews/users/user_1" \
  -H "Authorization: Bearer $TOKEN")
echo "$ALICE_REVIEWS" | python3 -c "import sys, json; reviews = json.load(sys.stdin)['reviews']; [print(f\"   • {r['book']['title']}\") for r in reviews]" 2>/dev/null
echo ""

# Find users with shared books
echo "3. Finding users who share books with Alice..."
SHARED=$(curl -s -X GET "$BASE_URL/users/shared-books" \
  -H "Authorization: Bearer $TOKEN")

echo ""
echo "Results (sorted by shared book count, then alphabetically):"
echo "$SHARED" | python3 -m json.tool 2>/dev/null || echo "$SHARED"
echo ""

# Parse and display in a friendly format
echo "Summary:"
echo "$SHARED" | python3 -c "
import sys, json
try:
    users = json.load(sys.stdin)
    if not users:
        print('   No users found with shared books')
    else:
        for i, user in enumerate(users, 1):
            print(f\"   {i}. {user['username']} - {user['sharedBookCount']} shared book(s)\")
except:
    print('   Error parsing response')
" 2>/dev/null
echo ""

echo "=== Test Complete ==="
echo ""
echo "Expected results:"
echo "  • Charlie and Diana should be tied with 2 shared books each"
echo "  • Since they're tied, they're sorted alphabetically (Charlie before Diana)"
echo "  • Bob and Eve should each have 1 shared book"
echo "  • Bob comes before Eve alphabetically"
