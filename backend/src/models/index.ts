// User model
export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDTO {
  username: string;
  email: string;
  passwordHash: string;
}

// Profile model
export interface Profile {
  id: string;
  userId: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProfileDTO {
  userId: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
}

export interface UpdateProfileDTO {
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
}
