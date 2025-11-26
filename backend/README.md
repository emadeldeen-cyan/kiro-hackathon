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

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Authentication (Coming Soon)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Profiles (Coming Soon)
- `POST /api/profiles` - Create profile
- `PUT /api/profiles/:userId` - Update profile
- `GET /api/profiles/:userId` - Get profile

### Books (Coming Soon)
- `GET /api/books/search/openlibrary` - Search OpenLibrary
- `POST /api/books/from-openlibrary` - Add book from OpenLibrary
- `GET /api/books/:bookId` - Get book details
- `GET /api/books/search` - Search local books

### Reviews (Coming Soon)
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:reviewId` - Update review
- `DELETE /api/reviews/:reviewId` - Delete review
- `GET /api/books/:bookId/reviews` - Get reviews for book
- `GET /api/users/:userId/reviews` - Get reviews by user

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
