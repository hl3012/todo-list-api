import { v4 as uuidv4 } from "uuid";

export interface User {
  userId: string;
  username: string;
  email: string;
  hashedPassword: string;
  createdAt: Date;
}

export class UserModel {
  // static array as in-memory database
  private static users: User[] = [];

  static async findUserByEmail(email: string) {
    return this.users.find((user) => user.email === email) || null;
  }

  static async findUserByUserId(userId: string) {
    return this.users.find((user) => user.userId === userId) || null;
  }

  static async findUserByUsername(username: string) {
    return this.users.find((user) => user.username === username) || null;
  }

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
