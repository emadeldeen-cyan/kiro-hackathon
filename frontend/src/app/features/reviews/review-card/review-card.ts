import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Review, ReviewWithBook } from '../../../core/models/review.models';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-review-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './review-card.html',
  styleUrl: './review-card.scss',
})
export class ReviewCard {
  @Input() review!: Review | ReviewWithBook;
  @Input() showBookInfo = false;
  @Input() reviewerName?: string;
  @Output() editClicked = new EventEmitter<Review | ReviewWithBook>();
  @Output() deleteClicked = new EventEmitter<Review | ReviewWithBook>();

  constructor(private authService: AuthService) {}

  get isOwner(): boolean {
    const currentUser = this.authService.getCurrentUser();
    return currentUser?.id === this.review.userId;
  }

  get stars(): number[] {
    return Array(5).fill(0).map((_, i) => i + 1);
  }

  isStarFilled(star: number): boolean {
    return star <= this.review.rating;
  }

  onEdit(): void {
    this.editClicked.emit(this.review);
  }

  onDelete(): void {
    this.deleteClicked.emit(this.review);
  }

  get bookInfo(): any {
    return (this.review as ReviewWithBook).book;
  }
}
