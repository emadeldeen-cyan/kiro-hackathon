import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Review } from '../../../core/models/review.models';
import { ReviewForm } from '../review-form/review-form';

export interface ReviewDialogData {
  review: Review;
  bookId: string;
}

@Component({
  selector: 'app-review-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    ReviewForm
  ],
  templateUrl: './review-dialog.html',
  styleUrl: './review-dialog.scss',
})
export class ReviewDialog {
  constructor(
    public dialogRef: MatDialogRef<ReviewDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ReviewDialogData
  ) {}

  onReviewSubmitted(review: Review): void {
    this.dialogRef.close(review);
  }

  onCancelled(): void {
    this.dialogRef.close();
  }
}
