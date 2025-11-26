import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ReviewService } from '../../../core/services/review.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Review, ReviewWithBook } from '../../../core/models/review.models';
import { ReviewCard } from '../review-card/review-card';
import { ReviewDialog } from '../review-dialog/review-dialog';
import { DeleteConfirmationDialog } from '../delete-confirmation-dialog/delete-confirmation-dialog';

@Component({
  selector: 'app-user-reviews',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    ReviewCard
  ],
  templateUrl: './user-reviews.html',
  styleUrl: './user-reviews.scss',
})
export class UserReviews implements OnInit {
  reviews: ReviewWithBook[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private reviewService: ReviewService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUserReviews();
  }

  /**
   * Load reviews for the current user
   */
  private loadUserReviews(): void {
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      this.errorMessage = 'You must be logged in to view your reviews';
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.reviewService.getReviewsByUser(currentUser.id).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading user reviews:', error);
        this.errorMessage = 'Failed to load your reviews';
        this.isLoading = false;
      }
    });
  }

  /**
   * Handle edit review
   */
  onEditReview(review: Review | ReviewWithBook): void {
    const dialogRef = this.dialog.open(ReviewDialog, {
      width: '600px',
      data: {
        review: review,
        bookId: review.bookId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Update the review in the list
        const index = this.reviews.findIndex(r => r.id === result.id);
        if (index !== -1) {
          this.reviews[index] = { ...this.reviews[index], ...result };
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
}
