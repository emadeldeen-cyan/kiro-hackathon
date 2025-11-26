import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProfileService } from '../../../core/services/profile.service';
import { ReviewService } from '../../../core/services/review.service';
import { AuthService } from '../../../core/services/auth.service';
import { Profile } from '../../../core/models/profile.models';
import { ReviewWithBook } from '../../../core/models/review.models';

@Component({
  selector: 'app-profile-view',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './profile-view.html',
  styleUrl: './profile-view.scss',
})
export class ProfileView implements OnInit {
  profile?: Profile;
  reviews: ReviewWithBook[] = [];
  userId!: string;
  isOwnProfile: boolean = false;
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private profileService: ProfileService,
    private reviewService: ReviewService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const userIdParam = params.get('userId');
      if (userIdParam) {
        this.userId = userIdParam;
        this.checkIfOwnProfile();
        this.loadProfile();
        this.loadReviews();
      }
    });
  }

  private checkIfOwnProfile(): void {
    const currentUser = this.authService.getCurrentUser();
    this.isOwnProfile = currentUser?.id === this.userId;
  }

  private loadProfile(): void {
    this.profileService.getProfile(this.userId).subscribe({
      next: (profile) => {
        this.profile = profile;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to load profile';
        this.isLoading = false;
      }
    });
  }

  private loadReviews(): void {
    this.reviewService.getReviewsByUser(this.userId).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
      },
      error: (error) => {
        console.error('Failed to load reviews:', error);
      }
    });
  }

  onEditProfile(): void {
    this.router.navigate(['/profile', this.userId, 'edit']);
  }

  getStarArray(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < rating ? 1 : 0);
  }
}
