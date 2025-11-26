import { BookService } from './index';
import { InMemoryBookRepository } from '../repositories';
import { IOpenLibraryClient } from '../clients/openlibrary';
import { OpenLibrarySearchResult, OpenLibraryBook } from '../models';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { beforeEach } from 'node:test';
import { describe } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';
import { beforeEach } from 'node:test';
import { describe } from 'node:test';

// Mock OpenLibrary client for testing
class MockOpenLibraryClient implements IOpenLibraryClient {
  async searchBooks(query: string): Promise<OpenLibrarySearchResult[]> {
    // Match both direct search and title-based search
    if (query.includes('test-book') || query.includes('Test Book')) {
      return [
        {
          key: '/works/TEST123',
          title: 'Test Book',
          author_name: ['Test Author'],
          first_publish_year: 2020,
          isbn: ['1234567890'],
          cover_i: 12345,
        },
      ];
    }
    return [];
  }

  async getBookDetails(openLibraryKey: string): Promise<OpenLibraryBook> {
    if (openLibraryKey === '/works/TEST123') {
      return {
        key: '/works/TEST123',
        title: 'Test Book',
        description: 'A test book description',
        authors: [{ author: { key: '/authors/TEST1' } }],
        covers: [12345],
      };
    }
    throw new Error('Book not found in OpenLibrary');
  }
}

describe('BookService', () => {
  let bookService: BookService;
  let bookRepository: InMemoryBookRepository;
  let openLibraryClient: MockOpenLibraryClient;

  beforeEach(() => {
    bookRepository = new InMemoryBookRepository();
    openLibraryClient = new MockOpenLibraryClient();
    bookService = new BookService(bookRepository, openLibraryClient);
  });

  describe('searchOpenLibrary', () => {
    it('should return search results from OpenLibrary API', async () => {
      const results = await bookService.searchOpenLibrary('test-book');
      
      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('Test Book');
      expect(results[0].author_name).toEqual(['Test Author']);
      expect(results[0].key).toBe('/works/TEST123');
    });

    it('should return empty array when no results found', async () => {
      const results = await bookService.searchOpenLibrary('nonexistent');
      
      expect(results).toHaveLength(0);
    });
  });

  describe('addBookFromOpenLibrary', () => {
    it('should create a new book from OpenLibrary data', async () => {
      const book = await bookService.addBookFromOpenLibrary('/works/TEST123');
      
      expect(book.openLibraryKey).toBe('/works/TEST123');
      expect(book.title).toBe('Test Book');
      expect(book.author).toBe('Test Author');
      expect(book.isbn).toBe('1234567890');
      expect(book.description).toBe('A test book description');
      expect(book.coverImageUrl).toBe('https://covers.openlibrary.org/b/id/12345-L.jpg');
    });

    it('should return existing book if already in database', async () => {
      // Add book first time
      const book1 = await bookService.addBookFromOpenLibrary('/works/TEST123');
      
      // Add same book again
      const book2 = await bookService.addBookFromOpenLibrary('/works/TEST123');
      
      expect(book1.id).toBe(book2.id);
      expect(book1.openLibraryKey).toBe(book2.openLibraryKey);
    });

    it('should store all required OpenLibrary data fields', async () => {
      const book = await bookService.addBookFromOpenLibrary('/works/TEST123');
      
      // Verify all required fields are stored (Requirement 3.5)
      expect(book.openLibraryKey).toBeDefined();
      expect(book.title).toBeDefined();
      expect(book.author).toBeDefined();
      expect(book.isbn).toBeDefined();
      expect(book.description).toBeDefined();
      expect(book.coverImageUrl).toBeDefined();
    });
  });

  describe('getBook', () => {
    it('should retrieve a book by ID', async () => {
      const createdBook = await bookService.addBookFromOpenLibrary('/works/TEST123');
      
      const retrievedBook = await bookService.getBook(createdBook.id);
      
      expect(retrievedBook.id).toBe(createdBook.id);
      expect(retrievedBook.title).toBe('Test Book');
    });

    it('should throw error if book not found', async () => {
      await expect(bookService.getBook('nonexistent')).rejects.toThrow('Book not found');
    });
  });

  describe('searchLocalBooks', () => {
    beforeEach(async () => {
      // Add a test book to the repository
      await bookService.addBookFromOpenLibrary('/works/TEST123');
    });

    it('should search books by title', async () => {
      const results = await bookService.searchLocalBooks('Test');
      
      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('Test Book');
    });

    it('should search books by author', async () => {
      const results = await bookService.searchLocalBooks('Author');
      
      expect(results).toHaveLength(1);
      expect(results[0].author).toBe('Test Author');
    });

    it('should return all books when query is empty', async () => {
      const results = await bookService.searchLocalBooks('');
      
      expect(results).toHaveLength(1);
    });

    it('should return empty array when no matches found', async () => {
      const results = await bookService.searchLocalBooks('nonexistent');
      
      expect(results).toHaveLength(0);
    });

    it('should include all required fields in search results', async () => {
      const results = await bookService.searchLocalBooks('Test');
      
      expect(results[0]).toHaveProperty('id');
      expect(results[0]).toHaveProperty('title');
      expect(results[0]).toHaveProperty('author');
      expect(results[0]).toHaveProperty('coverImageUrl');
      expect(results[0]).toHaveProperty('averageRating');
    });
  });
});
