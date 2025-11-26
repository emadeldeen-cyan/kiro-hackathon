#!/bin/bash

echo "Testing Login Flow"
echo "=================="

# Test registration
echo -e "\n1. Testing registration..."
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"flowtest","email":"flowtest@example.com","password":"password123"}')

echo "Registration response:"
echo "$REGISTER_RESPONSE" | jq .

# Extract token and user from registration
TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.token')
USER_ID=$(echo "$REGISTER_RESPONSE" | jq -r '.user.id')
USERNAME=$(echo "$REGISTER_RESPONSE" | jq -r '.user.username')
EMAIL=$(echo "$REGISTER_RESPONSE" | jq -r '.user.email')

echo -e "\nExtracted data:"
echo "  Token: ${TOKEN:0:20}..."
echo "  User ID: $USER_ID"
echo "  Username: $USERNAME"
echo "  Email: $EMAIL"

# Test login
echo -e "\n2. Testing login..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"flowtest","password":"password123"}')

echo "Login response:"
echo "$LOGIN_RESPONSE" | jq .

# Extract token and user from login
LOGIN_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')
LOGIN_USER_ID=$(echo "$LOGIN_RESPONSE" | jq -r '.user.id')
LOGIN_USERNAME=$(echo "$LOGIN_RESPONSE" | jq -r '.user.username')
LOGIN_EMAIL=$(echo "$LOGIN_RESPONSE" | jq -r '.user.email')

echo -e "\nExtracted data:"
echo "  Token: ${LOGIN_TOKEN:0:20}..."
echo "  User ID: $LOGIN_USER_ID"
echo "  Username: $LOGIN_USERNAME"
echo "  Email: $LOGIN_EMAIL"

# Verify structure
echo -e "\n3. Verifying response structure..."
if [ -n "$LOGIN_TOKEN" ] && [ "$LOGIN_TOKEN" != "null" ]; then
  echo "  ✓ Token present"
else
  echo "  ✗ Token missing"
fi

if [ -n "$LOGIN_USER_ID" ] && [ "$LOGIN_USER_ID" != "null" ]; then
  echo "  ✓ User ID present"
else
  echo "  ✗ User ID missing"
fi

if [ -n "$LOGIN_USERNAME" ] && [ "$LOGIN_USERNAME" != "null" ]; then
  echo "  ✓ Username present"
else
  echo "  ✗ Username missing"
fi

if [ -n "$LOGIN_EMAIL" ] && [ "$LOGIN_EMAIL" != "null" ]; then
  echo "  ✓ Email present"
else
  echo "  ✗ Email missing"
fi

# Test authenticated request
echo -e "\n4. Testing authenticated request..."
BOOKS_RESPONSE=$(curl -s -X GET "http://localhost:3000/api/books/search?q=" \
  -H "Authorization: Bearer $LOGIN_TOKEN")

echo "Books response:"
echo "$BOOKS_RESPONSE" | jq '. | length' 2>/dev/null || echo "$BOOKS_RESPONSE"

echo -e "\n✅ Login flow test complete!"
