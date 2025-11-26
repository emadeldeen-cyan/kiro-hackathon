#!/bin/bash

echo "=========================================="
echo "API Endpoint Validation Test"
echo "=========================================="

BASE_URL="http://localhost:3000/api"
PASS=0
FAIL=0

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Helper function to check if response is valid JSON
check_json() {
  echo "$1" | jq . > /dev/null 2>&1
  return $?
}

# Helper function to check if field exists
check_field() {
  local response="$1"
  local field="$2"
  echo "$response" | jq -e "$field" > /dev/null 2>&1
  return $?
}

echo ""
echo "=========================================="
echo "1. AUTHENTICATION ENDPOINTS"
echo "=========================================="

# Test 1: Register
echo -e "\n${YELLOW}Test 1.1: POST /auth/register${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser1","email":"test1@example.com","password":"password123"}')

if check_json "$REGISTER_RESPONSE" && \
   check_field "$REGISTER_RESPONSE" ".token" && \
   check_field "$REGISTER_RESPONSE" ".user.id" && \
   check_field "$REGISTER_RESPONSE" ".user.username" && \
   check_field "$REGISTER_RESPONSE" ".user.email" && \
   ! check_field "$REGISTER_RESPONSE" ".message"; then
  echo -e "${GREEN}✓ PASS${NC} - Returns { token, user: { id, username, email } }"
  PASS=$((PASS + 1))
else
  echo -e "${RED}✗ FAIL${NC} - Incorrect structure"
  echo "$REGISTER_RESPONSE" | jq .
  FAIL=$((FAIL + 1))
fi

TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.token')
USER_ID=$(echo "$REGISTER_RESPONSE" | jq -r '.user.id')

# Test 2: Login
echo -e "\n${YELLOW}Test 1.2: POST /auth/login${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser1","password":"password123"}')

if check_json "$LOGIN_RESPONSE" && \
   check_field "$LOGIN_RESPONSE" ".token" && \
   check_field "$LOGIN_RESPONSE" ".user.id" && \
   ! check_field "$LOGIN_RESPONSE" ".message"; then
  echo -e "${GREEN}✓ PASS${NC} - Returns { token, user }"
  PASS=$((PASS + 1))
else
  echo -e "${RED}✗ FAIL${NC} - Incorrect structure"
  echo "$LOGIN_RESPONSE" | jq .
  FAIL=$((FAIL + 1))
fi

echo ""
echo "=========================================="
echo "2. BOOK ENDPOINTS"
echo "=========================================="

# Test 3: Search OpenLibrary
echo -e "\n${YELLOW}Test 2.1: GET /books/search/openlibrary?q=harry${NC}"
OL_SEARCH_RESPONSE=$(curl -s -X GET "$BASE_URL/books/search/openlibrary?q=harry" \
  -H "Authorization: Bearer $TOKEN")

if check_json "$OL_SEARCH_RESPONSE" && \
   echo "$OL_SEARCH_RESPONSE" | jq -e 'type == "array"' > /dev/null 2>&1; then
  echo -e "${GREEN}✓ PASS${NC} - Returns array directly"
  PASS=$((PASS + 1))
else
  echo -e "${RED}✗ FAIL${NC} - Should return array, not wrapped object"
  echo "$OL_SEARCH_RESPONSE" | jq . | head -20
  FAIL=$((FAIL + 1))
fi

# Test 4: Add book from OpenLibrary
echo -e "\n${YELLOW}Test 2.2: POST /books/from-openlibrary${NC}"
ADD_BOOK_RESPONSE=$(curl -s -X POST "$BASE_URL/books/from-openlibrary" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"openLibraryKey":"/works/OL1168007W"}')

if check_json "$ADD_BOOK_RESPONSE" && \
   check_field "$ADD_BOOK_RESPONSE" ".id" && \
   check_field "$ADD_BOOK_RESPONSE" ".title" && \
   ! check_field "$ADD_BOOK_RESPONSE" ".message"; then
  echo -e "${GREEN}✓ PASS${NC} - Returns book object directly"
  PASS=$((PASS + 1))
  BOOK_ID=$(echo "$ADD_BOOK_RESPONSE" | jq -r '.id')
else
  echo -e "${RED}✗ FAIL${NC} - Should return book object, not wrapped"
  echo "$ADD_BOOK_RESPONSE" | jq .
  FAIL=$((FAIL + 1))
  BOOK_ID="book_1"
fi

# Test 5: Search local books
echo -e "\n${YELLOW}Test 2.3: GET /books/search?q=${NC}"
LOCAL_SEARCH_RESPONSE=$(curl -s -X GET "$BASE_URL/books/search?q=" \
  -H "Authorization: Bearer $TOKEN")

