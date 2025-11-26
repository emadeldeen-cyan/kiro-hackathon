import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiService } from './api.service';
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
  constructor(private apiService: ApiService) {}

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
    return this.apiService.get<Book>(`/books/${bookId}`);
  }

  /**
   * Search for books in the local database
   */
  searchLocalBooks(query: string = ''): Observable<BookSearchResult[]> {
    const params = query ? new HttpParams().set('q', query) : undefined;
    return this.apiService.get<BookSearchResult[]>('/books/search', params);
  }
}
