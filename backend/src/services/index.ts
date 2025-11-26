import { User, Profile, Book, OpenLibrarySearchResult, Review } from '../models';
import { IUserRepository, IProfileRepository, IBookRepository, IReviewRepository } from '../repositories';
import { IOpenLibraryClient } from '../clients/openlibrary';
import { hashPassword, verifyPassword } from '../utils/password';

// Authentication token interface
export interface AuthToken {
  token: string;
  userId: string;
  username: string;
}

// User Service Interface
export interface IUserService {
  registerUser(username: string, email: string, password: string): Promise<User>;
  authenticateUser(username: string, password: string): Promise<AuthToken>;
  validatePassword(password: string): boolean;
}

// User Service Implementation
export class UserService implements IUserService {
  constructor(private userRepository: IUserRepository) {}

  /**
   * Validate password meets minimum requirements
   * @param password - Password to validate
   * @returns True if password is valid
   */
  validatePassword(password: string): boolean {
    return password.length >= 8;
  }

  /**
   * Register a new user with validation
   * @param username - Unique username
   * @param email - Unique email address
   * @param password - Plain text password (min 8 characters)
   * @returns Created user
   * @throws Error if validation fails or username/email already exists
   */
  async registerUser(username: string, email: string, password: string): Promise<User> {
    // Validate password length
    if (!this.validatePassword(password)) {
      throw new Error('Password must be at least 8 characters long');
    }

    // Check if username already exists
    const existingUserByUsername = await this.userRepository.findByUsername(username);
    if (existingUserByUsername) {
      throw new Error('Username already exists');
    }

    // Check if email already exists
    const existingUserByEmail = await this.userRepository.findByEmail(email);
    if (existingUserByEmail) {
      throw new Error('Email already exists');
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await this.userRepository.create({
      username,
      email,
      passwordHash,
    });

    return user;
  }

  /**
   * Authenticate a user with username and password
   * @param username - Username or email
   * @param password - Plain text password
   * @returns Authentication token
   * @throws Error if authentication fails
   */
  async authenticateUser(username: string, password: string): Promise<AuthToken> {
    // Try to find user by username first
    let user = await this.userRepository.findByUsername(username);
    
    // If not found, try by email
    if (!user) {
      user = await this.userRepository.findByEmail(username);
    }

    if (!user) {
      throw new Error('Invalid username or password');
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Invalid username or password');
    }

    // Generate token (simplified - in production use JWT)
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

    return {
      token,
      userId: user.id,
      username: user.username,
    };
  }
}

// Profile Service Interface
export interface IProfileService {
  createProfile(userId: string, displayName: string, bio?: string, avatarUrl?: string): Promise<Profile>;
  updateProfile(userId: string, updates: Partial<{ displayName: string; bio: string; avatarUrl: string }>): Promise<Profile>;
  getProfile(userId: string): Promise<Profile>;
}

// Profile Service Implementation
export class ProfileService implements IProfileService {
  constructor(private profileRepository: IProfileRepository) {}

  /**
   * Validate display name meets requirements
   * @param displayName - Display name to validate
   * @returns True if display name is valid
   */
  private validateDisplayName(displayName: string): boolean {
    return displayName.length <= 100;
  }

  /**
   * Create a new profile for a user
   * @param userId - User ID to create profile for
   * @param displayName - Display name (max 100 characters)
   * @param bio - Optional bio text
   * @param avatarUrl - Optional avatar URL
   * @returns Created profile
   * @throws Error if validation fails or profile already exists
   */
  async createProfile(userId: string, displayName: string, bio?: string, avatarUrl?: string): Promise<Profile> {
    // Validate display name length
    if (!this.validateDisplayName(displayName)) {
      throw new Error('Display name must not exceed 100 characters');
    }

    // Check if profile already exists for this user
    const existingProfile = await this.profileRepository.findByUserId(userId);
    if (existingProfile) {
      throw new Error('Profile already exists for this user');
    }

    // Create profile
    const profile = await this.profileRepository.create({
      userId,
      displayName,
      bio,
      avatarUrl,
    });

    return profile;
  }

  /**
   * Update an existing profile
   * @param userId - User ID whose profile to update
   * @param updates - Partial profile data to update
   * @returns Updated profile
   * @throws Error if validation fails or profile not found
   */
  async updateProfile(userId: string, updates: Partial<{ displayName: string; bio: string; avatarUrl: string }>): Promise<Profile> {
    // Validate display name if provided
    if (updates.displayName !== undefined && !this.validateDisplayName(updates.displayName)) {
      throw new Error('Display name must not exceed 100 characters');
    }

    // Check if profile exists
    const existingProfile = await this.profileRepository.findByUserId(userId);
    if (!existingProfile) {
      throw new Error('Profile not found');
    }

    // Update profile
    const profile = await this.profileRepository.update(userId, updates);

    return profile;
  }

