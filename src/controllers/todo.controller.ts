import { NextFunction, Request, Response } from "express";
import { Filters, TodoModel } from "./../models/todo.model";
import { MyRequest } from "../middleware/auth.middleware";
import { TodoUpdate } from "../models/todo.model";

/**
 * Controller to handle creating a new todo item
 * - Creates a new todo item with the authenticated user
 * - Validation of input is handled by middleware
 * @remarks
 * - Only authenticated users can create a todo
 * - Auth middleware ensures that req.userId is attached
 */
export const createTodo = async (
  req: MyRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const ownerId = req.userId;
    const { title, description, category } = req.body;

    if (!ownerId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const todo = await TodoModel.create({
      ownerId,
      title,
      description,
      category,
    });
    return res.status(201).json(todo);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to handle deleting an existing todo item
 * - Deletes the todo item created by the authenticated user
 * @remarks
 * - Only authenticated user who created the todo can delete the todo
 * - Auth middleware ensures that req.userId is attached for comparison
 */
export const deleteTodo = async (
  req: MyRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const ownerId = req.userId;

    const todo = await TodoModel.findById(id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    const todoOwnerId = todo.ownerId;
    if (ownerId !== todoOwnerId) {
      return res
        .status(403)
        .json({ message: "Unauthorized, only creator can delete todo" });
    }

    await TodoModel.delete(id);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to handle updating an existing todo item
 * - Updates the todo item created by the authenticated user
 * - Validation of input is handled by middleware
 * @remarks
 * - Only authenticated user who created the todo can update the todo
 * - Auth middleware ensures that req.userId is attached for comparison
 */
export const updateTodo = async (
  req: MyRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const ownerId = req.userId;

    const todo = await TodoModel.findById(id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    const todoOwnerId = todo.ownerId;
    if (ownerId !== todoOwnerId) {
      return res
        .status(403)
        .json({ message: "Unauthorized, only creator can update todo" });
    }

    const updates: TodoUpdate = req.validatedData as TodoUpdate;
    await TodoModel.update(id, updates);

    return res.status(200).json({
      message: "Todo updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to handle getting all todo items matching the optional filters
 * - All users can view todo items, visitors cannot
 * - Returns all todo items matching the optional filters
 * @param req - Express Request, may include
 * - req.query: optional filter criteria for title, description, category, completed, ownerId
 * @return - 200 ok with an array of todo items matching the filters
 * @remarks
 * - Auth middleware ensures there is a user logged in
 * - Filters are optional, empty filters will return all todo items
 */
export const searchTodos = async (
  req: MyRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const completedParam = req.query.completed;
    const filters: Filters = {
      description: req.query.description?.toString(),
      title: req.query.title?.toString(),
      category: req.query.category?.toString(),
      completed:
        completedParam === undefined
          ? undefined
          : completedParam === "true"
          ? true
          : completedParam === "false"
          ? false
          : undefined,
      ownerId: req.query.ownerId?.toString(),
    };
    const todos = await TodoModel.findAllTodos(filters);
    return res.status(200).json(todos);
  } catch (error) {
    next(error);
  }
};
