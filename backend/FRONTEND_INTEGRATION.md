# Frontend Integration Guide

## Overview

This guide provides instructions for integrating a frontend application with the Book Management API.

## Prerequisites

- Node.js 16+ installed
- Backend server running (default: `http://localhost:3000`)
- Frontend application (Angular, React, Vue, etc.)

## Configuration

### Environment Variables

Create a `.env` file in the backend directory based on `.env.example`:

```bash
cp .env.example .env
```

Key configuration variables:

- **PORT**: Backend server port (default: 3000)
- **FRONTEND_URL**: Comma-separated list of allowed frontend URLs
  - Development: `http://localhost:4200`
  - Multiple origins: `http://localhost:4200,http://localhost:4201`
  - Production: `https://yourdomain.com`
- **JWT_SECRET**: Secret key for JWT token generation (change in production!)
- **JWT_EXPIRES_IN**: Token expiration time (default: 24h)

### CORS Configuration

The backend is configured to accept requests from origins specified in the `FRONTEND_URL` environment variable. The CORS configuration includes:

- **Credentials**: Enabled (allows cookies and authorization headers)
- **Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Allowed Headers**: Content-Type, Authorization
- **Exposed Headers**: Content-Length, X-Request-Id
- **Max Age**: 24 hours (preflight cache)

## API Base URL

Development: `http://localhost:3000/api`
Production: Update based on your deployment

## Authentication Flow

### 1. User Registration

**Endpoint**: `POST /api/auth/register`

```javascript
const response = await fetch('http://localhost:3000/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'johndoe',
    email: 'john@example.com',
    password: 'securepassword123'
  })
});

const data = await response.json();
// Store token: localStorage.setItem('token', data.token);
```

### 2. User Login

**Endpoint**: `POST /api/auth/login`

```javascript
const response = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'johndoe',
    password: 'securepassword123'
  })
});

const data = await response.json();
// Store token and userId
localStorage.setItem('token', data.token);
localStorage.setItem('userId', data.userId);
```

### 3. Making Authenticated Requests

Include the JWT token in the Authorization header for all protected endpoints:

```javascript
const token = localStorage.getItem('token');

const response = await fetch('http://localhost:3000/api/profiles', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    displayName: 'John Doe',
    bio: 'Book enthusiast',
    avatarUrl: 'https://example.com/avatar.jpg'
  })
});
```

## Common Integration Patterns

### HTTP Client Setup (Angular)

```typescript
// auth.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = localStorage.getItem('token');
    
    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(cloned);
    }
    
    return next.handle(req);
  }
}

// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

### HTTP Client Setup (React)

```javascript
// api.js
const API_BASE_URL = 'http://localhost:3000/api';

export const apiClient = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
    };
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Request failed');
    }
    
    return response.json();
  },
  
  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  },
  
  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  },
};
```

### HTTP Client Setup (Vue)

```javascript
// api.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

## Error Handling

All API errors follow a consistent format:

```json
{
  "error": "Error Type",
  "message": "Detailed error message",
  "statusCode": 400
}
```

