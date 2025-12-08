import { Request, Response, NextFunction } from "express";

/**
 * Middleware to handle unexpected error
 * @remarks
 * - Most of errors are handled in other layers
 * - Uses this to handle unexpected errors for safety
 */
export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Unexpected error:", err);
  res.status(500).json({ error: "Internal Server Error" });
};
