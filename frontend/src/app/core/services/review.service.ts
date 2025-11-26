import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Review, ReviewWithBook, CreateReviewRequest, UpdateReviewRequest } from '../models/review.models';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  constructor(private apiService: ApiService) {}

  /**
   * Create a new review
   */
  createReview(reviewData: CreateReviewRequest): Observable<Review> {
    return this.apiService.post<Review>('/reviews', reviewData);
  }

  /**
   * Update an existing review
   */
  updateReview(reviewId: string, reviewData: UpdateReviewRequest): Observable<Review> {
    return this.apiService.put<Review>(`/reviews/${reviewId}`, reviewData);
  }

  /**
   * Delete a review
   */
  deleteReview(reviewId: string): Observable<void> {
    return this.apiService.delete<void>(`/reviews/${reviewId}`);
  }

  /**
   * Get reviews for a specific book
   */
  getReviewsByBook(bookId: string): Observable<Review[]> {
    return this.apiService.get<Review[]>(`/books/${bookId}/reviews`);
  }

  /**
   * Get reviews by a specific user
   */
  getReviewsByUser(userId: string): Observable<ReviewWithBook[]> {
    return this.apiService.get<ReviewWithBook[]>(`/users/${userId}/reviews`);
  }
}
