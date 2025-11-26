export interface Review {
  id: string;
  userId: string;
  bookId: string;
  rating: number;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewWithBook extends Review {
  book: {
    id: string;
    title: string;
    author: string;
    isbn: string | null;
    coverImageUrl: string | null;
  };
}

export interface CreateReviewRequest {
  bookId: string;
  rating: number;
  text: string;
}

export interface UpdateReviewRequest {
  rating?: number;
  text?: string;
}
