import { User, CreateUserDTO, Profile, CreateProfileDTO, UpdateProfileDTO, Book, CreateBookDTO, Review, CreateReviewDTO, UpdateReviewDTO } from '../models';

// User Repository Interface
export interface IUserRepository {
  create(userData: CreateUserDTO): Promise<User>;
  findByUsername(username: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
}

// In-memory User Repository Implementation
export class InMemoryUserRepository implements IUserRepository {
  private users: Map<string, User> = new Map();
  private usernameIndex: Map<string, string> = new Map();
  private emailIndex: Map<string, string> = new Map();
  private idCounter = 1;

  async create(userData: CreateUserDTO): Promise<User> {
    const id = `user_${this.idCounter++}`;
    const now = new Date();
    
    const user: User = {
      id,
      username: userData.username,
      email: userData.email,
      passwordHash: userData.passwordHash,
      createdAt: now,
      updatedAt: now,
    };

    this.users.set(id, user);
    this.usernameIndex.set(userData.username.toLowerCase(), id);
    this.emailIndex.set(userData.email.toLowerCase(), id);

    return user;
  }

  async findByUsername(username: string): Promise<User | null> {
    const userId = this.usernameIndex.get(username.toLowerCase());
    if (!userId) return null;
    return this.users.get(userId) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const userId = this.emailIndex.get(email.toLowerCase());
    if (!userId) return null;
    return this.users.get(userId) || null;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  // Helper method for testing
  clear(): void {
    this.users.clear();
    this.usernameIndex.clear();
    this.emailIndex.clear();
    this.idCounter = 1;
  }
}

// Profile Repository Interface
export interface IProfileRepository {
  create(profileData: CreateProfileDTO): Promise<Profile>;
  update(userId: string, profileData: UpdateProfileDTO): Promise<Profile>;
  findByUserId(userId: string): Promise<Profile | null>;
}

// In-memory Profile Repository Implementation
export class InMemoryProfileRepository implements IProfileRepository {
  private profiles: Map<string, Profile> = new Map();
  private userIdIndex: Map<string, string> = new Map();
  private idCounter = 1;

  async create(profileData: CreateProfileDTO): Promise<Profile> {
    const id = `profile_${this.idCounter++}`;
    const now = new Date();
    
    const profile: Profile = {
      id,
      userId: profileData.userId,
      displayName: profileData.displayName,
      bio: profileData.bio || null,
      avatarUrl: profileData.avatarUrl || null,
      createdAt: now,
      updatedAt: now,
    };

    this.profiles.set(id, profile);
    this.userIdIndex.set(profileData.userId, id);

    return profile;
  }

  async update(userId: string, profileData: UpdateProfileDTO): Promise<Profile> {
    const profileId = this.userIdIndex.get(userId);
    if (!profileId) {
      throw new Error('Profile not found');
    }

    const existingProfile = this.profiles.get(profileId);
    if (!existingProfile) {
      throw new Error('Profile not found');
    }

    const updatedProfile: Profile = {
      ...existingProfile,
      displayName: profileData.displayName !== undefined ? profileData.displayName : existingProfile.displayName,
      bio: profileData.bio !== undefined ? profileData.bio : existingProfile.bio,
      avatarUrl: profileData.avatarUrl !== undefined ? profileData.avatarUrl : existingProfile.avatarUrl,
      updatedAt: new Date(),
    };

    this.profiles.set(profileId, updatedProfile);
    return updatedProfile;
  }

  async findByUserId(userId: string): Promise<Profile | null> {
    const profileId = this.userIdIndex.get(userId);
    if (!profileId) return null;
    return this.profiles.get(profileId) || null;
  }

  // Helper method for testing
  clear(): void {
    this.profiles.clear();
    this.userIdIndex.clear();
    this.idCounter = 1;
  }
}

// Book Repository Interface
export interface IBookRepository {
  create(bookData: CreateBookDTO): Promise<Book>;
  findByOpenLibraryKey(openLibraryKey: string): Promise<Book | null>;
  findById(id: string): Promise<Book | null>;
  search(query: string): Promise<Book[]>;
  findAll(): Promise<Book[]>;
}

// In-memory Book Repository Implementation
export class InMemoryBookRepository implements IBookRepository {
  private books: Map<string, Book> = new Map();
  private openLibraryKeyIndex: Map<string, string> = new Map();
  private idCounter = 1;

  async create(bookData: CreateBookDTO): Promise<Book> {
    const id = `book_${this.idCounter++}`;
    const now = new Date();
    
    const book: Book = {
      id,
      openLibraryKey: bookData.openLibraryKey,
      title: bookData.title,
      author: bookData.author,
      isbn: bookData.isbn || null,
      description: bookData.description || null,
      coverImageUrl: bookData.coverImageUrl || null,
      createdAt: now,
      updatedAt: now,
    };

    this.books.set(id, book);
    this.openLibraryKeyIndex.set(bookData.openLibraryKey, id);

    return book;
  }

  async findByOpenLibraryKey(openLibraryKey: string): Promise<Book | null> {
    const bookId = this.openLibraryKeyIndex.get(openLibraryKey);
    if (!bookId) return null;
    return this.books.get(bookId) || null;
  }

  async findById(id: string): Promise<Book | null> {
    return this.books.get(id) || null;
  }

