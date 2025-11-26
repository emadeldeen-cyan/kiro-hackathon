import { User, CreateUserDTO } from '../models';

// User Repository Interface
export interface IUserRepository {
  create(userData: CreateUserDTO): Promise<User>;
  findByUsername(username: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
}

// In-memory User Repository Implementation
export class InMemoryUserRepository implements IUserRepository {
  private users: Map<string, User> = new Map();
  private usernameIndex: Map<string, string> = new Map();
  private emailIndex: Map<string, string> = new Map();
  private idCounter = 1;

  async create(userData: CreateUserDTO): Promise<User> {
    const id = `user_${this.idCounter++}`;
    const now = new Date();
    
    const user: User = {
      id,
      username: userData.username,
      email: userData.email,
      passwordHash: userData.passwordHash,
      createdAt: now,
      updatedAt: now,
    };

    this.users.set(id, user);
    this.usernameIndex.set(userData.username.toLowerCase(), id);
    this.emailIndex.set(userData.email.toLowerCase(), id);

    return user;
  }

  async findByUsername(username: string): Promise<User | null> {
    const userId = this.usernameIndex.get(username.toLowerCase());
    if (!userId) return null;
    return this.users.get(userId) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const userId = this.emailIndex.get(email.toLowerCase());
    if (!userId) return null;
    return this.users.get(userId) || null;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  // Helper method for testing
  clear(): void {
    this.users.clear();
    this.usernameIndex.clear();
    this.emailIndex.clear();
    this.idCounter = 1;
  }
}
