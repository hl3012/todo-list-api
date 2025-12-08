import { Router } from "express";
import {
  createTodo,
  deleteTodo,
  getAllTodos,
  updateTodo,
} from "../controllers/todo.controller";
import { protectedRoute } from "../middleware/auth.middleware";
import { validateCreateTodo, validateUpdateTodo } from "../middleware/validation";

const router = Router();

//all users can create and search todos by filters
router.get("/", protectedRoute, getAllTodos);
router.post("/", protectedRoute, validateCreateTodo, createTodo);

//only creater can update and delete
router.delete("/:id", protectedRoute, deleteTodo);
router.put("/:id", protectedRoute, validateUpdateTodo, updateTodo);

export default router;
