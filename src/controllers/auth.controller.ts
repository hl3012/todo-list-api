import { Response, Request } from "express";
import userModel from "../models/user.model";
import bcrypt from "bcrypt";

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  const user = await userModel.findUserByEmail(email);

  if (user) {
    return res.status(400).json({ message: "The user email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await userModel.createUser(username, email, hashedPassword);
  return res.status(201).json({
    id: newUser.userId,
    username: newUser.username,
    email: newUser.email,
  });
};

export const login = (req: Request, res: Response) => {};

//test controller
// export const getAllUsers = async (req: Request, res: Response) => {
//     const users = await userModel.getAllUsers();
//     return res.status(200).json(users);
// }
