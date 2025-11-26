import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { DemoService } from './demo.service';
import { Review, ReviewWithBook, CreateReviewRequest, UpdateReviewRequest } from '../models/review.models';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  constructor(
    private apiService: ApiService,
    private demoService: DemoService
  ) {}

  /**
   * Create a new review
   */
  createReview(reviewData: CreateReviewRequest): Observable<Review> {
    if (this.demoService.isDemoMode()) {
      return this.demoService.createDemoReview(
        reviewData.bookId,
        reviewData.rating,
        reviewData.text
      );
    }
    return this.apiService.post<Review>('/reviews', reviewData);
  }

  /**
   * Update an existing review
   */
  updateReview(reviewId: string, reviewData: UpdateReviewRequest): Observable<Review> {
    if (this.demoService.isDemoMode()) {
      return this.demoService.updateDemoReview(
        reviewId,
        reviewData.rating,
        reviewData.text
      );
    }
    return this.apiService.put<Review>(`/reviews/${reviewId}`, reviewData);
  }

  /**
   * Delete a review
   */
  deleteReview(reviewId: string): Observable<void> {
    if (this.demoService.isDemoMode()) {
      return this.demoService.deleteDemoReview(reviewId);
    }
    return this.apiService.delete<void>(`/reviews/${reviewId}`);
  }

  /**
   * Get reviews for a specific book
   */
  getReviewsByBook(bookId: string): Observable<Review[]> {
    if (this.demoService.isDemoMode()) {
      return this.demoService.getDemoReviewsForBook(bookId);
    }
    return this.apiService.get<Review[]>(`/books/${bookId}/reviews`);
  }

  /**
   * Get reviews by a specific user
   */
  getReviewsByUser(userId: string): Observable<ReviewWithBook[]> {
    if (this.demoService.isDemoMode()) {
      return this.demoService.getDemoReviewsByUserWithBooks(userId);
    }
    return this.apiService.get<ReviewWithBook[]>(`/users/${userId}/reviews`);
  }
}
