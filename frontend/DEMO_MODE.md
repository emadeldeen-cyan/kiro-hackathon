# Demo Mode

Demo mode allows you to test the Book Management application without a backend server.

## Enabling Demo Mode

1. Navigate to the login page
2. Click the "Enable Demo Mode" button at the bottom of the login form
3. The form will be pre-filled with demo credentials
4. Click "Login" to access the application

## Demo Credentials

When demo mode is enabled, you can use **any credentials** to login. The pre-filled credentials are:
- **Username:** demo
- **Password:** demo

## Demo Data

The demo mode includes:

### Demo User
- **Username:** demo
- **Email:** demo@example.com
- **Display Name:** Demo User

### Demo Books
1. **The Great Gatsby** by F. Scott Fitzgerald
   - ISBN: 9780743273565
   - Has a 5-star review from the demo user

2. **To Kill a Mockingbird** by Harper Lee
   - ISBN: 9780061120084
   - Has a 5-star review from the demo user

3. **1984** by George Orwell
   - ISBN: 9780451524935
   - No reviews yet

### Demo Reviews
- 2 reviews written by the demo user
- Both are 5-star reviews with detailed text

## Features Available in Demo Mode

All application features work in demo mode:

✅ **Authentication**
- Login with any credentials
- Register (creates demo session)
- Logout

✅ **Profile Management**
- View profile
- Edit profile information
- Changes persist during the session

✅ **Book Management**
- View all books in the library
- Search local books
- View book details
- See reviews for books

✅ **Review Management**
- Create new reviews
- Edit your reviews
- Delete your reviews
- View all your reviews

✅ **Search**
- Search local books by title or author
- OpenLibrary search (requires internet connection)

## Limitations

⚠️ **Data Persistence**
- Demo data is stored in memory only
- All changes are lost when you refresh the page or close the browser
- Demo mode state is saved in localStorage

⚠️ **OpenLibrary Integration**
- OpenLibrary search still requires internet connection
- Adding books from OpenLibrary works but data is only stored in memory

⚠️ **Multi-user Features**
- Only one demo user exists
- Cannot view other users' profiles
- All reviews appear to be from the demo user

## Disabling Demo Mode

1. Click the "✓ Demo Mode Active" button on the login page
2. Demo mode will be disabled
3. The application will attempt to connect to the backend API

## Technical Details

Demo mode is implemented using:
- `DemoService` - Provides mock data and simulates API responses
- In-memory data storage
- 300-500ms simulated network delays for realistic feel
- All services check for demo mode before making API calls

## Use Cases

Demo mode is perfect for:
- Testing the UI without setting up a backend
- Demonstrating the application to stakeholders
- Development when the backend is unavailable
- Quick prototyping and design reviews
- Accessibility testing
- Performance testing of the frontend

## Switching Between Modes

You can switch between demo mode and real backend mode at any time:
1. Logout from the application
2. Toggle demo mode on the login page
3. Login again

Your session data will be cleared when switching modes.
