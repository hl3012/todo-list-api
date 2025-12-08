interface User {
  userId: string;
  username: string;
  email: string;
  hashedPassword: string;
  createdAt: Date;
}

//all used async to simulate the database req
export class UserModel {
  private static users: User[] = [];

  static async findUserByEmail(email: string) {
    return this.users.find((user) => user.email === email);
  }

  static async findUserById(userId: string) {
    return this.users.find((user) => user.userId === userId);
  }

  static async findUserByUsername(username: string) {
    return this.users.find((user) => user.username === username);
  }

  // //test
  // static async getAllUsers() {
  //     return this.users;
  // }

  static async createUser(
    username: string,
    email: string,
    hashedPassword: string
  ): Promise<User> {
    const newUser: User = {
      userId: Date.now().toString(),
      username: username,
      email,
      hashedPassword,
      createdAt: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }

  static reset() {
    this.users = [];
  }
}
