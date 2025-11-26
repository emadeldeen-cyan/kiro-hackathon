import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { UserService } from '../../../core/services/user.service';
import { UserWithSharedBooks } from '../../../core/models/user.models';

@Component({
  selector: 'app-find-friends',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  templateUrl: './find-friends.component.html',
  styleUrl: './find-friends.component.scss'
})
export class FindFriendsComponent implements OnInit {
  users: UserWithSharedBooks[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.userService.findUsersWithSharedBooks().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.error || 'Failed to load users';
        this.isLoading = false;
      }
    });
  }

  viewProfile(userId: string): void {
    this.router.navigate(['/profile', userId]);
  }

  viewBook(bookId: string): void {
    this.router.navigate(['/books', bookId]);
  }
}
