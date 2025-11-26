import { InMemoryUserRepository } from './repositories';
import { UserService } from './services';

async function testUserService() {
  const userRepo = new InMemoryUserRepository();
  const userService = new UserService(userRepo);

  console.log('=== Testing User Registration ===\n');

  try {
    // Test 1: Successful registration
    console.log('Test 1: Register a valid user');
    const user1 = await userService.registerUser('john_doe', 'john@example.com', 'password123');
    console.log('✓ User created:', { id: user1.id, username: user1.username, email: user1.email });
    console.log('✓ Password is hashed:', user1.passwordHash !== 'password123');
    console.log();

    // Test 2: Duplicate username
    console.log('Test 2: Try to register with duplicate username');
    try {
      await userService.registerUser('john_doe', 'different@example.com', 'password123');
      console.log('✗ Should have failed!');
    } catch (error) {
      console.log('✓ Correctly rejected:', (error as Error).message);
    }
    console.log();

    // Test 3: Duplicate email
    console.log('Test 3: Try to register with duplicate email');
    try {
      await userService.registerUser('jane_doe', 'john@example.com', 'password123');
      console.log('✗ Should have failed!');
    } catch (error) {
      console.log('✓ Correctly rejected:', (error as Error).message);
    }
    console.log();

    // Test 4: Short password
    console.log('Test 4: Try to register with short password');
    try {
      await userService.registerUser('jane_doe', 'jane@example.com', 'short');
      console.log('✗ Should have failed!');
    } catch (error) {
      console.log('✓ Correctly rejected:', (error as Error).message);
    }
    console.log();

    // Test 5: Successful authentication
    console.log('Test 5: Authenticate with correct credentials');
    const authToken = await userService.authenticateUser('john_doe', 'password123');
    console.log('✓ Authentication successful:', { userId: authToken.userId, username: authToken.username });
    console.log('✓ Token generated:', authToken.token.substring(0, 20) + '...');
    console.log();

    // Test 6: Failed authentication
    console.log('Test 6: Try to authenticate with wrong password');
    try {
      await userService.authenticateUser('john_doe', 'wrongpassword');
      console.log('✗ Should have failed!');
    } catch (error) {
      console.log('✓ Correctly rejected:', (error as Error).message);
    }
    console.log();

    // Test 7: Authenticate with email
    console.log('Test 7: Authenticate using email instead of username');
    const authToken2 = await userService.authenticateUser('john@example.com', 'password123');
    console.log('✓ Authentication successful with email:', { username: authToken2.username });
    console.log();

    console.log('=== All Tests Passed! ===');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testUserService();
