import { ReviewService } from './services';
import { InMemoryReviewRepository, InMemoryBookRepository } from './repositories';

async function testReviewService() {
  const reviewRepository = new InMemoryReviewRepository();
  const bookRepository = new InMemoryBookRepository();
  const reviewService = new ReviewService(reviewRepository, bookRepository);

  console.log('Testing ReviewService...\n');

  try {
    // Create a test book first
    const book = await bookRepository.create({
      openLibraryKey: '/works/OL45804W',
      title: 'Test Book',
      author: 'Test Author',
      isbn: '1234567890',
      description: 'A test book',
      coverImageUrl: 'https://example.com/cover.jpg',
    });
    console.log('✓ Created test book:', book.id);

    // Test 1: Create a review
    const review1 = await reviewService.createReview('user1', book.id, 5, 'Great book!');
    console.log('✓ Created review:', review1.id);

    // Test 2: Try to create duplicate review (should fail)
    try {
      await reviewService.createReview('user1', book.id, 4, 'Another review');
      console.log('✗ Should have rejected duplicate review');
    } catch (error) {
      console.log('✓ Correctly rejected duplicate review:', (error as Error).message);
    }

    // Test 3: Create review with invalid rating (should fail)
    try {
      await reviewService.createReview('user2', book.id, 6, 'Invalid rating');
      console.log('✗ Should have rejected invalid rating');
    } catch (error) {
      console.log('✓ Correctly rejected invalid rating:', (error as Error).message);
    }

    // Test 4: Update review
    const updatedReview = await reviewService.updateReview(review1.id, 'user1', 4, 'Updated text');
    console.log('✓ Updated review:', updatedReview.rating, updatedReview.text);

    // Test 5: Try to update another user's review (should fail)
    try {
      await reviewService.updateReview(review1.id, 'user2', 3, 'Hacking attempt');
      console.log('✗ Should have rejected unauthorized update');
    } catch (error) {
      console.log('✓ Correctly rejected unauthorized update:', (error as Error).message);
    }

    // Test 6: Get reviews by book
    const bookReviews = await reviewService.getReviewsByBook(book.id);
    console.log('✓ Found', bookReviews.length, 'review(s) for book');

    // Test 7: Get reviews by user with book data
    const userReviews = await reviewService.getReviewsByUser('user1');
    console.log('✓ Found', userReviews.length, 'review(s) by user');
    console.log('  Review includes book data:', userReviews[0].book.title);

    // Test 8: Delete review
    await reviewService.deleteReview(review1.id, 'user1');
    console.log('✓ Deleted review');

    // Test 9: Verify review was deleted
    const reviewsAfterDelete = await reviewService.getReviewsByBook(book.id);
    console.log('✓ Reviews after delete:', reviewsAfterDelete.length);

    // Test 10: Try to delete non-existent review (should fail)
    try {
      await reviewService.deleteReview(review1.id, 'user1');
      console.log('✗ Should have rejected deleting non-existent review');
    } catch (error) {
      console.log('✓ Correctly rejected deleting non-existent review:', (error as Error).message);
    }

    console.log('\n✓ All ReviewService tests passed!');
  } catch (error) {
    console.error('✗ Test failed:', error);
    process.exit(1);
  }
}

testReviewService();
