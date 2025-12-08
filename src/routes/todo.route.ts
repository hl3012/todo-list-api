import { Router } from "express";
import {
  createTodo,
  deleteTodo,
  getAllTodos,
  updateTodo,
} from "../controllers/todo.controller";
import { protectedRoute } from "../middleware/auth.middleware";
import { validateCreateTodo, validateUpdateTodo } from "../utils/validation";

const router = Router();

//public route
router.get("/", getAllTodos);

//only user can access
router.post("/", protectedRoute, validateCreateTodo, createTodo);
router.delete("/:id", protectedRoute, deleteTodo);
router.put("/:id", protectedRoute, validateUpdateTodo, updateTodo);

export default router;
