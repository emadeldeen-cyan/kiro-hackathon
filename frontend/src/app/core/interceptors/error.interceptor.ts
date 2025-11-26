import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
        console.error('Client-side error:', error.error.message);
      } else {
        // Server-side error
        console.error(`Server error ${error.status}:`, error.error);

        switch (error.status) {
          case 401:
            // Unauthorized - redirect to login
            errorMessage = 'Your session has expired. Please log in again.';
            notificationService.error(errorMessage);
            router.navigate(['/login']);
            break;

          case 403:
            // Forbidden
            errorMessage = error.error?.message || 'You do not have permission to perform this action.';
            notificationService.error(errorMessage);
            break;

          case 404:
            // Not Found
            errorMessage = error.error?.message || 'The requested resource was not found.';
            notificationService.error(errorMessage);
            break;

          case 409:
            // Conflict (e.g., duplicate username/email)
            errorMessage = error.error?.message || 'A conflict occurred with existing data.';
            notificationService.error(errorMessage);
            break;

          case 500:
            // Internal Server Error
            errorMessage = 'A server error occurred. Please try again later.';
            notificationService.error(errorMessage);
            break;

          case 502:
            // Bad Gateway
            errorMessage = 'Unable to connect to external service. Please try again later.';
            notificationService.error(errorMessage);
            break;

          case 503:
            // Service Unavailable
            errorMessage = 'The service is temporarily unavailable. Please try again later.';
            notificationService.error(errorMessage);
            break;

          case 504:
            // Gateway Timeout
            errorMessage = 'The request timed out. Please try again.';
            notificationService.error(errorMessage);
            break;

          default:
            errorMessage = error.error?.message || `Error ${error.status}: ${error.statusText}`;
            notificationService.error(errorMessage);
        }
      }

      return throwError(() => error);
    })
  );
};
