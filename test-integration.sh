#!/bin/bash

# Integration Test Script for Book Management System
# Tests all major API endpoints and frontend-backend integration

set -e

BASE_URL="http://localhost:3000/api"
FRONTEND_URL="http://localhost:4200"

echo "========================================="
echo "Book Management System Integration Tests"
echo "========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Helper function to print test results
test_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ PASS${NC}: $2"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC}: $2"
        ((TESTS_FAILED++))
    fi
}

echo "1. Testing Backend Health Check..."
HEALTH=$(curl -s ${BASE_URL%/api}/health)
if echo "$HEALTH" | grep -q "ok"; then
    test_result 0 "Backend health check"
else
    test_result 1 "Backend health check"
fi
echo ""

echo "2. Testing User Registration..."
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"integrationtest","email":"integration@test.com","password":"password123"}')

if echo "$REGISTER_RESPONSE" | grep -q "token"; then
    test_result 0 "User registration"
    TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
else
    test_result 1 "User registration"
    echo "Response: $REGISTER_RESPONSE"
    exit 1
fi
echo ""

echo "3. Testing Duplicate Username Rejection..."
DUPLICATE_RESPONSE=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"integrationtest","email":"different@test.com","password":"password123"}')

if echo "$DUPLICATE_RESPONSE" | grep -q "already exists"; then
    test_result 0 "Duplicate username rejection"
else
    test_result 1 "Duplicate username rejection"
fi
echo ""

echo "4. Testing User Login..."
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"integrationtest","password":"password123"}')

if echo "$LOGIN_RESPONSE" | grep -q "token"; then
    test_result 0 "User login"
else
    test_result 1 "User login"
fi
echo ""

echo "5. Testing Profile Creation..."
PROFILE_RESPONSE=$(curl -s -X POST $BASE_URL/profiles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"displayName":"Integration Test User","bio":"Testing the system"}')

if echo "$PROFILE_RESPONSE" | grep -q "Profile created successfully"; then
    test_result 0 "Profile creation"
else
    test_result 1 "Profile creation"
fi
echo ""

echo "6. Testing OpenLibrary Search..."
SEARCH_RESPONSE=$(curl -s "$BASE_URL/books/search/openlibrary?q=harry+potter" \
  -H "Authorization: Bearer $TOKEN")

if echo "$SEARCH_RESPONSE" | grep -q "results"; then
    test_result 0 "OpenLibrary search"
else
    test_result 1 "OpenLibrary search"
fi
echo ""

echo "7. Testing Add Book from OpenLibrary..."
BOOK_RESPONSE=$(curl -s -X POST $BASE_URL/books/from-openlibrary \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"openLibraryKey":"/works/OL1168083W"}')

if echo "$BOOK_RESPONSE" | grep -q "Book added successfully"; then
    test_result 0 "Add book from OpenLibrary"
    BOOK_ID=$(echo "$BOOK_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
else
    test_result 1 "Add book from OpenLibrary"
    echo "Response: $BOOK_RESPONSE"
fi
echo ""

echo "8. Testing Duplicate Book Prevention..."
DUPLICATE_BOOK=$(curl -s -X POST $BASE_URL/books/from-openlibrary \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"openLibraryKey":"/works/OL1168083W"}')

if echo "$DUPLICATE_BOOK" | grep -q "Book added successfully"; then
    test_result 0 "Duplicate book returns existing book"
else
    test_result 1 "Duplicate book prevention"
fi
echo ""

echo "9. Testing Local Book Search..."
LOCAL_SEARCH=$(curl -s "$BASE_URL/books/search?q=Nineteen" \
  -H "Authorization: Bearer $TOKEN")

if echo "$LOCAL_SEARCH" | grep -q "Nineteen Eighty-Four"; then
    test_result 0 "Local book search"
else
    test_result 1 "Local book search"
fi
echo ""

echo "10. Testing Review Creation..."
REVIEW_RESPONSE=$(curl -s -X POST $BASE_URL/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"bookId\":\"$BOOK_ID\",\"rating\":5,\"text\":\"Excellent book!\"}")

if echo "$REVIEW_RESPONSE" | grep -q "Review created successfully"; then
    test_result 0 "Review creation"
    REVIEW_ID=$(echo "$REVIEW_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
else
    test_result 1 "Review creation"
fi
echo ""

echo "11. Testing Duplicate Review Prevention..."
DUPLICATE_REVIEW=$(curl -s -X POST $BASE_URL/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"bookId\":\"$BOOK_ID\",\"rating\":4,\"text\":\"Another review\"}")

if echo "$DUPLICATE_REVIEW" | grep -q "already reviewed"; then
    test_result 0 "Duplicate review prevention"
else
    test_result 1 "Duplicate review prevention"
fi
echo ""

echo "12. Testing Get Reviews for Book..."
BOOK_REVIEWS=$(curl -s "$BASE_URL/reviews/books/$BOOK_ID" \
  -H "Authorization: Bearer $TOKEN")

if echo "$BOOK_REVIEWS" | grep -q "reviews"; then
    test_result 0 "Get reviews for book"
else
    test_result 1 "Get reviews for book"
fi
echo ""

echo "13. Testing Review Update..."
UPDATE_REVIEW=$(curl -s -X PUT "$BASE_URL/reviews/$REVIEW_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"rating":4,"text":"Updated review text"}')

if echo "$UPDATE_REVIEW" | grep -q "Review updated successfully"; then
    test_result 0 "Review update"
else
    test_result 1 "Review update"
fi
echo ""

echo "14. Testing Frontend Accessibility..."
FRONTEND_CHECK=$(curl -s -o /dev/null -w "%{http_code}" $FRONTEND_URL)

if [ "$FRONTEND_CHECK" = "200" ]; then
    test_result 0 "Frontend is accessible"
else
    test_result 1 "Frontend is accessible (HTTP $FRONTEND_CHECK)"
fi
echo ""

echo "========================================="
echo "Test Summary"
echo "========================================="
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}All tests passed! ✓${NC}"
    exit 0
else
    echo -e "${RED}Some tests failed. Please review the output above.${NC}"
    exit 1
fi