  /**
   * Get a user's profile
   * @param userId - User ID whose profile to retrieve
   * @returns User profile
   * @throws Error if profile not found
   */
  async getProfile(userId: string): Promise<Profile> {
    const profile = await this.profileRepository.findByUserId(userId);
    if (!profile) {
      throw new Error('Profile not found');
    }
    return profile;
  }
}

// Book search result with average rating
export interface BookSearchResult {
  id: string;
  openLibraryKey: string;
  title: string;
  author: string;
  isbn: string | null;
  description: string | null;
  coverImageUrl: string | null;
  averageRating: number | null;
}

// Book Service Interface
export interface IBookService {
  searchOpenLibrary(query: string): Promise<OpenLibrarySearchResult[]>;
  addBookFromOpenLibrary(openLibraryKey: string): Promise<Book>;
  getBook(bookId: string): Promise<Book>;
  searchLocalBooks(query: string): Promise<BookSearchResult[]>;
}

// Book Service Implementation
export class BookService implements IBookService {
  constructor(
    private bookRepository: IBookRepository,
    private openLibraryClient: IOpenLibraryClient,
    private reviewRepository?: IReviewRepository
  ) {}

  /**
   * Search for books using OpenLibrary API
   * @param query - Search query string
   * @returns Array of OpenLibrary search results
   * @throws Error if OpenLibrary API fails
   */
  async searchOpenLibrary(query: string): Promise<OpenLibrarySearchResult[]> {
    return await this.openLibraryClient.searchBooks(query);
  }

