import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { DemoService } from './demo.service';
import { AuthToken, LoginRequest, RegisterRequest, User } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';
  
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private demoService: DemoService
  ) {}

  /**
   * Register a new user
   */
  register(username: string, email: string, password: string): Observable<AuthToken> {
    // Use demo mode if enabled
    if (this.demoService.isDemoMode()) {
      return this.demoService.demoRegister(username, email, password).pipe(
        tap(response => this.setSession(response))
      );
    }
    
    const request: RegisterRequest = { username, email, password };
    return this.apiService.post<AuthToken>('/auth/register', request).pipe(
      tap(response => this.setSession(response))
    );
  }

  /**
   * Login with username and password
   */
  login(username: string, password: string): Observable<AuthToken> {
    // Use demo mode if enabled
    if (this.demoService.isDemoMode()) {
      return this.demoService.demoLogin(username, password).pipe(
        tap(response => this.setSession(response))
      );
    }
    
    const request: LoginRequest = { username, password };
    return this.apiService.post<AuthToken>('/auth/login', request).pipe(
      tap(response => this.setSession(response))
    );
  }

  /**
   * Enable demo mode
   */
  enableDemoMode(): void {
    this.demoService.enableDemoMode();
  }

  /**
   * Disable demo mode
   */
  disableDemoMode(): void {
    this.demoService.disableDemoMode();
  }

  /**
   * Check if demo mode is enabled
   */
  isDemoMode(): boolean {
    return this.demoService.isDemoMode();
  }

  /**
   * Logout the current user
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Get the current JWT token
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Get the current user
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Set authentication session
   */
  private setSession(authResult: AuthToken): void {
    localStorage.setItem(this.TOKEN_KEY, authResult.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(authResult.user));
    this.currentUserSubject.next(authResult.user);
  }

  /**
   * Get user from localStorage
   */
  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch {
        return null;
      }
    }
    return null;
  }
}
