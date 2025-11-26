export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthToken {
  token: string;
  user: User;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}
