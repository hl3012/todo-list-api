import { Request, Response } from "express";
import { Filters, TodoModel } from "./../models/todo.model";
import { MyRequest } from "../middleware/auth.middleware";
import { TodoUpdate } from "../models/todo.model";

export const createTodo = async (req: MyRequest, res: Response) => {
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
};

export const deleteTodo = async (req: MyRequest, res: Response) => {
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
};

export const updateTodo = async (req: MyRequest, res: Response) => {
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
};

export const getAllTodos = async (req: MyRequest, res: Response) => {
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
};
