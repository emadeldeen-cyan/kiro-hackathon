# Book Management System - Backend

Backend API for the Book Management System built with Node.js, Express, TypeScript, and PostgreSQL.

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. Ensure PostgreSQL is running and create the database:
```bash
createdb book_management
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

## Testing

Run all tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Project Structure

```
backend/
├── src/
│   ├── api/          # API routes and controllers
│   ├── models/       # Data models and types
│   ├── repositories/ # Data access layer
│   ├── services/     # Business logic layer
│   ├── utils/        # Utility functions and helpers
│   └── index.ts      # Application entry point
├── dist/             # Compiled JavaScript (generated)
├── package.json      # Dependencies and scripts
├── tsconfig.json     # TypeScript configuration
└── jest.config.js    # Jest testing configuration
```

## API Documentation

For complete API documentation including all endpoints, request/response formats, and examples, see:
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Complete API reference
- **[FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md)** - Frontend integration guide

### Quick Reference

**Health Check**
- `GET /health` - Server health status

**Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

**Profiles**
- `POST /api/profiles` - Create profile
- `PUT /api/profiles/:userId` - Update profile
- `GET /api/profiles/:userId` - Get profile

**Books**
- `GET /api/books/search/openlibrary` - Search OpenLibrary
- `POST /api/books/from-openlibrary` - Add book from OpenLibrary
- `GET /api/books/:bookId` - Get book details
- `GET /api/books/search` - Search local books

**Reviews**
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:reviewId` - Update review
- `DELETE /api/reviews/:reviewId` - Delete review
- `GET /api/reviews/books/:bookId` - Get reviews for book
- `GET /api/reviews/users/:userId` - Get reviews by user

## Frontend Integration

The backend is configured with CORS support for frontend applications. Key features:

- **CORS Enabled**: Supports requests from configured frontend URLs
- **JWT Authentication**: Token-based authentication for secure API access
- **Multiple Origins**: Supports multiple frontend URLs (development, staging, production)

To integrate with a frontend application:

1. Set `FRONTEND_URL` in `.env` to your frontend URL(s)
2. Include JWT token in `Authorization: Bearer <token>` header
3. See [FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md) for detailed integration examples

### Example Frontend Request

```javascript
const response = await fetch('http://localhost:3000/api/books/search?q=javascript', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
const data = await response.json();
```

## Database Schema

The application uses PostgreSQL with the following tables:
- `users` - User accounts
- `profiles` - User profiles
- `books` - Book catalog
- `reviews` - Book reviews

Tables are automatically created on first run.

## Testing Strategy

The project uses:
- **Jest** for unit and integration testing
- **fast-check** for property-based testing

Property-based tests verify universal properties across randomly generated inputs (minimum 100 iterations per test).