### Common Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request (validation error)
- **401**: Unauthorized (missing or invalid token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **409**: Conflict (duplicate resource)
- **500**: Internal Server Error
- **503**: Service Unavailable (external API error)

### Error Handling Example

```javascript
try {
  const response = await apiClient.post('/reviews', {
    bookId: '123',
    rating: 5,
    text: 'Great book!'
  });
  console.log('Review created:', response);
} catch (error) {
  if (error.response) {
    // Server responded with error
    switch (error.response.status) {
      case 400:
        console.error('Validation error:', error.response.data.message);
        break;
      case 401:
        console.error('Please log in');
        // Redirect to login
        break;
      case 409:
        console.error('You already reviewed this book');
        break;
      default:
        console.error('Error:', error.response.data.message);
    }
  } else {
    // Network error
    console.error('Network error:', error.message);
  }
}
```

## Key Features Integration

### 1. Book Search

```javascript
// Search OpenLibrary
const searchOpenLibrary = async (query) => {
  const response = await apiClient.get(`/books/search/openlibrary?q=${encodeURIComponent(query)}`);
  return response.results;
};

// Search local books
const searchLocalBooks = async (query = '') => {
  const endpoint = query 
    ? `/books/search?q=${encodeURIComponent(query)}`
    : '/books/search';
  const response = await apiClient.get(endpoint);
  return response.results;
};
```

### 2. Add Book from OpenLibrary

```javascript
const addBook = async (openLibraryKey) => {
  const response = await apiClient.post('/books/from-openlibrary', {
    openLibraryKey
  });
  return response.book;
};
```

### 3. Review Management

```javascript
// Create review
const createReview = async (bookId, rating, text) => {
  const response = await apiClient.post('/reviews', {
    bookId,
    rating,
    text
  });
  return response.review;
};

// Update review
const updateReview = async (reviewId, updates) => {
  const response = await apiClient.put(`/reviews/${reviewId}`, updates);
  return response.review;
};

// Delete review
const deleteReview = async (reviewId) => {
  await apiClient.delete(`/reviews/${reviewId}`);
};

// Get reviews for a book
const getBookReviews = async (bookId) => {
  const response = await apiClient.get(`/reviews/books/${bookId}`);
  return response.reviews;
};

// Get user's reviews
const getUserReviews = async (userId) => {
  const response = await apiClient.get(`/reviews/users/${userId}`);
  return response.reviews;
};
```

### 4. Profile Management

```javascript
// Create profile
const createProfile = async (displayName, bio, avatarUrl) => {
  const response = await apiClient.post('/profiles', {
    displayName,
    bio,
    avatarUrl
  });
  return response.profile;
};

// Update profile
const updateProfile = async (userId, updates) => {
  const response = await apiClient.put(`/profiles/${userId}`, updates);
  return response.profile;
};

// Get profile
const getProfile = async (userId) => {
  const response = await apiClient.get(`/profiles/${userId}`);
  return response.profile;
};
```

## Development Workflow

### 1. Start Backend Server

```bash
cd backend
npm install
npm run dev
```

The server will start on `http://localhost:3000`

### 2. Configure Frontend

Update your frontend environment configuration to point to the backend API:

```javascript
// Angular: src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};

// React: .env.local
REACT_APP_API_URL=http://localhost:3000/api

// Vue: .env.local
VUE_APP_API_URL=http://localhost:3000/api
```

### 3. Test API Connection

Create a simple health check in your frontend:

```javascript
const checkApiHealth = async () => {
  try {
    const response = await fetch('http://localhost:3000/health');
    const data = await response.json();
    console.log('API Status:', data.status);
  } catch (error) {
    console.error('API is not reachable:', error);
  }
};
```

## Security Best Practices

### 1. Token Storage

- Store JWT tokens in `localStorage` or `sessionStorage`
- Clear tokens on logout
- Implement token refresh mechanism for long sessions

```javascript
// Logout
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  // Redirect to login page
};
```

### 2. Token Expiration Handling

```javascript
// Check if token is expired (decode JWT)
const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

// Refresh token or logout if expired
if (isTokenExpired(token)) {
  logout();
}
```

### 3. HTTPS in Production

Always use HTTPS in production to protect tokens and sensitive data in transit.

## Troubleshooting

### CORS Errors

If you encounter CORS errors:

1. Verify `FRONTEND_URL` in backend `.env` matches your frontend URL
2. Ensure the backend server is running
3. Check browser console for specific CORS error messages
4. For multiple frontend URLs, use comma-separated values: `http://localhost:4200,http://localhost:4201`

### 401 Unauthorized Errors

1. Verify token is being sent in Authorization header
2. Check token format: `Bearer <token>`
3. Ensure token hasn't expired
4. Verify JWT_SECRET matches between environments

### Network Errors

1. Confirm backend server is running on correct port
2. Check firewall settings
3. Verify API base URL in frontend configuration
4. Test with curl or Postman to isolate frontend issues

## Testing with Postman/Curl

### Register User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

### Authenticated Request

```bash
curl -X GET http://localhost:3000/api/profiles/USER_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Production Deployment

### Environment Variables

Update production environment variables:

```bash
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
JWT_SECRET=<strong-random-secret>
DB_HOST=<production-db-host>
# ... other production configs
```

### CORS Configuration

Ensure `FRONTEND_URL` is set to your production frontend domain(s).

### Security Checklist

- [ ] Use strong JWT_SECRET (minimum 32 characters)
- [ ] Enable HTTPS
- [ ] Set secure cookie flags if using cookies
- [ ] Implement rate limiting
- [ ] Enable request logging
- [ ] Set up monitoring and alerts
- [ ] Configure proper database credentials
- [ ] Review and restrict CORS origins

## Additional Resources

- [API Documentation](./API_DOCUMENTATION.md) - Complete API endpoint reference
- [README](./README.md) - Backend setup and development guide

## Support

For issues or questions:
1. Check the API documentation
2. Review error messages in browser console
3. Check backend server logs
4. Verify environment configuration
