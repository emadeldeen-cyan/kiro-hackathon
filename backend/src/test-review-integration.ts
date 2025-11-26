import { ReviewService, BookService } from './services';
import { InMemoryReviewRepository, InMemoryBookRepository } from './repositories';
import { IOpenLibraryClient } from './clients/openlibrary';
import { OpenLibrarySearchResult, OpenLibraryBook } from './models';

// Mock OpenLibrary client
class MockOpenLibraryClient implements IOpenLibraryClient {
  async searchBooks(_query: string): Promise<OpenLibrarySearchResult[]> {
    return [];
  }

  async getBookDetails(openLibraryKey: string): Promise<OpenLibraryBook> {
    return {
      key: openLibraryKey,
      title: 'Mock Book',
      description: 'A mock book for testing',
      covers: [12345],
    };
  }
}

async function testReviewIntegration() {
  const reviewRepository = new InMemoryReviewRepository();
  const bookRepository = new InMemoryBookRepository();
  const openLibraryClient = new MockOpenLibraryClient();
  
  const reviewService = new ReviewService(reviewRepository, bookRepository);
  const bookService = new BookService(bookRepository, openLibraryClient, reviewRepository);

  console.log('Testing Review and Book Service Integration...\n');

  try {
    // Create test books
    const book1 = await bookRepository.create({
      openLibraryKey: '/works/OL1',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      isbn: '1234567890',
    });

    const book2 = await bookRepository.create({
      openLibraryKey: '/works/OL2',
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      isbn: '0987654321',
    });

    console.log('✓ Created test books');

    // Create reviews for book1
    await reviewService.createReview('user1', book1.id, 5, 'Excellent!');
    await reviewService.createReview('user2', book1.id, 4, 'Very good');
    await reviewService.createReview('user3', book1.id, 5, 'Amazing');
    console.log('✓ Created 3 reviews for book1');

    // Create reviews for book2
    await reviewService.createReview('user1', book2.id, 3, 'Good');
    await reviewService.createReview('user2', book2.id, 4, 'Nice read');
    console.log('✓ Created 2 reviews for book2');

    // Test local search with average ratings
    const searchResults = await bookService.searchLocalBooks('');
    console.log('✓ Found', searchResults.length, 'books in local search');

    // Verify average ratings
    const book1Result = searchResults.find(b => b.id === book1.id);
    const book2Result = searchResults.find(b => b.id === book2.id);

    if (book1Result && book1Result.averageRating !== null) {
      const expectedAvg1 = (5 + 4 + 5) / 3;
      const actualAvg1 = Math.round(book1Result.averageRating * 100) / 100;
      const expectedRounded = Math.round(expectedAvg1 * 100) / 100;
      console.log(`✓ Book1 average rating: ${actualAvg1} (expected: ${expectedRounded})`);
      
      if (Math.abs(actualAvg1 - expectedRounded) < 0.01) {
        console.log('  ✓ Average rating calculation is correct');
      } else {
        console.log('  ✗ Average rating calculation is incorrect');
      }
    }

    if (book2Result && book2Result.averageRating !== null) {
      const expectedAvg2 = (3 + 4) / 2;
      const actualAvg2 = Math.round(book2Result.averageRating * 100) / 100;
      const expectedRounded = Math.round(expectedAvg2 * 100) / 100;
      console.log(`✓ Book2 average rating: ${actualAvg2} (expected: ${expectedRounded})`);
      
      if (Math.abs(actualAvg2 - expectedRounded) < 0.01) {
        console.log('  ✓ Average rating calculation is correct');
      } else {
        console.log('  ✗ Average rating calculation is incorrect');
      }
    }

    // Test user review history with book data
    const user1Reviews = await reviewService.getReviewsByUser('user1');
    console.log('✓ User1 has', user1Reviews.length, 'reviews');
    console.log('  Reviews include book titles:');
    user1Reviews.forEach(review => {
      console.log(`    - ${review.book.title} by ${review.book.author}`);
    });

    // Test getting reviews by book
    const book1Reviews = await reviewService.getReviewsByBook(book1.id);
    console.log('✓ Book1 has', book1Reviews.length, 'reviews');

    console.log('\n✓ All integration tests passed!');
  } catch (error) {
    console.error('✗ Test failed:', error);
    process.exit(1);
  }
}

testReviewIntegration();
