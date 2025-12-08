import { Request, Response, NextFunction } from "express";
import { TodoUpdate } from "../models/todo.model";
import { MyRequest } from "../middleware/auth.middleware";

export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password } = req.body;
  const errors = [];

  //validate username
  if (!username || username.trim().length === 0) {
    errors.push("Username is empty");
  } else if (username.trim().length < 3) {
    errors.push("Username must be at least 3 characters");
  }

  //validate password
  if (!password || password.trim().length === 0) {
    errors.push("Password is empty");
  } else if (password.trim().length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  //validate email
  if (!email || email.trim().length === 0) {
    errors.push("Email is empty");
  } else if (!email.includes("@")) {
    errors.push("Email is invalid");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  const errors = [];

  if (!password || password.trim().length === 0) {
    errors.push("Password is empty");
  }

  //validate email
  if (!email || email.trim().length === 0) {
    errors.push("Email is empty");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

export const validateCreateTodo = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, description, category } = req.body;
  const errors = [];

  if (!title || title.trim().length === 0) {
    errors.push("Title is empty");
  }

  if (!description || description.trim().length === 0) {
    errors.push("Description is empty");
  }

  if (!category || category.trim().length === 0) {
    errors.push("Category is empty");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
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