  async search(query: string): Promise<Book[]> {
    if (!query || query.trim() === '') {
      return this.findAll();
    }

    const lowerQuery = query.toLowerCase();
    const results: Book[] = [];

    for (const book of this.books.values()) {
      const titleMatch = book.title.toLowerCase().includes(lowerQuery);
      const authorMatch = book.author.toLowerCase().includes(lowerQuery);
      
      if (titleMatch || authorMatch) {
        results.push(book);
      }
    }

    return results;
  }

  async findAll(): Promise<Book[]> {
    return Array.from(this.books.values());
  }

  // Helper method for testing
  clear(): void {
    this.books.clear();
    this.openLibraryKeyIndex.clear();
    this.idCounter = 1;
  }
}

// Review Repository Interface
export interface IReviewRepository {
  create(reviewData: CreateReviewDTO): Promise<Review>;
  update(reviewId: string, reviewData: UpdateReviewDTO): Promise<Review>;
  delete(reviewId: string): Promise<void>;
  findById(reviewId: string): Promise<Review | null>;
  findByBookId(bookId: string): Promise<Review[]>;
  findByUserId(userId: string): Promise<Review[]>;
  findByUserAndBook(userId: string, bookId: string): Promise<Review | null>;
}

// In-memory Review Repository Implementation
export class InMemoryReviewRepository implements IReviewRepository {
  private reviews: Map<string, Review> = new Map();
  private bookIdIndex: Map<string, Set<string>> = new Map();
  private userIdIndex: Map<string, Set<string>> = new Map();
  private userBookIndex: Map<string, string> = new Map();
  private idCounter = 1;

  async create(reviewData: CreateReviewDTO): Promise<Review> {
    const id = `review_${this.idCounter++}`;
    const now = new Date();
    
    const review: Review = {
      id,
      userId: reviewData.userId,
      bookId: reviewData.bookId,
      rating: reviewData.rating,
      text: reviewData.text,
      createdAt: now,
      updatedAt: now,
    };

    this.reviews.set(id, review);

    // Update book index
    if (!this.bookIdIndex.has(reviewData.bookId)) {
      this.bookIdIndex.set(reviewData.bookId, new Set());
    }
    this.bookIdIndex.get(reviewData.bookId)!.add(id);

    // Update user index
    if (!this.userIdIndex.has(reviewData.userId)) {
      this.userIdIndex.set(reviewData.userId, new Set());
    }
    this.userIdIndex.get(reviewData.userId)!.add(id);

    // Update user-book index
    const userBookKey = `${reviewData.userId}:${reviewData.bookId}`;
    this.userBookIndex.set(userBookKey, id);

    return review;
  }

  async update(reviewId: string, reviewData: UpdateReviewDTO): Promise<Review> {
    const existingReview = this.reviews.get(reviewId);
    if (!existingReview) {
      throw new Error('Review not found');
    }

    const updatedReview: Review = {
      ...existingReview,
      rating: reviewData.rating !== undefined ? reviewData.rating : existingReview.rating,
      text: reviewData.text !== undefined ? reviewData.text : existingReview.text,
      updatedAt: new Date(),
    };

    this.reviews.set(reviewId, updatedReview);
    return updatedReview;
  }

  async delete(reviewId: string): Promise<void> {
    const review = this.reviews.get(reviewId);
    if (!review) {
      throw new Error('Review not found');
    }

    // Remove from main map
    this.reviews.delete(reviewId);

    // Remove from book index
    const bookReviews = this.bookIdIndex.get(review.bookId);
    if (bookReviews) {
      bookReviews.delete(reviewId);
      if (bookReviews.size === 0) {
        this.bookIdIndex.delete(review.bookId);
      }
    }

    // Remove from user index
    const userReviews = this.userIdIndex.get(review.userId);
    if (userReviews) {
      userReviews.delete(reviewId);
      if (userReviews.size === 0) {
        this.userIdIndex.delete(review.userId);
      }
    }

    // Remove from user-book index
    const userBookKey = `${review.userId}:${review.bookId}`;
    this.userBookIndex.delete(userBookKey);
  }

  async findById(reviewId: string): Promise<Review | null> {
    return this.reviews.get(reviewId) || null;
  }

  async findByBookId(bookId: string): Promise<Review[]> {
    const reviewIds = this.bookIdIndex.get(bookId);
    if (!reviewIds) return [];

    const reviews: Review[] = [];
    for (const reviewId of reviewIds) {
      const review = this.reviews.get(reviewId);
      if (review) {
        reviews.push(review);
      }
    }
    return reviews;
  }

  async findByUserId(userId: string): Promise<Review[]> {
    const reviewIds = this.userIdIndex.get(userId);
    if (!reviewIds) return [];

    const reviews: Review[] = [];
    for (const reviewId of reviewIds) {
      const review = this.reviews.get(reviewId);
      if (review) {
        reviews.push(review);
      }
    }
    return reviews;
  }

  async findByUserAndBook(userId: string, bookId: string): Promise<Review | null> {
    const userBookKey = `${userId}:${bookId}`;
    const reviewId = this.userBookIndex.get(userBookKey);
    if (!reviewId) return null;
    return this.reviews.get(reviewId) || null;
  }

  // Helper method for testing
  clear(): void {
    this.reviews.clear();
    this.bookIdIndex.clear();
    this.userIdIndex.clear();
    this.userBookIndex.clear();
    this.idCounter = 1;
  }
}
