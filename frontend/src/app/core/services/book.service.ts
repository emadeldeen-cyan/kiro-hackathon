import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiService } from './api.service';
import { DemoService } from './demo.service';
import { 
  Book, 
  OpenLibrarySearchResult, 
  BookSearchResult, 
  AddBookFromOpenLibraryRequest 
} from '../models/book.models';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  constructor(
    private apiService: ApiService,
    private demoService: DemoService
  ) {}

  /**
   * Search for books in OpenLibrary
   */
  searchOpenLibrary(query: string): Observable<OpenLibrarySearchResult[]> {
    const params = new HttpParams().set('q', query);
    return this.apiService.get<OpenLibrarySearchResult[]>('/books/search/openlibrary', params);
  }

  /**
   * Add a book from OpenLibrary to the local database
   */
  addBookFromOpenLibrary(openLibraryKey: string): Observable<Book> {
    const request: AddBookFromOpenLibraryRequest = { openLibraryKey };
    return this.apiService.post<Book>('/books/from-openlibrary', request);
  }

  /**
   * Get a book by ID
   */
  getBook(bookId: string): Observable<Book> {
    if (this.demoService.isDemoMode()) {
      return this.demoService.getDemoBook(bookId).pipe(
        map(book => {
          if (!book) throw new Error('Book not found');
          return book;
        })
      );
    }
    return this.apiService.get<Book>(`/books/${bookId}`);
  }

  /**
   * Search for books in the local database
   */
  searchLocalBooks(query: string = ''): Observable<BookSearchResult[]> {
    if (this.demoService.isDemoMode()) {
      if (!query) {
        return this.demoService.getDemoBooks().pipe(
          map(books => books.map(book => ({
            ...book,
            averageRating: this.calculateAverageRating(book.id)
          })))
        );
      }
      return this.demoService.searchDemoBooks(query).pipe(
        map(books => books.map(book => ({
          ...book,
          averageRating: this.calculateAverageRating(book.id)
        })))
      );
    }
    
    const params = query ? new HttpParams().set('q', query) : undefined;
    return this.apiService.get<BookSearchResult[]>('/books/search', params);
  }

  /**
   * Calculate average rating for demo books
   */
  private calculateAverageRating(bookId: string): number | null {
    // This is a simplified version for demo mode
    // In real implementation, this would be calculated from reviews
    if (bookId === 'book-1' || bookId === 'book-2') return 5;
    return null;
  }
}
