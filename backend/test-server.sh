#!/bin/bash

echo "🧪 Testing Backend Server Startup"
echo "=================================="

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found, creating from .env.example..."
    cp .env.example .env
    echo "✅ .env file created"
fi

# Check if USE_IN_MEMORY is set
if grep -q "USE_IN_MEMORY=true" .env; then
    echo "✅ In-memory database is enabled"
else
    echo "⚠️  Setting USE_IN_MEMORY=true in .env..."
    echo "USE_IN_MEMORY=true" >> .env
fi

echo ""
echo "🚀 Starting server..."
echo "Press Ctrl+C to stop"
echo ""

npm run dev
