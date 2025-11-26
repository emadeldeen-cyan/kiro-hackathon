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

export interface OpenLibrarySearchResult {
  key: string; // e.g., "/works/OL45804W"
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  isbn?: string[];
  cover_i?: number; // cover image ID
}

export interface BookSearchResult {
  id: string;
  title: string;
  author: string;
  coverImageUrl: string | null;
  averageRating: number | null;
}

export interface AddBookFromOpenLibraryRequest {
  openLibraryKey: string;
}
