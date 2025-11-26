import { InMemoryUserRepository, InMemoryReviewRepository, InMemoryBookRepository } from './repositories';
import { UserService } from './services';

async function testSharedBooks() {
  console.log('Testing shared books feature...\n');

  // Initialize repositories
  const reviewRepository = new InMemoryReviewRepository();
  const userRepository = new InMemoryUserRepository(reviewRepository);
  const bookRepository = new InMemoryBookRepository();
  const userService = new UserService(userRepository);

  try {
    // Create test users
    console.log('Creating test users...');
    const user1 = await userService.registerUser('alice', 'alice@example.com', 'password123');
    const user2 = await userService.registerUser('bob', 'bob@example.com', 'password123');
    const user3 = await userService.registerUser('charlie', 'charlie@example.com', 'password123');
    const user4 = await userService.registerUser('david', 'david@example.com', 'password123');
    console.log(`Created users: ${user1.username}, ${user2.username}, ${user3.username}, ${user4.username}\n`);

    // Create test books
    console.log('Creating test books...');
    const book1 = await bookRepository.create({
      openLibraryKey: '/works/OL1',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
    });
    const book2 = await bookRepository.create({
      openLibraryKey: '/works/OL2',
      title: '1984',
      author: 'George Orwell',
    });
    const book3 = await bookRepository.create({
      openLibraryKey: '/works/OL3',
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
    });
    const book4 = await bookRepository.create({
      openLibraryKey: '/works/OL4',
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
    });
    console.log(`Created books: ${book1.title}, ${book2.title}, ${book3.title}, ${book4.title}\n`);

    // Create reviews to establish shared books
    console.log('Creating reviews...');
    // Alice reviews books 1, 2, 3
    await reviewRepository.create({ userId: user1.id, bookId: book1.id, rating: 5, text: 'Great!' });
    await reviewRepository.create({ userId: user1.id, bookId: book2.id, rating: 4, text: 'Good!' });
    await reviewRepository.create({ userId: user1.id, bookId: book3.id, rating: 5, text: 'Excellent!' });

    // Bob reviews books 1, 2 (2 shared with Alice)
    await reviewRepository.create({ userId: user2.id, bookId: book1.id, rating: 4, text: 'Nice!' });
    await reviewRepository.create({ userId: user2.id, bookId: book2.id, rating: 5, text: 'Amazing!' });

    // Charlie reviews books 1, 2, 3 (3 shared with Alice)
    await reviewRepository.create({ userId: user3.id, bookId: book1.id, rating: 5, text: 'Love it!' });
    await reviewRepository.create({ userId: user3.id, bookId: book2.id, rating: 4, text: 'Interesting!' });
    await reviewRepository.create({ userId: user3.id, bookId: book3.id, rating: 5, text: 'Perfect!' });

    // David reviews book 4 only (0 shared with Alice)
    await reviewRepository.create({ userId: user4.id, bookId: book4.id, rating: 3, text: 'Okay!' });
    console.log('Reviews created\n');

    // Test: Find users with same books as Alice
    console.log('Finding users with same books as Alice...');
    const sharedUsers = await userService.findUsersWithSameBooks(user1.id);
    
    console.log(`Found ${sharedUsers.length} users with shared books:\n`);
    sharedUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.username} (${user.email}) - ${user.sharedBookCount} shared book(s)`);
    });

    // Verify sorting
    console.log('\nVerifying sorting...');
    if (sharedUsers.length >= 2) {
      // Charlie should be first (3 shared books)
      if (sharedUsers[0].username === 'charlie' && sharedUsers[0].sharedBookCount === 3) {
        console.log('✓ First user is Charlie with 3 shared books');
      } else {
        console.log('✗ Expected Charlie with 3 shared books first');
      }

      // Bob should be second (2 shared books)
      if (sharedUsers[1].username === 'bob' && sharedUsers[1].sharedBookCount === 2) {
        console.log('✓ Second user is Bob with 2 shared books');
      } else {
        console.log('✗ Expected Bob with 2 shared books second');
      }

      // David should not appear (0 shared books)
      const davidInResults = sharedUsers.find(u => u.username === 'david');
      if (!davidInResults) {
        console.log('✓ David is not in results (0 shared books)');
      } else {
        console.log('✗ David should not be in results');
      }
    }

    console.log('\n✓ Test completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

testSharedBooks();
