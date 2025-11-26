import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ProfileService } from '../../../core/services/profile.service';
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
    MatCardModule
  ],
  templateUrl: './profile-form.html',
  styleUrl: './profile-form.scss',
})
export class ProfileForm implements OnInit {
  @Input() profile?: Profile;
  @Input() userId!: string;
  @Output() profileSaved = new EventEmitter<Profile>();
  
  profileForm!: FormGroup;
  errorMessage: string = '';
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
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

      this.profileService.updateProfile(this.userId, updateData).subscribe({
        next: (profile) => {
          this.isSubmitting = false;
          this.notificationService.success('Profile updated successfully');
          this.profileSaved.emit(profile);
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

      this.profileService.createProfile(this.userId, createData).subscribe({
        next: (profile) => {
          this.isSubmitting = false;
          this.notificationService.success('Profile created successfully');
          this.profileSaved.emit(profile);
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
