import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Profile, CreateProfileRequest, UpdateProfileRequest } from '../models/profile.models';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(private apiService: ApiService) {}

  /**
   * Create a new profile for a user
   */
  createProfile(userId: string, profileData: CreateProfileRequest): Observable<Profile> {
    return this.apiService.post<Profile>('/profiles', profileData);
  }

  /**
   * Update an existing profile
   */
  updateProfile(userId: string, profileData: UpdateProfileRequest): Observable<Profile> {
    return this.apiService.put<Profile>(`/profiles/${userId}`, profileData);
  }

  /**
   * Get a profile by user ID
   */
  getProfile(userId: string): Observable<Profile> {
    return this.apiService.get<Profile>(`/profiles/${userId}`);
  }
}
