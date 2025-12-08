import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { TodoUpdate } from "../models/todo.model";

export interface MyRequest extends Request {
  userId?: string;
  validatedData?: TodoUpdate;
}

export const protectedRoute = async (
  req: MyRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Invalid or no authentication header" });
    }

    const token = authorizationHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token found" });
    }

    const payload = verifyToken(token);
    req.userId = payload.userId;
    next();
  } catch (error: any) {
    console.log("Error in protectedRoute middleware", error.message);
    return res.status(401).json({ message: error.message });
  }
};
