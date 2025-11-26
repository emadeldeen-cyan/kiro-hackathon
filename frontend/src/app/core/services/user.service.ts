import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { UserWithSharedBooks } from '../models/user.models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private apiService: ApiService) {}

  /**
   * Find users who have reviewed the same books as the authenticated user
   */
  findUsersWithSharedBooks(): Observable<UserWithSharedBooks[]> {
    return this.apiService.get<UserWithSharedBooks[]>('/users/shared-books');
  }
}
