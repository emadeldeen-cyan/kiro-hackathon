import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProfileService } from '../../../core/services/profile.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Profile, CreateProfileRequest, UpdateProfileRequest } from '../../../core/models/profile.models';

@Component({
  selector: 'app-profile-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './profile-form.html',
  styleUrl: './profile-form.scss',
})
export class ProfileForm implements OnInit {
  @Input() profile?: Profile;
  @Input() userId?: string;
  @Output() profileSaved = new EventEmitter<Profile>();
  
  profileForm!: FormGroup;
  errorMessage: string = '';
  isSubmitting: boolean = false;
  isLoading: boolean = true;
  currentUserId: string = '';

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get userId from input or current user
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.errorMessage = 'You must be logged in to edit your profile';
      this.isLoading = false;
      return;
    }
    
    this.currentUserId = this.userId || currentUser.id;
    this.loadProfile();
  }

  private loadProfile(): void {
    this.profileService.getProfile(this.currentUserId).subscribe({
      next: (profile) => {
        this.profile = profile;
        this.initializeForm();
        this.isLoading = false;
      },
      error: (error) => {
        // Profile doesn't exist yet, that's okay
        if (error.status === 404) {
          this.initializeForm();
          this.isLoading = false;
        } else {
          this.errorMessage = 'Failed to load profile';
          this.isLoading = false;
        }
      }
    });
  }

  private initializeForm(): void {
    this.profileForm = this.fb.group({
      displayName: [
        this.profile?.displayName || '',
        [Validators.required, Validators.maxLength(100)]
      ],
      bio: [this.profile?.bio || ''],
      avatarUrl: [this.profile?.avatarUrl || '']
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const formValue = this.profileForm.value;

    if (this.profile) {
      // Update existing profile
      const updateData: UpdateProfileRequest = {
        displayName: formValue.displayName,
        bio: formValue.bio || undefined,
        avatarUrl: formValue.avatarUrl || undefined
      };

      this.profileService.updateProfile(this.currentUserId, updateData).subscribe({
        next: (profile) => {
          this.isSubmitting = false;
          this.notificationService.success('Profile updated successfully');
          this.profileSaved.emit(profile);
          // Navigate to profile view if used as standalone route
          if (!this.userId) {
            this.router.navigate(['/profile', this.currentUserId]);
          }
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = error.error?.message || 'Failed to update profile';
        }
      });
    } else {
      // Create new profile
      const createData: CreateProfileRequest = {
        displayName: formValue.displayName,
        bio: formValue.bio || undefined,
        avatarUrl: formValue.avatarUrl || undefined
      };

      this.profileService.createProfile(this.currentUserId, createData).subscribe({
        next: (profile) => {
          this.isSubmitting = false;
          this.notificationService.success('Profile created successfully');
          this.profileSaved.emit(profile);
          // Navigate to profile view if used as standalone route
          if (!this.userId) {
            this.router.navigate(['/profile', this.currentUserId]);
          }
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = error.error?.message || 'Failed to create profile';
        }
      });
    }
  }

  get displayName() {
    return this.profileForm.get('displayName');
  }

  get bio() {
    return this.profileForm.get('bio');
  }

  get avatarUrl() {
    return this.profileForm.get('avatarUrl');
  }
}
