import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';
import { afterEach } from 'node:test';
import { beforeEach } from 'node:test';
import { describe } from 'node:test';
import { InMemoryBookRepository } from './index';

describe('InMemoryBookRepository - Search Functionality', () => {
  let repository: InMemoryBookRepository;

  beforeEach(() => {
    repository = new InMemoryBookRepository();
  });

  afterEach(() => {
    repository.clear();
  });

  describe('search', () => {
    it('should perform case-insensitive search on title', async () => {
      // Create test books
      await repository.create({
        openLibraryKey: '/works/OL1',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
      });
      await repository.create({
        openLibraryKey: '/works/OL2',
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
      });

      // Search with lowercase
      const results = await repository.search('gatsby');
      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('The Great Gatsby');
    });

    it('should perform case-insensitive search on author', async () => {
      await repository.create({
        openLibraryKey: '/works/OL1',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
      });
      await repository.create({
        openLibraryKey: '/works/OL2',
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
      });

      // Search with mixed case
      const results = await repository.search('HARPER');
      expect(results).toHaveLength(1);
      expect(results[0].author).toBe('Harper Lee');
    });

    it('should return all books when query is empty string', async () => {
      await repository.create({
        openLibraryKey: '/works/OL1',
        title: 'Book One',
        author: 'Author One',
      });
      await repository.create({
        openLibraryKey: '/works/OL2',
        title: 'Book Two',
        author: 'Author Two',
      });
      await repository.create({
        openLibraryKey: '/works/OL3',
        title: 'Book Three',
        author: 'Author Three',
      });

      const results = await repository.search('');
      expect(results).toHaveLength(3);
    });

    it('should return all books when query is whitespace only', async () => {
      await repository.create({
        openLibraryKey: '/works/OL1',
        title: 'Book One',
        author: 'Author One',
      });
      await repository.create({
        openLibraryKey: '/works/OL2',
        title: 'Book Two',
        author: 'Author Two',
      });

      const results = await repository.search('   ');
      expect(results).toHaveLength(2);
    });

    it('should return empty array when no matches found', async () => {
      await repository.create({
        openLibraryKey: '/works/OL1',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
      });

      const results = await repository.search('nonexistent');
      expect(results).toHaveLength(0);
    });

    it('should match partial strings in title or author', async () => {
      await repository.create({
        openLibraryKey: '/works/OL1',
        title: 'Harry Potter and the Philosopher\'s Stone',
        author: 'J.K. Rowling',
      });

      const titleResults = await repository.search('Potter');
      expect(titleResults).toHaveLength(1);

      const authorResults = await repository.search('Rowling');
      expect(authorResults).toHaveLength(1);
    });
  });
});