if check_json "$LOCAL_SEARCH_RESPONSE" && \
   echo "$LOCAL_SEARCH_RESPONSE" | jq -e 'type == "array"' > /dev/null 2>&1; then
  echo -e "${GREEN}✓ PASS${NC} - Returns array directly"
  PASS=$((PASS + 1))
else
  echo -e "${RED}✗ FAIL${NC} - Should return array, not wrapped object"
  echo "$LOCAL_SEARCH_RESPONSE" | jq . | head -20
  FAIL=$((FAIL + 1))
fi

# Test 6: Get book by ID
echo -e "\n${YELLOW}Test 2.4: GET /books/:bookId${NC}"
GET_BOOK_RESPONSE=$(curl -s -X GET "$BASE_URL/books/$BOOK_ID" \
  -H "Authorization: Bearer $TOKEN")

if check_json "$GET_BOOK_RESPONSE" && \
   check_field "$GET_BOOK_RESPONSE" ".id" && \
   check_field "$GET_BOOK_RESPONSE" ".title" && \
   ! check_field "$GET_BOOK_RESPONSE" ".book"; then
  echo -e "${GREEN}✓ PASS${NC} - Returns book object directly"
  PASS=$((PASS + 1))
else
  echo -e "${RED}✗ FAIL${NC} - Should return book object, not wrapped"
  echo "$GET_BOOK_RESPONSE" | jq .
  FAIL=$((FAIL + 1))
fi

echo ""
echo "=========================================="
echo "3. PROFILE ENDPOINTS"
echo "=========================================="

# Test 7: Create profile
echo -e "\n${YELLOW}Test 3.1: POST /profiles${NC}"
CREATE_PROFILE_RESPONSE=$(curl -s -X POST "$BASE_URL/profiles" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"displayName":"Test User","bio":"Test bio"}')

if check_json "$CREATE_PROFILE_RESPONSE" && \
   check_field "$CREATE_PROFILE_RESPONSE" ".id" && \
   check_field "$CREATE_PROFILE_RESPONSE" ".displayName" && \
   ! check_field "$CREATE_PROFILE_RESPONSE" ".message"; then
  echo -e "${GREEN}✓ PASS${NC} - Returns profile object directly"
  PASS=$((PASS + 1))
else
  echo -e "${RED}✗ FAIL${NC} - Should return profile object, not wrapped"
  echo "$CREATE_PROFILE_RESPONSE" | jq .
  FAIL=$((FAIL + 1))
fi

# Test 8: Get profile
echo -e "\n${YELLOW}Test 3.2: GET /profiles/:userId${NC}"
GET_PROFILE_RESPONSE=$(curl -s -X GET "$BASE_URL/profiles/$USER_ID" \
  -H "Authorization: Bearer $TOKEN")

if check_json "$GET_PROFILE_RESPONSE" && \
   check_field "$GET_PROFILE_RESPONSE" ".id" && \
   check_field "$GET_PROFILE_RESPONSE" ".displayName" && \
   ! check_field "$GET_PROFILE_RESPONSE" ".profile"; then
  echo -e "${GREEN}✓ PASS${NC} - Returns profile object directly"
  PASS=$((PASS + 1))
else
  echo -e "${RED}✗ FAIL${NC} - Should return profile object, not wrapped"
  echo "$GET_PROFILE_RESPONSE" | jq .
  FAIL=$((FAIL + 1))
fi

