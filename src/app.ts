import express, { Express } from "express";
import authRoutes from "./routes/auth.route";
import todoRoutes from "./routes/todo.route";
import { errorHandler } from "./middleware/error.middleware";

export const getApp = (): Express => {
  const app = express();
  app.use(express.json());

  // health check
  app.get("/api/health", (req, res) => {
    res.json({ message: "Todo API is healthy" });
  });

  // authentication
  app.use("/api/auth", authRoutes);

  // todos
  app.use("/api/todos", todoRoutes);

  // handle error
  app.use(errorHandler);

  return app;
};
