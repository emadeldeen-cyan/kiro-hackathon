import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { AuthToken, User } from '../models/auth.models';
import { Book } from '../models/book.models';
import { Review } from '../models/review.models';
import { Profile } from '../models/profile.models';

/**
 * Demo service for testing the application without a backend
 */
@Injectable({
  providedIn: 'root'
})
export class DemoService {
  private readonly DEMO_MODE_KEY = 'demo_mode';
  
  // Demo user
  private demoUser: User = {
    id: 'demo-user-1',
    username: 'demo',
    email: 'demo@example.com'
  };

  // Demo profile
  private demoProfile: Profile = {
    id: 'demo-profile-1',
    userId: 'demo-user-1',
    displayName: 'Demo User',
    bio: 'This is a demo account for testing the Book Management application.',
    avatarUrl: 'https://i.pravatar.cc/150?img=68',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  };

  // Demo books
  private demoBooks: Book[] = [
    {
      id: 'book-1',
      openLibraryKey: '/works/OL45804W',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      isbn: '9780743273565',
      description: 'The story of the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.',
      coverImageUrl: 'https://covers.openlibrary.org/b/id/7222246-M.jpg',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 'book-2',
      openLibraryKey: '/works/OL27448W',
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      isbn: '9780061120084',
      description: 'A gripping tale of racial injustice and childhood innocence in the American South.',
      coverImageUrl: 'https://covers.openlibrary.org/b/id/8228691-M.jpg',
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02')
    },
    {
      id: 'book-3',
      openLibraryKey: '/works/OL1168007W',
      title: '1984',
      author: 'George Orwell',
      isbn: '9780451524935',
      description: 'A dystopian social science fiction novel and cautionary tale about totalitarianism.',
      coverImageUrl: 'https://covers.openlibrary.org/b/id/7222246-M.jpg',
      createdAt: new Date('2024-01-03'),
      updatedAt: new Date('2024-01-03')
    }
  ];

  // Demo reviews
  private demoReviews: Review[] = [
    {
      id: 'review-1',
      userId: 'demo-user-1',
      bookId: 'book-1',
      rating: 5,
      text: 'An absolute masterpiece! Fitzgerald\'s prose is beautiful and the story is timeless.',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: 'review-2',
      userId: 'demo-user-1',
      bookId: 'book-2',
      rating: 5,
      text: 'A powerful and moving story that everyone should read. Harper Lee\'s writing is exceptional.',
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20')
    }
  ];

  constructor() {}

  /**
   * Check if demo mode is enabled
   */
  isDemoMode(): boolean {
    return localStorage.getItem(this.DEMO_MODE_KEY) === 'true';
  }

  /**
   * Enable demo mode
   */
  enableDemoMode(): void {
    localStorage.setItem(this.DEMO_MODE_KEY, 'true');
  }

  /**
   * Disable demo mode
   */
  disableDemoMode(): void {
    localStorage.removeItem(this.DEMO_MODE_KEY);
  }

  /**
   * Demo login
   */
  demoLogin(username: string, password: string): Observable<AuthToken> {
    // Accept any credentials for demo
    return of({
      token: 'demo-token-' + Date.now(),
      user: this.demoUser
    }).pipe(delay(500)); // Simulate network delay
  }

  /**
   * Demo register
   */
  demoRegister(username: string, email: string, password: string): Observable<AuthToken> {
    return of({
      token: 'demo-token-' + Date.now(),
      user: this.demoUser
    }).pipe(delay(500));
  }

  /**
   * Get demo user
   */
  getDemoUser(): User {
    return this.demoUser;
  }

  /**
   * Get demo profile
   */
  getDemoProfile(): Observable<Profile> {
    return of(this.demoProfile).pipe(delay(300));
  }

  /**
   * Update demo profile
   */
  updateDemoProfile(updates: Partial<Profile>): Observable<Profile> {
    this.demoProfile = { ...this.demoProfile, ...updates, updatedAt: new Date() };
    return of(this.demoProfile).pipe(delay(300));
  }

  /**
   * Get all demo books
   */
  getDemoBooks(): Observable<Book[]> {
    return of([...this.demoBooks]).pipe(delay(300));
  }

  /**
   * Get demo book by ID
   */
  getDemoBook(id: string): Observable<Book | null> {
    const book = this.demoBooks.find(b => b.id === id);
    return of(book || null).pipe(delay(300));
  }

  /**
   * Search demo books
   */
  searchDemoBooks(query: string): Observable<Book[]> {
    const lowerQuery = query.toLowerCase();
    const results = this.demoBooks.filter(book =>
      book.title.toLowerCase().includes(lowerQuery) ||
      book.author.toLowerCase().includes(lowerQuery)
    );
    return of(results).pipe(delay(300));
  }

  /**
   * Get demo reviews for a book
   */
  getDemoReviewsForBook(bookId: string): Observable<Review[]> {
    const reviews = this.demoReviews.filter(r => r.bookId === bookId);
    return of(reviews).pipe(delay(300));
  }

  /**
   * Get demo reviews by user
   */
  getDemoReviewsByUser(userId: string): Observable<Review[]> {
    const reviews = this.demoReviews.filter(r => r.userId === userId);
    return of(reviews).pipe(delay(300));
  }

  /**
   * Get demo reviews by user with book information
   */
  getDemoReviewsByUserWithBooks(userId: string): Observable<any[]> {
    const reviews = this.demoReviews.filter(r => r.userId === userId);
    const reviewsWithBooks = reviews.map(review => {
      const book = this.demoBooks.find(b => b.id === review.bookId);
      return {
        ...review,
        book: book ? {
          id: book.id,
          title: book.title,
          author: book.author,
          isbn: book.isbn,
          coverImageUrl: book.coverImageUrl
        } : null
      };
    });
    return of(reviewsWithBooks).pipe(delay(300));
  }

  /**
   * Create demo review
   */
  createDemoReview(bookId: string, rating: number, text: string): Observable<Review> {
    const newReview: Review = {
      id: 'review-' + Date.now(),
      userId: this.demoUser.id,
      bookId,
      rating,
      text,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.demoReviews.push(newReview);
    return of(newReview).pipe(delay(300));
  }

  /**
   * Update demo review
   */
  updateDemoReview(reviewId: string, rating?: number, text?: string): Observable<Review> {
    const review = this.demoReviews.find(r => r.id === reviewId);
    if (!review) {
      throw new Error('Review not found');
    }
    if (rating !== undefined) review.rating = rating;
    if (text !== undefined) review.text = text;
    review.updatedAt = new Date();
    return of(review).pipe(delay(300));
  }

  /**
   * Delete demo review
   */
  deleteDemoReview(reviewId: string): Observable<void> {
    const index = this.demoReviews.findIndex(r => r.id === reviewId);
    if (index !== -1) {
      this.demoReviews.splice(index, 1);
    }
    return of(void 0).pipe(delay(300));
  }

  /**
   * Add a book to demo library
   */
  addDemoBook(book: Partial<Book>): Observable<Book> {
    const newBook: Book = {
      id: 'book-' + Date.now(),
      openLibraryKey: book.openLibraryKey || '',
      title: book.title || 'Unknown Title',
      author: book.author || 'Unknown Author',
      isbn: book.isbn || null,
      description: book.description || null,
      coverImageUrl: book.coverImageUrl || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.demoBooks.push(newBook);
    return of(newBook).pipe(delay(300));
  }
}
