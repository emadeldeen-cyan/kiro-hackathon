# Find Friends Feature

## Overview
The Find Friends feature allows users to discover other users who have reviewed the same books, helping them connect with people who share similar reading interests.

## Backend Integration
The feature integrates with the existing backend endpoint:
- **Endpoint**: `GET /api/users/shared-books`
- **Authentication**: Required (JWT token)
- **Response**: Array of users with shared books information

### Response Structure
```json
[
  {
    "userId": "string",
    "username": "string",
    "displayName": "string",
    "avatarUrl": "string",
    "sharedBooks": [
      {
        "bookId": "string",
        "title": "string",
        "authors": ["string"],
        "coverUrl": "string"
      }
    ],
    "sharedBooksCount": number
  }
]
```

## Frontend Implementation

### Files Created
1. **Service**: `frontend/src/app/core/services/user.service.ts`
   - Handles API calls to the users endpoint
   - Method: `findUsersWithSharedBooks()`

2. **Models**: `frontend/src/app/core/models/user.models.ts`
   - `UserWithSharedBooks` interface
   - `SharedBook` interface

3. **Component**: `frontend/src/app/features/friends/find-friends/`
   - `find-friends.component.ts` - Component logic
   - `find-friends.component.html` - Template
   - `find-friends.component.scss` - Styles

### Features
- **User Discovery**: Displays users who have reviewed the same books
- **Shared Books Display**: Shows up to 3 shared books with covers
- **Book Navigation**: Click on book chips to view book details
- **Profile Navigation**: View user profiles directly from the list
- **Responsive Design**: Works on desktop and mobile devices
- **Loading States**: Shows spinner while fetching data
- **Error Handling**: Displays user-friendly error messages
- **Empty State**: Guides users when no matches are found

### Navigation
The feature is accessible via:
- **Route**: `/friends/find`
- **Navigation Menu**: "Find Friends" link in the main navbar
- **Icon**: People icon (👥)

## Usage

### For Users
1. Navigate to "Find Friends" from the main menu
2. The system automatically finds users who have reviewed the same books
3. View shared books for each user
4. Click on a book to see its details
5. Click "View Profile" to see a user's full profile

### For Developers

#### Running the Backend
```bash
cd backend
npm install
npm run dev
```

#### Running the Frontend
```bash
cd frontend
npm install
npm start
```

#### Testing the API
```bash
./test-find-friends.sh
```

## Design Decisions

### UI/UX
- **Card Layout**: Each user is displayed in a card for easy scanning
- **Visual Hierarchy**: Avatar, name, and shared book count are prominent
- **Book Chips**: Interactive chips for shared books with covers
- **Hover Effects**: Cards lift on hover for better interactivity
- **Material Design**: Consistent with the rest of the application

### Performance
- **Lazy Loading**: Component is standalone and loaded on demand
- **Efficient Rendering**: Uses Angular's change detection optimally
- **Image Optimization**: Book covers are displayed at appropriate sizes

### Accessibility
- **Semantic HTML**: Proper heading structure and landmarks
- **ARIA Labels**: Screen reader friendly
- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Color Contrast**: Meets WCAG AA standards

## Future Enhancements
- Add filtering options (by genre, rating, etc.)
- Implement friend request/connection system
- Add sorting options (most shared books, recently active, etc.)
- Show mutual friends
- Add messaging between users
- Implement pagination for large result sets

## Dependencies
- Angular Material (Cards, Buttons, Icons, Chips, Spinner)
- Angular Router
- RxJS for reactive programming

## Testing
The feature can be tested by:
1. Creating multiple user accounts
2. Having users review the same books
3. Logging in and navigating to Find Friends
4. Verifying that users with shared books appear

## Troubleshooting

### No users found
- Ensure you have reviewed at least one book
- Ensure other users have reviewed the same books
- Check that the backend is running and accessible

### API errors
- Verify the backend is running on the correct port
- Check authentication token is valid
- Review browser console for detailed error messages

### Styling issues
- Clear browser cache
- Ensure Angular Material is properly installed
- Check that styles are being compiled correctly
