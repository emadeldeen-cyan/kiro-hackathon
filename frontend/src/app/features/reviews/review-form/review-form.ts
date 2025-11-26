import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ReviewService } from '../../../core/services/review.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Review } from '../../../core/models/review.models';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './review-form.html',
  styleUrl: './review-form.scss',
})
export class ReviewForm implements OnInit {
  @Input() bookId!: string;
  @Input() existingReview?: Review;
  @Input() mode: 'create' | 'edit' = 'create';
  @Output() reviewSubmitted = new EventEmitter<Review>();
  @Output() cancelled = new EventEmitter<void>();

  reviewForm!: FormGroup;
  isSubmitting = false;
  ratings = [1, 2, 3, 4, 5];

  constructor(
    private fb: FormBuilder,
    private reviewService: ReviewService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.reviewForm = this.fb.group({
      rating: [
        this.existingReview?.rating || null,
        [Validators.required, Validators.min(1), Validators.max(5)]
      ],
      text: [
        this.existingReview?.text || '',
        [Validators.required]
      ]
    });
  }

  onSubmit(): void {
    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formValue = this.reviewForm.value;

    if (this.mode === 'create') {
      this.createReview(formValue);
    } else {
      this.updateReview(formValue);
    }
  }

  private createReview(formValue: any): void {
    this.reviewService.createReview({
      bookId: this.bookId,
      rating: formValue.rating,
      text: formValue.text
    }).subscribe({
      next: (review) => {
        this.notificationService.success('Review created successfully');
        this.reviewSubmitted.emit(review);
        this.reviewForm.reset();
        this.isSubmitting = false;
      },
      error: (error) => {
        this.handleError(error);
        this.isSubmitting = false;
      }
    });
  }

  private updateReview(formValue: any): void {
    if (!this.existingReview) {
      return;
    }

    this.reviewService.updateReview(this.existingReview.id, {
      rating: formValue.rating,
      text: formValue.text
    }).subscribe({
      next: (review) => {
        this.notificationService.success('Review updated successfully');
        this.reviewSubmitted.emit(review);
        this.isSubmitting = false;
      },
      error: (error) => {
        this.handleError(error);
        this.isSubmitting = false;
      }
    });
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  private handleError(error: any): void {
    let errorMessage = 'An error occurred';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    // Handle specific error cases
    if (error.status === 409) {
      errorMessage = 'You have already reviewed this book';
    } else if (error.status === 403) {
      errorMessage = 'You are not authorized to perform this action';
    } else if (error.status === 400) {
      errorMessage = 'Invalid review data. Please check your input.';
    }

    this.notificationService.error(errorMessage);
  }

  get rating() {
    return this.reviewForm.get('rating');
  }

  get text() {
    return this.reviewForm.get('text');
  }
}
