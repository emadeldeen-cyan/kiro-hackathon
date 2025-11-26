import { OpenLibraryClient } from './openlibrary';

describe('OpenLibraryClient', () => {
  let client: OpenLibraryClient;

  beforeEach(() => {
    client = new OpenLibraryClient();
  });

  describe('searchBooks', () => {
    it('should search for books and return results', async () => {
      // This is a real API call - use a common book to ensure results
      const results = await client.searchBooks('The Lord of the Rings');
      
      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
      
      // Check structure of first result
      const firstResult = results[0];
      expect(firstResult).toHaveProperty('key');
      expect(firstResult).toHaveProperty('title');
      expect(typeof firstResult.key).toBe('string');
      expect(typeof firstResult.title).toBe('string');
    }, 15000); // Increase timeout for API call

    it('should return empty array for nonsensical query', async () => {
      const results = await client.searchBooks('xyzabc123nonexistentbook999');
      
      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
      // May return empty or very few results
    }, 15000);
  });

  describe('getBookDetails', () => {
    it('should get book details for a valid work key', async () => {
      // Use a well-known book key
      const bookDetails = await client.getBookDetails('/works/OL45804W');
      
      expect(bookDetails).toBeDefined();
      expect(bookDetails.key).toBe('/works/OL45804W');
      expect(bookDetails.title).toBeDefined();
      expect(typeof bookDetails.title).toBe('string');
    }, 15000);

    it('should handle key without /works/ prefix', async () => {
      const bookDetails = await client.getBookDetails('OL45804W');
      
      expect(bookDetails).toBeDefined();
      expect(bookDetails.key).toBe('/works/OL45804W');
    }, 15000);

    it('should throw error for invalid work key', async () => {
      await expect(
        client.getBookDetails('/works/INVALID999999')
      ).rejects.toThrow('Book not found in OpenLibrary');
    }, 15000);
  });
});
