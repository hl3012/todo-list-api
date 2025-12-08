import { Request, Response, NextFunction } from "express";
import { TodoUpdate } from "../models/todo.model";
import { MyRequest } from "../middleware/auth.middleware";

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

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validationFields(req, res, next, [{ name: "email" }, { name: "password" }]);
};

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
  const errors = [];

  const extraKeys = Object.keys(body).filter(
    (key) => !allowedKeys.includes(key as any)
  );
  if (extraKeys.length > 0) {
    errors.push(`Extra fields in todo update: ${extraKeys.join(", ")}`);
  }

  for (const key of allowedKeys) {
    if (key in body) {
      const value = body[key];

      if (key === "completed") {
        if (typeof value !== "boolean") {
          errors.push(`Invalid value for field ${key}`);
        } else {
          result[key] = value;
        }
      } else {
        if (typeof value !== "string") {
          errors.push(`Invalid value for field ${key}`);
        } else {
          result[key] = value;
        }
      }
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  req.validatedData = result;
  next();
};

export const validationFields = (
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
