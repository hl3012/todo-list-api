import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { TodoUpdate } from "../models/todo.model";

/**
 * Extends the Request to include user-specific properties
 */
export interface MyRequest extends Request {
  /** ID of the anthenticated user, set after token verification*/
  userId?: string;
  /** Fields to update for a todo, set after validation */
  validatedData?: TodoUpdate;
}

/**
 * Middleware to protect routes by verifying JWT token
 * @remarks
 * - Return 401 unauthorized if token is missing, invalid, expired or etc.
 * - Attach req.userId for use in subsequent route handlers
 */
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
