import { Router } from "express";
import {
  createTodo,
  deleteTodo,
  searchTodos,
  updateTodo,
} from "../controllers/todo.controller";
import { protectedRoute } from "../middleware/auth.middleware";
import { validateCreateTodo, validateUpdateTodo } from "../middleware/validation";

const router = Router();

//all registered users can create and search todos by optional filters
//visitor can't access todos
router.get("/", protectedRoute, searchTodos);
router.post("/", protectedRoute, validateCreateTodo, createTodo);

//only creater can update and delete
router.delete("/:id", protectedRoute, deleteTodo);
router.put("/:id", protectedRoute, validateUpdateTodo, updateTodo);

export default router;
