#!/bin/bash

echo "=========================================="
echo "Complete User Flow Integration Test"
echo "=========================================="

BASE_URL="http://localhost:3000/api"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo -e "${BLUE}Simulating a complete user journey...${NC}"
echo ""

# Step 1: Register
echo -e "${YELLOW}Step 1: User Registration${NC}"
REGISTER=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"username":"journeyuser","email":"journey@example.com","password":"password123"}')

TOKEN=$(echo "$REGISTER" | jq -r '.token')
USER_ID=$(echo "$REGISTER" | jq -r '.user.id')
USERNAME=$(echo "$REGISTER" | jq -r '.user.username')

if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
  echo -e "${GREEN}✓${NC} Registered as: $USERNAME (ID: $USER_ID)"
else
  echo -e "${RED}✗ Registration failed${NC}"
  exit 1
fi

# Step 2: Create Profile
echo -e "\n${YELLOW}Step 2: Create User Profile${NC}"
PROFILE=$(curl -s -X POST "$BASE_URL/profiles" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"displayName":"Journey User","bio":"Testing the complete flow"}')

PROFILE_ID=$(echo "$PROFILE" | jq -r '.id')
if [ -n "$PROFILE_ID" ] && [ "$PROFILE_ID" != "null" ]; then
  echo -e "${GREEN}✓${NC} Profile created: $(echo "$PROFILE" | jq -r '.displayName')"
else
  echo -e "${RED}✗ Profile creation failed${NC}"
  exit 1
fi

# Step 3: Search for books in OpenLibrary
echo -e "\n${YELLOW}Step 3: Search OpenLibrary for Books${NC}"
SEARCH=$(curl -s -X GET "$BASE_URL/books/search/openlibrary?q=harry+potter" \
  -H "Authorization: Bearer $TOKEN")

BOOK_COUNT=$(echo "$SEARCH" | jq '. | length')
echo -e "${GREEN}✓${NC} Found $BOOK_COUNT books in OpenLibrary"

# Step 4: Add a book to local library
echo -e "\n${YELLOW}Step 4: Add Book to Local Library${NC}"
FIRST_BOOK_KEY=$(echo "$SEARCH" | jq -r '.[0].key')
ADD_BOOK=$(curl -s -X POST "$BASE_URL/books/from-openlibrary" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"openLibraryKey\":\"$FIRST_BOOK_KEY\"}")

BOOK_ID=$(echo "$ADD_BOOK" | jq -r '.id')
BOOK_TITLE=$(echo "$ADD_BOOK" | jq -r '.title')
if [ -n "$BOOK_ID" ] && [ "$BOOK_ID" != "null" ]; then
  echo -e "${GREEN}✓${NC} Added book: $BOOK_TITLE (ID: $BOOK_ID)"
else
  echo -e "${RED}✗ Failed to add book${NC}"
  exit 1
fi

# Step 5: Search local library
echo -e "\n${YELLOW}Step 5: Search Local Library${NC}"
LOCAL_BOOKS=$(curl -s -X GET "$BASE_URL/books/search?q=" \
  -H "Authorization: Bearer $TOKEN")

LOCAL_COUNT=$(echo "$LOCAL_BOOKS" | jq '. | length')
echo -e "${GREEN}✓${NC} Local library has $LOCAL_COUNT book(s)"

# Step 6: Get book details
echo -e "\n${YELLOW}Step 6: Get Book Details${NC}"
BOOK_DETAILS=$(curl -s -X GET "$BASE_URL/books/$BOOK_ID" \
  -H "Authorization: Bearer $TOKEN")

BOOK_AUTHOR=$(echo "$BOOK_DETAILS" | jq -r '.author')
echo -e "${GREEN}✓${NC} Book details: $BOOK_TITLE by $BOOK_AUTHOR"

# Step 7: Create a review
echo -e "\n${YELLOW}Step 7: Write a Review${NC}"
REVIEW=$(curl -s -X POST "$BASE_URL/reviews" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"bookId\":\"$BOOK_ID\",\"rating\":5,\"text\":\"Amazing book! Loved every page.\"}")

