import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { BookSearchComponent } from './features/books/book-search/book-search.component';
import { LocalBooksComponent } from './features/books/local-books/local-books.component';
import { BookDetailComponent } from './features/books/book-detail/book-detail.component';
import { ProfileView } from './features/profile/profile-view/profile-view';
import { ProfileForm } from './features/profile/profile-form/profile-form';
import { UserReviews } from './features/reviews/user-reviews/user-reviews';
import { authGuard } from './core/guards/auth.guard';
import { AppLayoutComponent } from './shared/layout/app-layout.component';

export const routes: Routes = [
  // Auth routes without layout
  { 
    path: 'login', 
    component: LoginComponent 
  },
  { 
    path: 'register', 
    component: RegisterComponent 
  },
  
  // Protected routes with layout
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [authGuard],
    children: [
      { 
        path: '', 
        redirectTo: '/books/library', 
        pathMatch: 'full' 
      },
      { 
        path: 'books/search', 
        component: BookSearchComponent 
      },
      { 
        path: 'books/library', 
        component: LocalBooksComponent 
      },
      { 
        path: 'books/:id', 
        component: BookDetailComponent 
      },
      { 
        path: 'profile/:userId', 
        component: ProfileView 
      },
      { 
        path: 'profile', 
        component: ProfileForm 
      },
      { 
        path: 'reviews/my-reviews', 
        component: UserReviews 
      }
    ]
  },
  
  // Fallback route
  { 
    path: '**', 
    redirectTo: '/login' 
  }
];
