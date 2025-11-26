#!/bin/bash

echo "=========================================="
echo "Profile & Reviews Pages Test"
echo "=========================================="

BASE_URL="http://localhost:3000/api"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Register a test user
echo -e "\n${YELLOW}1. Registering test user...${NC}"
REGISTER=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"username":"profiletest","email":"profiletest@example.com","password":"password123"}')

TOKEN=$(echo "$REGISTER" | jq -r '.token')
USER_ID=$(echo "$REGISTER" | jq -r '.user.id')

if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
  echo -e "${GREEN}✓${NC} User registered: $USER_ID"
else
  echo -e "${RED}✗${NC} Registration failed"
  exit 1
fi

# Test: Get profile (should return 404 for new user)
echo -e "\n${YELLOW}2. Checking if profile exists...${NC}"
PROFILE_CHECK=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/profiles/$USER_ID" \
  -H "Authorization: Bearer $TOKEN")

HTTP_CODE=$(echo "$PROFILE_CHECK" | tail -n1)
if [ "$HTTP_CODE" = "404" ]; then
  echo -e "${GREEN}✓${NC} No profile exists yet (expected for new user)"
elif [ "$HTTP_CODE" = "200" ]; then
  echo -e "${YELLOW}⚠${NC} Profile already exists"
else
  echo -e "${RED}✗${NC} Unexpected response: $HTTP_CODE"
fi

# Create profile
echo -e "\n${YELLOW}3. Creating profile...${NC}"
CREATE_PROFILE=$(curl -s -X POST "$BASE_URL/profiles" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"displayName":"Profile Test User","bio":"Testing profile functionality"}')

PROFILE_ID=$(echo "$CREATE_PROFILE" | jq -r '.id')
if [ -n "$PROFILE_ID" ] && [ "$PROFILE_ID" != "null" ]; then
  echo -e "${GREEN}✓${NC} Profile created: $PROFILE_ID"
else
  echo -e "${RED}✗${NC} Profile creation failed"
  echo "$CREATE_PROFILE" | jq .
  exit 1
fi

# Get profile
echo -e "\n${YELLOW}4. Fetching profile...${NC}"
GET_PROFILE=$(curl -s -X GET "$BASE_URL/profiles/$USER_ID" \
  -H "Authorization: Bearer $TOKEN")

DISPLAY_NAME=$(echo "$GET_PROFILE" | jq -r '.displayName')
if [ "$DISPLAY_NAME" = "Profile Test User" ]; then
  echo -e "${GREEN}✓${NC} Profile retrieved: $DISPLAY_NAME"
else
  echo -e "${RED}✗${NC} Failed to retrieve profile"
  exit 1
fi

# Update profile
echo -e "\n${YELLOW}5. Updating profile...${NC}"
UPDATE_PROFILE=$(curl -s -X PUT "$BASE_URL/profiles/$USER_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"displayName":"Updated Profile Name","bio":"Updated bio"}')

NEW_NAME=$(echo "$UPDATE_PROFILE" | jq -r '.displayName')
if [ "$NEW_NAME" = "Updated Profile Name" ]; then
  echo -e "${GREEN}✓${NC} Profile updated: $NEW_NAME"
else
  echo -e "${RED}✗${NC} Failed to update profile"
  exit 1
fi

# Add a book for reviews
echo -e "\n${YELLOW}6. Adding a book...${NC}"
ADD_BOOK=$(curl -s -X POST "$BASE_URL/books/from-openlibrary" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"openLibraryKey":"/works/OL45804W"}')

BOOK_ID=$(echo "$ADD_BOOK" | jq -r '.id')
BOOK_TITLE=$(echo "$ADD_BOOK" | jq -r '.title')
if [ -n "$BOOK_ID" ] && [ "$BOOK_ID" != "null" ]; then
  echo -e "${GREEN}✓${NC} Book added: $BOOK_TITLE"
else
  echo -e "${RED}✗${NC} Failed to add book"
  exit 1
fi

# Check reviews (should be empty)
echo -e "\n${YELLOW}7. Checking user reviews (should be empty)...${NC}"
GET_REVIEWS=$(curl -s -X GET "$BASE_URL/reviews/users/$USER_ID" \
  -H "Authorization: Bearer $TOKEN")

REVIEW_COUNT=$(echo "$GET_REVIEWS" | jq '. | length')
if [ "$REVIEW_COUNT" = "0" ]; then
  echo -e "${GREEN}✓${NC} No reviews yet (expected)"
else
  echo -e "${YELLOW}⚠${NC} Found $REVIEW_COUNT reviews"
fi

# Create a review
echo -e "\n${YELLOW}8. Creating a review...${NC}"
CREATE_REVIEW=$(curl -s -X POST "$BASE_URL/reviews" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"bookId\":\"$BOOK_ID\",\"rating\":5,\"text\":\"Excellent book!\"}")

REVIEW_ID=$(echo "$CREATE_REVIEW" | jq -r '.id')
if [ -n "$REVIEW_ID" ] && [ "$REVIEW_ID" != "null" ]; then
  echo -e "${GREEN}✓${NC} Review created: $REVIEW_ID"
else
  echo -e "${RED}✗${NC} Failed to create review"
  echo "$CREATE_REVIEW" | jq .
  exit 1
fi

# Get user reviews (should have 1)
echo -e "\n${YELLOW}9. Fetching user reviews...${NC}"
GET_REVIEWS=$(curl -s -X GET "$BASE_URL/reviews/users/$USER_ID" \
  -H "Authorization: Bearer $TOKEN")

REVIEW_COUNT=$(echo "$GET_REVIEWS" | jq '. | length')
if [ "$REVIEW_COUNT" = "1" ]; then
  echo -e "${GREEN}✓${NC} Found 1 review"
  REVIEW_TEXT=$(echo "$GET_REVIEWS" | jq -r '.[0].text')
  REVIEW_BOOK_TITLE=$(echo "$GET_REVIEWS" | jq -r '.[0].book.title')
  echo "  Review: \"$REVIEW_TEXT\""
  echo "  Book: $REVIEW_BOOK_TITLE"
else
  echo -e "${RED}✗${NC} Expected 1 review, found $REVIEW_COUNT"
  exit 1
fi

echo ""
echo "=========================================="
echo -e "${GREEN}✓ All Profile & Reviews Tests Passed!${NC}"
echo "=========================================="
echo ""
echo "Summary:"
echo "  • User ID: $USER_ID"
echo "  • Profile: $NEW_NAME"
echo "  • Reviews: $REVIEW_COUNT"
echo ""
echo "You can now:"
echo "  1. Login with: profiletest / password123"
echo "  2. Navigate to 'My Profile' to see/edit profile"
echo "  3. Navigate to 'My Reviews' to see reviews"
