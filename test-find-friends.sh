#!/bin/bash

# Test script for Find Friends feature
# This script tests the backend API endpoint for finding users with shared books

echo "=========================================="
echo "Testing Find Friends Feature"
echo "=========================================="
echo ""

# Configuration
API_URL="http://localhost:3000/api"
TEST_USER="testuser"
TEST_PASSWORD="password123"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Step 1: Login
echo "Step 1: Logging in as $TEST_USER..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$TEST_USER\",\"password\":\"$TEST_PASSWORD\"}")

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    print_error "Login failed"
    echo "Response: $LOGIN_RESPONSE"
    exit 1
fi

print_success "Login successful"
echo ""

# Step 2: Find users with shared books
echo "Step 2: Finding users with shared books..."
SHARED_BOOKS_RESPONSE=$(curl -s -X GET "$API_URL/users/shared-books" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

# Check if response is valid JSON
if echo "$SHARED_BOOKS_RESPONSE" | jq empty 2>/dev/null; then
    print_success "API call successful"
    
    # Count users found
    USER_COUNT=$(echo "$SHARED_BOOKS_RESPONSE" | jq 'length')
    print_info "Found $USER_COUNT users with shared books"
    
    # Display results
    echo ""
    echo "Users with shared books:"
    echo "$SHARED_BOOKS_RESPONSE" | jq -r '.[] | "  - \(.username) (\(.displayName // "No display name")): \(.sharedBooksCount) shared books"'
    
    echo ""
    echo "Detailed results:"
    echo "$SHARED_BOOKS_RESPONSE" | jq '.'
else
    print_error "Invalid response from API"
    echo "Response: $SHARED_BOOKS_RESPONSE"
    exit 1
fi

echo ""
echo "=========================================="
echo "Test completed successfully!"
echo "=========================================="