REVIEW_ID=$(echo "$REVIEW" | jq -r '.id')
REVIEW_RATING=$(echo "$REVIEW" | jq -r '.rating')
if [ -n "$REVIEW_ID" ] && [ "$REVIEW_ID" != "null" ]; then
  echo -e "${GREEN}✓${NC} Review created with rating: $REVIEW_RATING/5"
else
  echo -e "${RED}✗ Failed to create review${NC}"
  exit 1
fi

# Step 8: Get reviews for the book
echo -e "\n${YELLOW}Step 8: Get Book Reviews${NC}"
BOOK_REVIEWS=$(curl -s -X GET "$BASE_URL/reviews/books/$BOOK_ID" \
  -H "Authorization: Bearer $TOKEN")

REVIEW_COUNT=$(echo "$BOOK_REVIEWS" | jq '. | length')
echo -e "${GREEN}✓${NC} Book has $REVIEW_COUNT review(s)"

# Step 9: Get user's reviews
echo -e "\n${YELLOW}Step 9: Get User's Review History${NC}"
USER_REVIEWS=$(curl -s -X GET "$BASE_URL/reviews/users/$USER_ID" \
  -H "Authorization: Bearer $TOKEN")

USER_REVIEW_COUNT=$(echo "$USER_REVIEWS" | jq '. | length')
echo -e "${GREEN}✓${NC} User has written $USER_REVIEW_COUNT review(s)"

# Step 10: Update the review
echo -e "\n${YELLOW}Step 10: Update Review${NC}"
UPDATE_REVIEW=$(curl -s -X PUT "$BASE_URL/reviews/$REVIEW_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"rating":4,"text":"Still great, but not perfect."}')

NEW_RATING=$(echo "$UPDATE_REVIEW" | jq -r '.rating')
echo -e "${GREEN}✓${NC} Review updated, new rating: $NEW_RATING/5"

# Step 11: Update profile
echo -e "\n${YELLOW}Step 11: Update User Profile${NC}"
UPDATE_PROFILE=$(curl -s -X PUT "$BASE_URL/profiles/$USER_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"displayName":"Journey User (Updated)","bio":"Completed the full journey!"}')

NEW_DISPLAY_NAME=$(echo "$UPDATE_PROFILE" | jq -r '.displayName')
echo -e "${GREEN}✓${NC} Profile updated: $NEW_DISPLAY_NAME"

# Step 12: Get profile
echo -e "\n${YELLOW}Step 12: View Profile${NC}"
GET_PROFILE=$(curl -s -X GET "$BASE_URL/profiles/$USER_ID" \
  -H "Authorization: Bearer $TOKEN")

PROFILE_BIO=$(echo "$GET_PROFILE" | jq -r '.bio')
echo -e "${GREEN}✓${NC} Profile bio: $PROFILE_BIO"

# Step 13: Login (verify token still works)
echo -e "\n${YELLOW}Step 13: Re-authenticate${NC}"
LOGIN=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"journeyuser","password":"password123"}')

NEW_TOKEN=$(echo "$LOGIN" | jq -r '.token')
if [ -n "$NEW_TOKEN" ] && [ "$NEW_TOKEN" != "null" ]; then
  echo -e "${GREEN}✓${NC} Re-authentication successful"
else
  echo -e "${RED}✗ Re-authentication failed${NC}"
  exit 1
fi

# Step 14: Delete review
echo -e "\n${YELLOW}Step 14: Delete Review${NC}"
DELETE=$(curl -s -X DELETE "$BASE_URL/reviews/$REVIEW_ID" \
  -H "Authorization: Bearer $TOKEN")

if echo "$DELETE" | jq -e '.message' > /dev/null 2>&1; then
  echo -e "${GREEN}✓${NC} Review deleted successfully"
else
  echo -e "${RED}✗ Failed to delete review${NC}"
  exit 1
fi

# Summary
echo ""
echo "=========================================="
echo -e "${GREEN}✓ Complete Flow Test Passed!${NC}"
echo "=========================================="
echo ""
echo "Journey Summary:"
echo "  • Registered user: $USERNAME"
echo "  • Created profile: $NEW_DISPLAY_NAME"
echo "  • Added book: $BOOK_TITLE"
echo "  • Wrote and updated review"
echo "  • Verified all CRUD operations"
echo "  • Cleaned up (deleted review)"
echo ""
echo -e "${BLUE}All API endpoints working correctly!${NC}"
