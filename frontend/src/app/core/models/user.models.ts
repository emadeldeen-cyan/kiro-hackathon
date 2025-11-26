export interface UserWithSharedBooks {
  userId: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  sharedBooks: SharedBook[];
  sharedBooksCount: number;
}

export interface SharedBook {
  bookId: string;
  title: string;
  authors: string[];
  coverUrl?: string;
}
