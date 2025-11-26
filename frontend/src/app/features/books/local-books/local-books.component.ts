import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap, catchError, of } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BookService } from '../../../core/services/book.service';
import { BookSearchResult } from '../../../core/models/book.models';

@Component({
  selector: 'app-local-books',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './local-books.component.html',
  styleUrls: ['./local-books.component.scss']
})
export class LocalBooksComponent implements OnInit {
  searchControl = new FormControl('');
  books: BookSearchResult[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private bookService: BookService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Load all books initially
    this.loadBooks('');

    // Implement debounced search
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        this.isLoading = true;
        this.errorMessage = '';
        return this.bookService.searchLocalBooks(query || '').pipe(
          catchError(error => {
            this.errorMessage = 'Failed to search books. Please try again.';
            console.error('Local book search error:', error);
            return of([]);
          })
        );
      })
    ).subscribe(results => {
      this.books = results;
      this.isLoading = false;
    });
  }

  /**
   * Load books with optional query
   */
  private loadBooks(query: string): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.bookService.searchLocalBooks(query).pipe(
      catchError(error => {
        this.errorMessage = 'Failed to load books. Please try again.';
        console.error('Local book search error:', error);
        return of([]);
      })
    ).subscribe(results => {
      this.books = results;
      this.isLoading = false;
    });
  }

  /**
   * Get cover image URL or placeholder
   */
  getCoverImageUrl(coverUrl: string | null): string {
    return coverUrl || 'assets/no-cover.png';
  }

  /**
   * Get star rating display
   */
  getStarRating(rating: number | null): string {
    if (rating === null || rating === 0) {
      return 'No ratings yet';
    }
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '★'.repeat(fullStars);
    if (hasHalfStar) {
      stars += '½';
    }
    stars += '☆'.repeat(5 - Math.ceil(rating));
    return `${stars} (${rating.toFixed(1)})`;
  }

  /**
   * Navigate to book detail page
   */
  viewBookDetails(bookId: string): void {
    this.router.navigate(['/books', bookId]);
  }
}