  /**
   * Add a book from OpenLibrary to the local database
   * Checks if book already exists by OpenLibrary Key first
   * @param openLibraryKey - OpenLibrary key (e.g., "/works/OL45804W")
   * @returns Existing or newly created book
   * @throws Error if OpenLibrary API fails or book data is invalid
   */
  async addBookFromOpenLibrary(openLibraryKey: string): Promise<Book> {
    // Check if book already exists in local database
    const existingBook = await this.bookRepository.findByOpenLibraryKey(openLibraryKey);
    if (existingBook) {
      return existingBook;
    }

    // Fetch detailed book information from OpenLibrary
    const bookDetails = await this.openLibraryClient.getBookDetails(openLibraryKey);

    // Try to get author and ISBN from search results
    let author = 'Unknown Author';
    let isbn: string | undefined;
    
    try {
      // Search using the book title to get additional metadata
      const searchResults = await this.openLibraryClient.searchBooks(bookDetails.title);
      const matchingResult = searchResults.find(result => result.key === openLibraryKey);
      if (matchingResult) {
        author = matchingResult.author_name?.[0] || 'Unknown Author';
        isbn = matchingResult.isbn?.[0];
      }
    } catch (error) {
      // If search fails, continue with default author
      console.warn('Failed to fetch author from search, using default');
    }

    // Extract description (handle both string and object formats)
    let description: string | undefined;
    if (bookDetails.description) {
      if (typeof bookDetails.description === 'string') {
        description = bookDetails.description;
      } else if (typeof bookDetails.description === 'object' && 'value' in bookDetails.description) {
        description = bookDetails.description.value;
      }
    }

    // Build cover image URL if cover ID is available
    let coverImageUrl: string | undefined;
    if (bookDetails.covers && bookDetails.covers.length > 0) {
      const coverId = bookDetails.covers[0];
      coverImageUrl = `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
    }

    // Create book in local database
    const book = await this.bookRepository.create({
      openLibraryKey: bookDetails.key,
      title: bookDetails.title,
      author,
      isbn,
      description,
      coverImageUrl,
    });

    return book;
  }

  /**
   * Get a book by ID
   * @param bookId - Book ID
   * @returns Book
   * @throws Error if book not found
   */
  async getBook(bookId: string): Promise<Book> {
    const book = await this.bookRepository.findById(bookId);
    if (!book) {
      throw new Error('Book not found');
    }
    return book;
  }

  /**
   * Search for books in the local database
   * @param query - Search query (searches title and author)
   * @returns Array of books with average ratings
   */
  async searchLocalBooks(query: string): Promise<BookSearchResult[]> {
    const books = await this.bookRepository.search(query);
    
    // Map to search results with average ratings
    const results: BookSearchResult[] = [];
    for (const book of books) {
      let averageRating: number | null = null;
      
      // Calculate average rating if review repository is available
      if (this.reviewRepository) {
        const reviews = await this.reviewRepository.findByBookId(book.id);
        if (reviews.length > 0) {
          const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
          averageRating = totalRating / reviews.length;
        }
      }
      
      results.push({
        id: book.id,
        openLibraryKey: book.openLibraryKey,
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        description: book.description,
        coverImageUrl: book.coverImageUrl,
        averageRating,
      });
    }
    
    return results;
  }
}

// Review with book data for user review history
export interface ReviewWithBook {
  id: string;
  userId: string;
  bookId: string;
  rating: number;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  book: {
    id: string;
    title: string;
    author: string;
    isbn: string | null;
  };
}

// Review Service Interface
export interface IReviewService {
  createReview(userId: string, bookId: string, rating: number, text: string): Promise<Review>;
  updateReview(reviewId: string, userId: string, rating?: number, text?: string): Promise<Review>;
  deleteReview(reviewId: string, userId: string): Promise<void>;
  getReviewsByBook(bookId: string): Promise<Review[]>;
  getReviewsByUser(userId: string): Promise<ReviewWithBook[]>;
}

// Review Service Implementation
export class ReviewService implements IReviewService {
  constructor(
    private reviewRepository: IReviewRepository,
    private bookRepository: IBookRepository
  ) {}

  /**
   * Validate rating is within valid range
   * @param rating - Rating value to validate
   * @returns True if rating is valid
   */
  private validateRating(rating: number): boolean {
    return rating >= 1 && rating <= 5;
  }

  /**
   * Create a new review for a book
   * @param userId - User ID creating the review
   * @param bookId - Book ID being reviewed
   * @param rating - Rating (1-5)
   * @param text - Review text
   * @returns Created review
   * @throws Error if validation fails or user already reviewed this book
   */
  async createReview(userId: string, bookId: string, rating: number, text: string): Promise<Review> {
    // Validate rating range
    if (!this.validateRating(rating)) {
      throw new Error('Rating must be between 1 and 5');
    }

    // Check if user already reviewed this book
    const existingReview = await this.reviewRepository.findByUserAndBook(userId, bookId);
    if (existingReview) {
      throw new Error('User has already reviewed this book');
    }

    // Verify book exists
    const book = await this.bookRepository.findById(bookId);
    if (!book) {
      throw new Error('Book not found');
    }

    // Create review
    const review = await this.reviewRepository.create({
      userId,
      bookId,
      rating,
      text,
    });

    return review;
  }

  /**
   * Update an existing review
   * @param reviewId - Review ID to update
   * @param userId - User ID attempting the update (for authorization)
   * @param rating - Optional new rating (1-5)
   * @param text - Optional new review text
   * @returns Updated review
   * @throws Error if validation fails, review not found, or unauthorized
   */
  async updateReview(reviewId: string, userId: string, rating?: number, text?: string): Promise<Review> {
    // Find existing review
    const existingReview = await this.reviewRepository.findById(reviewId);
    if (!existingReview) {
      throw new Error('Review not found');
    }

    // Check authorization - only review owner can update
    if (existingReview.userId !== userId) {
      throw new Error('Unauthorized: You can only update your own reviews');
    }

    // Validate rating if provided
    if (rating !== undefined && !this.validateRating(rating)) {
      throw new Error('Rating must be between 1 and 5');
    }

    // Update review
    const updatedReview = await this.reviewRepository.update(reviewId, {
      rating,
      text,
    });

    return updatedReview;
  }

  /**
   * Delete a review
   * @param reviewId - Review ID to delete
   * @param userId - User ID attempting the deletion (for authorization)
   * @throws Error if review not found or unauthorized
   */
  async deleteReview(reviewId: string, userId: string): Promise<void> {
    // Find existing review
    const existingReview = await this.reviewRepository.findById(reviewId);
    if (!existingReview) {
      throw new Error('Review not found');
    }

    // Check authorization - only review owner can delete
    if (existingReview.userId !== userId) {
      throw new Error('Unauthorized: You can only delete your own reviews');
    }

    // Delete review
    await this.reviewRepository.delete(reviewId);
  }

  /**
   * Get all reviews for a specific book
   * @param bookId - Book ID
   * @returns Array of reviews for the book
   */
  async getReviewsByBook(bookId: string): Promise<Review[]> {
    return await this.reviewRepository.findByBookId(bookId);
  }

  /**
   * Get all reviews by a specific user with associated book data
   * @param userId - User ID
   * @returns Array of reviews with book information
   */
  async getReviewsByUser(userId: string): Promise<ReviewWithBook[]> {
    const reviews = await this.reviewRepository.findByUserId(userId);
    
    // Fetch book data for each review
    const reviewsWithBooks: ReviewWithBook[] = [];
    for (const review of reviews) {
      const book = await this.bookRepository.findById(review.bookId);
      if (book) {
        reviewsWithBooks.push({
          id: review.id,
          userId: review.userId,
          bookId: review.bookId,
          rating: review.rating,
          text: review.text,
          createdAt: review.createdAt,
          updatedAt: review.updatedAt,
          book: {
            id: book.id,
            title: book.title,
            author: book.author,
            isbn: book.isbn,
          },
        });
      }
    }

    return reviewsWithBooks;
  }
}
