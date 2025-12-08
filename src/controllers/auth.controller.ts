import { Response, Request, NextFunction } from "express";
import bcrypt from "bcrypt";
import { UserModel } from "../models/user.model";
import { generateToken } from "../utils/jwt";

/**
 * Controller to handle user registration
 * - Registers a new user with an unduplicated email
 * - Hashes the password before storing
 * - Validation of input is handled by middleware
 * - Sensitive data like hashedPassword is never returned
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password } = req.body;

    const user = await UserModel.findUserByEmail(email);
    if (user) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.createUser(username, email, hashedPassword);

    // exclude sentive data
    return res.status(201).json({
      user: {
        id: newUser.userId,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to handle user login
 * - Validates user email and password
 * - Generates JWT token if login is successful
 * - Same error message is returned for security
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findUserByEmail(email);

    //return same error message
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user.userId);

    return res.status(200).json({
      token,
      user: {
        id: user.userId,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};
