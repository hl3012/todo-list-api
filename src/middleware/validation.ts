import { Request, Response, NextFunction } from "express";
import { TodoUpdate } from "../models/todo.model";
import { MyRequest } from "../middleware/auth.middleware";

/**
 * Middleware to validate user registration request body
 * Checks if username, password and email are present and valid
 */
export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validationFields(req, res, next, [
    { name: "username", minLength: 3 },
    { name: "password", minLength: 6 },
    { name: "email" },
  ]);
};

/**
 * Middleware to validate user login request body
 * Checks if email and password are present and valid
 */
export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validationFields(req, res, next, [{ name: "email" }, { name: "password" }]);
};

/**
 * Middleware to validate todo creation request body
 * Checks if title, description and category are present and valid
 */
export const validateCreateTodo = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validationFields(req, res, next, [
    { name: "title" },
    { name: "description" },
    { name: "category" },
  ]);
};

/**
 * Middleware to validate todo update request body
 * - Only allows updating title, description, category and completed
 * - Ensures that title, description and category are valid types
 * - Attachs ToDoUpdate object to req.validatedData
 */
export const validateUpdateTodo = (
  req: MyRequest,
  res: Response,
  next: NextFunction
) => {
  const allowedKeys = [
    "title",
    "description",
    "category",
    "completed",
  ] as const;
  const body = req.body;
  const result: TodoUpdate = {};
  const errors: Record<string, string> = {};

  const extraKeys = Object.keys(body).filter(
    (key) => !allowedKeys.includes(key as any)
  );
  if (extraKeys.length > 0) {
    return res
      .status(400)
      .json({ error: `Extra fields to update todo: ${extraKeys.join(", ")}` });
  }

  for (const key of allowedKeys) {
    if (key in body) {
      const value = body[key];

      if (key === "completed") {
        if (typeof value !== "boolean") {
          errors.completed = `Invalid value for field ${key}`;
        } else {
          result[key] = value;
        }
      } else {
        if (typeof value !== "string") {
          errors[key] = `Invalid value for field ${key}`;
        } else {
          result[key] = value;
        }
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  req.validatedData = result;
  next();
};

/**
 * Helper function to validate fields in a request body
 * @param fields - Array of field names and minimum length
 * - Checks if fields are present and with valid types
 * - Supports minimum length checks for string fields
 */
const validationFields = (
  req: Request,
  res: Response,
  next: NextFunction,
  fields: Array<{
    name: string;
    minLength?: number;
  }>
) => {
  const errors: Record<string, string> = {};

  for (const field of fields) {
    const value = req.body[field.name];
    if (!value?.trim()) {
      errors[field.name] = `${field.name} is empty`;
    } else if (field.minLength && value.trim().length < field.minLength) {
      errors[
        field.name
      ] = `${field.name} must be at least ${field.minLength} characters long`;
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }
  next();
};
