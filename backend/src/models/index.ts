// User model
export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDTO {
  username: string;
  email: string;
  passwordHash: string;
}

// Profile model
export interface Profile {
  id: string;
  userId: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProfileDTO {
  userId: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
}

export interface UpdateProfileDTO {
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
}

// Book model
export interface Book {
  id: string;
  openLibraryKey: string;
  title: string;
  author: string;
  isbn: string | null;
  description: string | null;
  coverImageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBookDTO {
  openLibraryKey: string;
  title: string;
  author: string;
  isbn?: string;
  description?: string;
  coverImageUrl?: string;
}

// OpenLibrary data types
export interface OpenLibrarySearchResult {
  key: string; // e.g., "/works/OL45804W"
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  isbn?: string[];
  cover_i?: number; // cover image ID
}

export interface OpenLibraryBook {
  key: string;
  title: string;
  description?: string | { value: string };
  authors?: Array<{ author: { key: string } }>;
  covers?: number[];
}
