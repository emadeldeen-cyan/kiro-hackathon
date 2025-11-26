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

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'books/search', component: BookSearchComponent, canActivate: [authGuard] },
  { path: 'books/library', component: LocalBooksComponent, canActivate: [authGuard] },
  { path: 'books/:id', component: BookDetailComponent, canActivate: [authGuard] },
  { path: 'profile/:userId', component: ProfileView, canActivate: [authGuard] },
  { path: 'profile', component: ProfileForm, canActivate: [authGuard] },
  { path: 'reviews/my-reviews', component: UserReviews, canActivate: [authGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