# Test 9: Update profile
echo -e "\n${YELLOW}Test 3.3: PUT /profiles/:userId${NC}"
UPDATE_PROFILE_RESPONSE=$(curl -s -X PUT "$BASE_URL/profiles/$USER_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"displayName":"Updated Name"}')

if check_json "$UPDATE_PROFILE_RESPONSE" && \
   check_field "$UPDATE_PROFILE_RESPONSE" ".id" && \
   check_field "$UPDATE_PROFILE_RESPONSE" ".displayName" && \
   ! check_field "$UPDATE_PROFILE_RESPONSE" ".message"; then
  echo -e "${GREEN}✓ PASS${NC} - Returns profile object directly"
  PASS=$((PASS + 1))
else
  echo -e "${RED}✗ FAIL${NC} - Should return profile object, not wrapped"
  echo "$UPDATE_PROFILE_RESPONSE" | jq .
  FAIL=$((FAIL + 1))
fi

echo ""
echo "=========================================="
echo "4. REVIEW ENDPOINTS"
echo "=========================================="

# Test 10: Create review
echo -e "\n${YELLOW}Test 4.1: POST /reviews${NC}"
CREATE_REVIEW_RESPONSE=$(curl -s -X POST "$BASE_URL/reviews" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"bookId\":\"$BOOK_ID\",\"rating\":5,\"text\":\"Great book!\"}")

if check_json "$CREATE_REVIEW_RESPONSE" && \
   check_field "$CREATE_REVIEW_RESPONSE" ".id" && \
   check_field "$CREATE_REVIEW_RESPONSE" ".rating" && \
   ! check_field "$CREATE_REVIEW_RESPONSE" ".message"; then
  echo -e "${GREEN}✓ PASS${NC} - Returns review object directly"
  PASS=$((PASS + 1))
  REVIEW_ID=$(echo "$CREATE_REVIEW_RESPONSE" | jq -r '.id')
else
  echo -e "${RED}✗ FAIL${NC} - Should return review object, not wrapped"
  echo "$CREATE_REVIEW_RESPONSE" | jq .
  FAIL=$((FAIL + 1))
  REVIEW_ID="review_1"
fi

# Test 11: Get reviews by book
echo -e "\n${YELLOW}Test 4.2: GET /reviews/books/:bookId${NC}"
GET_BOOK_REVIEWS_RESPONSE=$(curl -s -X GET "$BASE_URL/reviews/books/$BOOK_ID" \
  -H "Authorization: Bearer $TOKEN")

if check_json "$GET_BOOK_REVIEWS_RESPONSE" && \
   echo "$GET_BOOK_REVIEWS_RESPONSE" | jq -e 'type == "array"' > /dev/null 2>&1; then
  echo -e "${GREEN}✓ PASS${NC} - Returns array directly"
  PASS=$((PASS + 1))
else
  echo -e "${RED}✗ FAIL${NC} - Should return array, not wrapped object"
  echo "$GET_BOOK_REVIEWS_RESPONSE" | jq .
  FAIL=$((FAIL + 1))
fi

# Test 12: Get reviews by user
echo -e "\n${YELLOW}Test 4.3: GET /reviews/users/:userId${NC}"
GET_USER_REVIEWS_RESPONSE=$(curl -s -X GET "$BASE_URL/reviews/users/$USER_ID" \
  -H "Authorization: Bearer $TOKEN")

if check_json "$GET_USER_REVIEWS_RESPONSE" && \
   echo "$GET_USER_REVIEWS_RESPONSE" | jq -e 'type == "array"' > /dev/null 2>&1; then
  echo -e "${GREEN}✓ PASS${NC} - Returns array directly"
  PASS=$((PASS + 1))
else
  echo -e "${RED}✗ FAIL${NC} - Should return array, not wrapped object"
  echo "$GET_USER_REVIEWS_RESPONSE" | jq .
  FAIL=$((FAIL + 1))
fi

# Test 13: Update review
echo -e "\n${YELLOW}Test 4.4: PUT /reviews/:reviewId${NC}"
UPDATE_REVIEW_RESPONSE=$(curl -s -X PUT "$BASE_URL/reviews/$REVIEW_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"rating":4,"text":"Updated review"}')

if check_json "$UPDATE_REVIEW_RESPONSE" && \
   check_field "$UPDATE_REVIEW_RESPONSE" ".id" && \
   check_field "$UPDATE_REVIEW_RESPONSE" ".rating" && \
   ! check_field "$UPDATE_REVIEW_RESPONSE" ".message"; then
  echo -e "${GREEN}✓ PASS${NC} - Returns review object directly"
  PASS=$((PASS + 1))
else
  echo -e "${RED}✗ FAIL${NC} - Should return review object, not wrapped"
  echo "$UPDATE_REVIEW_RESPONSE" | jq .
  FAIL=$((FAIL + 1))
fi

# Test 14: Delete review
echo -e "\n${YELLOW}Test 4.5: DELETE /reviews/:reviewId${NC}"
DELETE_REVIEW_RESPONSE=$(curl -s -X DELETE "$BASE_URL/reviews/$REVIEW_ID" \
  -H "Authorization: Bearer $TOKEN")

if check_json "$DELETE_REVIEW_RESPONSE"; then
  echo -e "${GREEN}✓ PASS${NC} - Returns valid JSON response"
  PASS=$((PASS + 1))
else
  echo -e "${RED}✗ FAIL${NC} - Invalid response"
  echo "$DELETE_REVIEW_RESPONSE"
  FAIL=$((FAIL + 1))
fi

echo ""
echo "=========================================="
echo "SUMMARY"
echo "=========================================="
echo -e "${GREEN}Passed: $PASS${NC}"
echo -e "${RED}Failed: $FAIL${NC}"
echo "Total: $((PASS + FAIL))"
echo ""

if [ $FAIL -eq 0 ]; then
  echo -e "${GREEN}✓ All tests passed!${NC}"
  exit 0
else
  echo -e "${RED}✗ Some tests failed${NC}"
  exit 1
fi
