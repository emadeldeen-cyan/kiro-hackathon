import { User, CreateUserDTO, Profile, CreateProfileDTO, UpdateProfileDTO } from '../models';

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

// Profile Repository Interface
export interface IProfileRepository {
  create(profileData: CreateProfileDTO): Promise<Profile>;
  update(userId: string, profileData: UpdateProfileDTO): Promise<Profile>;
  findByUserId(userId: string): Promise<Profile | null>;
}

// In-memory Profile Repository Implementation
export class InMemoryProfileRepository implements IProfileRepository {
  private profiles: Map<string, Profile> = new Map();
  private userIdIndex: Map<string, string> = new Map();
  private idCounter = 1;

  async create(profileData: CreateProfileDTO): Promise<Profile> {
    const id = `profile_${this.idCounter++}`;
    const now = new Date();
    
    const profile: Profile = {
      id,
      userId: profileData.userId,
      displayName: profileData.displayName,
      bio: profileData.bio || null,
      avatarUrl: profileData.avatarUrl || null,
      createdAt: now,
      updatedAt: now,
    };

    this.profiles.set(id, profile);
    this.userIdIndex.set(profileData.userId, id);

    return profile;
  }

  async update(userId: string, profileData: UpdateProfileDTO): Promise<Profile> {
    const profileId = this.userIdIndex.get(userId);
    if (!profileId) {
      throw new Error('Profile not found');
    }

    const existingProfile = this.profiles.get(profileId);
    if (!existingProfile) {
      throw new Error('Profile not found');
    }

    const updatedProfile: Profile = {
      ...existingProfile,
      displayName: profileData.displayName !== undefined ? profileData.displayName : existingProfile.displayName,
      bio: profileData.bio !== undefined ? profileData.bio : existingProfile.bio,
      avatarUrl: profileData.avatarUrl !== undefined ? profileData.avatarUrl : existingProfile.avatarUrl,
      updatedAt: new Date(),
    };

    this.profiles.set(profileId, updatedProfile);
    return updatedProfile;
  }

  async findByUserId(userId: string): Promise<Profile | null> {
    const profileId = this.userIdIndex.get(userId);
    if (!profileId) return null;
    return this.profiles.get(profileId) || null;
  }

  // Helper method for testing
  clear(): void {
    this.profiles.clear();
    this.userIdIndex.clear();
    this.idCounter = 1;
  }
}
