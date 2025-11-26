import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { forkJoin, catchError, of } from 'rxjs';
import { BookService } from '../../../core/services/book.service';
import { ReviewService } from '../../../core/services/review.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Book } from '../../../core/models/book.models';
import { Review, ReviewWithBook } from '../../../core/models/review.models';
import { ReviewForm } from '../../reviews/review-form/review-form';
import { ReviewCard } from '../../reviews/review-card/review-card';
import { ReviewDialog } from '../../reviews/review-dialog/review-dialog';
import { DeleteConfirmationDialog } from '../../reviews/delete-confirmation-dialog/delete-confirmation-dialog';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatDialogModule,
    ReviewForm,
    ReviewCard
  ],
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss']
})
export class BookDetailComponent implements OnInit {
  book: Book | null = null;
  reviews: Review[] = [];
  isLoading = true;
  errorMessage = '';
  currentUserId: string | null = null;
  userHasReviewed = false;
  showReviewForm = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private reviewService: ReviewService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const bookId = this.route.snapshot.paramMap.get('id');
    const currentUser = this.authService.getCurrentUser();
    this.currentUserId = currentUser?.id || null;

    if (!bookId) {
      this.errorMessage = 'Invalid book ID';
      this.isLoading = false;
      return;
    }

    this.loadBookDetails(bookId);
  }

  /**
   * Load book details and reviews
   */
  private loadBookDetails(bookId: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    forkJoin({
      book: this.bookService.getBook(bookId).pipe(
        catchError(error => {
          console.error('Error loading book:', error);
          return of(null);
        })
      ),
      reviews: this.reviewService.getReviewsByBook(bookId).pipe(
        catchError(error => {
          console.error('Error loading reviews:', error);
          return of([]);
        })
      )
    }).subscribe({
      next: ({ book, reviews }) => {
        if (!book) {
          this.errorMessage = 'Book not found';
        } else {
          this.book = book;
          this.reviews = reviews;
          this.checkIfUserHasReviewed();
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading book details:', error);
        this.errorMessage = 'Failed to load book details';
        this.isLoading = false;
      }
    });
  }

  /**
   * Check if current user has already reviewed this book
   */
  private checkIfUserHasReviewed(): void {
    if (!this.currentUserId) {
      this.userHasReviewed = false;
      return;
    }
    this.userHasReviewed = this.reviews.some(review => review.userId === this.currentUserId);
  }

  /**
   * Get cover image URL or placeholder
   */
  getCoverImageUrl(): string {
    return this.book?.coverImageUrl || 'assets/no-cover.png';
  }

  /**
   * Calculate average rating
   */
  getAverageRating(): number | null {
    if (this.reviews.length === 0) {
      return null;
    }
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / this.reviews.length;
  }

  /**
   * Get star rating display
   */
  getStarRating(rating: number): string {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '★'.repeat(fullStars);
    if (hasHalfStar) {
      stars += '½';
    }
    stars += '☆'.repeat(5 - Math.ceil(rating));
    return stars;
  }

  /**
   * Toggle review form visibility
   */
  writeReview(): void {
    this.showReviewForm = true;
  }

  /**
   * Handle review submission
   */
  onReviewSubmitted(review: Review): void {
    this.reviews.push(review);
    this.showReviewForm = false;
    this.checkIfUserHasReviewed();
  }

  /**
   * Handle review form cancellation
   */
  onReviewCancelled(): void {
    this.showReviewForm = false;
  }

  /**
   * Handle edit review
   */
  onEditReview(review: Review | ReviewWithBook): void {
    if (!this.book) return;

    const dialogRef = this.dialog.open(ReviewDialog, {
      width: '600px',
      data: {
        review: review,
        bookId: this.book.id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Update the review in the list
        const index = this.reviews.findIndex(r => r.id === result.id);
        if (index !== -1) {
          this.reviews[index] = result;
        }
      }
    });
  }

  /**
   * Handle delete review
   */
  onDeleteReview(review: Review | ReviewWithBook): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialog, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.reviewService.deleteReview(review.id).subscribe({
          next: () => {
            this.notificationService.success('Review deleted successfully');
            this.reviews = this.reviews.filter(r => r.id !== review.id);
            this.checkIfUserHasReviewed();
          },
          error: (error) => {
            let errorMessage = 'Failed to delete review';
            if (error.status === 403) {
              errorMessage = 'You are not authorized to delete this review';
            }
            this.notificationService.error(errorMessage);
          }
        });
      }
    });
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  /**
   * Format date for display
   */
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * TrackBy function for ngFor performance
   */
  trackByReviewId(index: number, review: Review): string {
    return review.id;
  }
}
