import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap, catchError, of, finalize } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BookService } from '../../../core/services/book.service';
import { NotificationService } from '../../../core/services/notification.service';
import { OpenLibrarySearchResult } from '../../../core/models/book.models';

@Component({
  selector: 'app-book-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss']
})
export class BookSearchComponent implements OnInit {
  searchControl = new FormControl('');
  searchResults: OpenLibrarySearchResult[] = [];
  isLoading = false;
  errorMessage = '';
  addingBookKey: string | null = null;

  constructor(
    private bookService: BookService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Implement debounced search
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        if (!query || query.trim().length === 0) {
          return of([]);
        }
        this.isLoading = true;
        this.errorMessage = '';
        return this.bookService.searchOpenLibrary(query.trim()).pipe(
          catchError(error => {
            this.errorMessage = 'Failed to search OpenLibrary. Please try again.';
            console.error('OpenLibrary search error:', error);
            return of([]);
          })
        );
      })
    ).subscribe(results => {
      this.searchResults = results;
      this.isLoading = false;
    });
  }

  /**
   * Get cover image URL for a book
   */
  getCoverImageUrl(coverId: number | undefined): string {
    if (!coverId) {
      return 'assets/no-cover.png';
    }
    return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
  }

  /**
   * Get the first author name
   */
  getAuthorName(authorNames: string[] | undefined): string {
    return authorNames && authorNames.length > 0 ? authorNames[0] : 'Unknown Author';
  }

  /**
   * Handle adding a book to the library
   */
  addToLibrary(book: OpenLibrarySearchResult): void {
    if (this.addingBookKey) {
      return; // Prevent multiple simultaneous additions
    }

    this.addingBookKey = book.key;
    this.errorMessage = '';

    this.bookService.addBookFromOpenLibrary(book.key).pipe(
      finalize(() => {
        this.addingBookKey = null;
      })
    ).subscribe({
      next: (addedBook) => {
        this.notificationService.success('Book added to library successfully!');
        // Navigate to book detail page
        this.router.navigate(['/books', addedBook.id]);
      },
      error: (error) => {
        console.error('Error adding book:', error);
        if (error.status === 409) {
          // Book already exists
          this.notificationService.info('This book is already in the library.');
          // Optionally navigate to the existing book
          if (error.error?.book?.id) {
            this.router.navigate(['/books', error.error.book.id]);
          }
        } else {
          this.notificationService.error('Failed to add book to library. Please try again.');
        }
      }
    });
  }

  /**
   * Check if a book is currently being added
   */
  isAddingBook(book: OpenLibrarySearchResult): boolean {
    return this.addingBookKey === book.key;
  }

  /**
   * TrackBy function for ngFor performance
   */
  trackByKey(index: number, book: OpenLibrarySearchResult): string {
    return book.key;
  }
}
