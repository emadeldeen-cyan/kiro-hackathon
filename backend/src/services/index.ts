import { User } from '../models';
import { IUserRepository } from '../repositories';
import { hashPassword, verifyPassword } from '../utils/password';

// Authentication token interface
export interface AuthToken {
  token: string;
  userId: string;
  username: string;
}

// User Service Interface
export interface IUserService {
  registerUser(username: string, email: string, password: string): Promise<User>;
  authenticateUser(username: string, password: string): Promise<AuthToken>;
  validatePassword(password: string): boolean;
}

// User Service Implementation
export class UserService implements IUserService {
  constructor(private userRepository: IUserRepository) {}

  /**
   * Validate password meets minimum requirements
   * @param password - Password to validate
   * @returns True if password is valid
   */
  validatePassword(password: string): boolean {
    return password.length >= 8;
  }

  /**
   * Register a new user with validation
   * @param username - Unique username
   * @param email - Unique email address
   * @param password - Plain text password (min 8 characters)
   * @returns Created user
   * @throws Error if validation fails or username/email already exists
   */
  async registerUser(username: string, email: string, password: string): Promise<User> {
    // Validate password length
    if (!this.validatePassword(password)) {
      throw new Error('Password must be at least 8 characters long');
    }

    // Check if username already exists
    const existingUserByUsername = await this.userRepository.findByUsername(username);
    if (existingUserByUsername) {
      throw new Error('Username already exists');
    }

    // Check if email already exists
    const existingUserByEmail = await this.userRepository.findByEmail(email);
    if (existingUserByEmail) {
      throw new Error('Email already exists');
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await this.userRepository.create({
      username,
      email,
      passwordHash,
    });

    return user;
  }

  /**
   * Authenticate a user with username and password
   * @param username - Username or email
   * @param password - Plain text password
   * @returns Authentication token
   * @throws Error if authentication fails
   */
  async authenticateUser(username: string, password: string): Promise<AuthToken> {
    // Try to find user by username first
    let user = await this.userRepository.findByUsername(username);
    
    // If not found, try by email
    if (!user) {
      user = await this.userRepository.findByEmail(username);
    }

    if (!user) {
      throw new Error('Invalid username or password');
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Invalid username or password');
    }

    // Generate token (simplified - in production use JWT)
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

    return {
      token,
      userId: user.id,
      username: user.username,
    };
  }
}
