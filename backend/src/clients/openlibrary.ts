import axios, { AxiosInstance, AxiosError } from 'axios';
import { OpenLibrarySearchResult, OpenLibraryBook } from '../models';

/**
 * Interface for OpenLibrary API client
 */
export interface IOpenLibraryClient {
  searchBooks(query: string): Promise<OpenLibrarySearchResult[]>;
  getBookDetails(openLibraryKey: string): Promise<OpenLibraryBook>;
}

/**
 * OpenLibrary API client implementation
 * Integrates with OpenLibrary API for book search and metadata retrieval
 */
export class OpenLibraryClient implements IOpenLibraryClient {
  private axiosInstance: AxiosInstance;
  private readonly baseUrl = 'https://openlibrary.org';
  private readonly timeout = 10000; // 10 second timeout

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      timeout: this.timeout,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'BookManagementSystem/1.0',
      },
    });
  }

  /**
   * Search for books using OpenLibrary search API
   * @param query - Search query string
   * @returns Array of search results
   * @throws Error if API request fails or times out
   */
  async searchBooks(query: string): Promise<OpenLibrarySearchResult[]> {
    try {
      const response = await this.axiosInstance.get('/search.json', {
        params: { q: query },
      });

      // Extract docs array from response
      const docs = response.data?.docs || [];
      
      // Map to our interface
      return docs.map((doc: any) => ({
        key: doc.key,
        title: doc.title,
        author_name: doc.author_name,
        first_publish_year: doc.first_publish_year,
        isbn: doc.isbn,
        cover_i: doc.cover_i,
      }));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        
        if (axiosError.code === 'ECONNABORTED' || axiosError.code === 'ETIMEDOUT') {
          throw new Error('OpenLibrary API request timed out');
        }
        
        if (axiosError.response) {
          throw new Error(`OpenLibrary API error: ${axiosError.response.status} ${axiosError.response.statusText}`);
        }
        
        if (axiosError.request) {
          throw new Error('OpenLibrary API is unavailable - network error');
        }
      }
      
      throw new Error(`Failed to search OpenLibrary: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get detailed book information using OpenLibrary works API
   * @param openLibraryKey - OpenLibrary key (e.g., "/works/OL45804W")
   * @returns Book details
   * @throws Error if API request fails or times out
   */
  async getBookDetails(openLibraryKey: string): Promise<OpenLibraryBook> {
    try {
      // Ensure key starts with /works/ if not already included
      const key = openLibraryKey.startsWith('/works/') 
        ? openLibraryKey 
        : `/works/${openLibraryKey}`;

      const response = await this.axiosInstance.get(`${key}.json`);

      const data = response.data;

      return {
        key: data.key,
        title: data.title,
        description: data.description,
        authors: data.authors,
        covers: data.covers,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        
        if (axiosError.code === 'ECONNABORTED' || axiosError.code === 'ETIMEDOUT') {
          throw new Error('OpenLibrary API request timed out');
        }
        
        if (axiosError.response?.status === 404) {
          throw new Error(`Book not found in OpenLibrary: ${openLibraryKey}`);
        }
        
        if (axiosError.response) {
          throw new Error(`OpenLibrary API error: ${axiosError.response.status} ${axiosError.response.statusText}`);
        }
        
        if (axiosError.request) {
          throw new Error('OpenLibrary API is unavailable - network error');
        }
      }
      
      throw new Error(`Failed to get book details from OpenLibrary: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
