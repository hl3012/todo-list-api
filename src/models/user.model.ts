import { v4 as uuidv4 } from "uuid";

/**
 * Represent a user in this system
 */
export interface User {
  userId: string;
  username: string;
  email: string;
  hashedPassword: string;
  createdAt: Date;
}

/**
 * In-memory user repository for managing users
 * - Uses async methods to simulate database operations
 * - Can be replaced with a real database in production
 */
export class UserModel {
  /** In-memory storage for users */
  private static users: User[] = [];

  /** Find user by email */
  static async findUserByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) || null;
  }

  /** Find user by userId */
  static async findUserByUserId(userId: string): Promise<User | null> {
    return this.users.find((user) => user.userId === userId) || null;
  }

  /** Find user by username */
  static async findUserByUsername(username: string): Promise<User | null> {
    return this.users.find((user) => user.username === username) || null;
  }

  /**
   * Create a new user and store in memory
   * @param username - the username of the new user
   * @param email - the email address of the new user
   * @param hashedPassword - the hashed password of the new user
   * @returns Promise resolving to the newly created user
   */
  static async createUser(
    username: string,
    email: string,
    hashedPassword: string
  ): Promise<User> {
    const newUser: User = {
      userId: uuidv4(),
      username,
      email,
      hashedPassword,
      createdAt: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }

  /**
   * Clear all users (testing use)
   */
  static async reset() {
    this.users = [];
  }
}
