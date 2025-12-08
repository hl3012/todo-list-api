import request from "supertest";
import { getApp } from "../src/app";
import { Express } from "express";
import { UserModel } from "../src/models/user.model";
import { TodoModel } from "../src/models/todo.model";

let token: string;
let otherToken: string;
let createdTodoId: string;
let filteredTodoId: string;
let userId: string;
const app: Express = getApp();

beforeAll(async () => {
  UserModel.reset();
  TodoModel.reset();

  await request(app).post("/api/auth/register").send({
    username: "ada",
    email: "ada@example.com",
    password: "123456",
  });

  await request(app).post("/api/auth/register").send({
    username: "yui",
    email: "yui@example.com",
    password: "123456",
  });

  const login1 = await request(app).post("/api/auth/login").send({
    email: "ada@example.com",
    password: "123456",
  });

  token = login1.body.token;
  userId = login1.body.userId;

  const login2 = await request(app).post("/api/auth/login").send({
    email: "yui@example.com",
    password: "123456",
  });

  otherToken = login2.body.token;
});

describe("POST /api/todos", () => {
  it("should return 401 if no header", async () => {
    const result = await request(app).post("/api/todos").send({
      title: "Test",
      description: "Desc",
      category: "Work",
    });

    expect(result.status).toBe(401);
    expect(result.body.message).toBe("Invalid or no authentication header");
  });

  it("should return 400 if token is invalid", async () => {
    const result = await request(app)
      .post("/api/todos")
      .set("Authorization", `Bearer ${123}`)
      .send({
        title: "Only title",
      });
    expect(result.status).toBe(401);
    expect(result.body.message).toBe("Invalid token");
  });

  it("should return 400 if fields are missing", async () => {
    const result = await request(app)
      .post("/api/todos")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Only title",
      });

    expect(result.status).toBe(400);
  });

  it("should create a todo successfully", async () => {
    const result = await request(app)
      .post("/api/todos")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "New Todo",
        description: "Test description",
        category: "Personal",
      });

    expect(result.status).toBe(201);
    createdTodoId = result.body.id;
    expect(createdTodoId).toBeDefined();
  });
});

describe("PUT /api/todos/:id", () => {
  it("should return 404 if todo does not exist", async () => {
    const result = await request(app)
      .put("/api/todos/999999")
      .set("Authorization", `Bearer ${token}`)
      .send({
        description: "Update",
      });

    expect(result.status).toBe(404);
    expect(result.body.message).toBe("Todo not found");
  });

  it("should return 403 if updating another user's todo", async () => {
    const result = await request(app)
      .put(`/api/todos/${createdTodoId}`)
      .set("Authorization", `Bearer ${otherToken}`)
      .send({
        description: "Hacked",
      });

    expect(result.status).toBe(403);
    expect(result.body.message).toBe(
      "Unauthorized, only creator can update todo"
    );
  });

  it("should return 400 if invalid fields are included", async () => {
    const result = await request(app)
      .put(`/api/todos/${createdTodoId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated title",
        invalidField: "abc",
      });

    expect(result.status).toBe(400);
  });

  it("should update todo successfully", async () => {
    const result = await request(app)
      .put(`/api/todos/${createdTodoId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated Title",
        description: "Updated description",
      });

    expect(result.status).toBe(200);
    expect(result.body.message).toBe("Todo updated successfully");
  });
});

describe("DELETE /api/todos/:id", () => {
  it("should return 404 if todo does not exist", async () => {
    const result = await request(app)
      .delete("/api/todos/123")
      .set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(404);
    expect(result.body.message).toBe("Todo not found");
  });

  it("should return 403 if deleting another user's todo", async () => {
    const result = await request(app)
      .delete(`/api/todos/${createdTodoId}`)
      .set("Authorization", `Bearer ${otherToken}`);

    expect(result.status).toBe(403);
    expect(result.body.message).toBe(
      "Unauthorized, only creator can delete todo"
    );
  });

  it("should delete todo successfully", async () => {
    const result = await request(app)
      .delete(`/api/todos/${createdTodoId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(204);
  });
});

describe("GET /api/todos", () => {
  beforeAll(async () => {
    TodoModel.reset();
    await request(app)
      .post("/api/todos")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Todo 1",
        description: "Description work 1",
        category: "work",
      });

    await request(app)
      .post("/api/todos")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Todo 2",
        description: "Description study 2",
        category: "study",
      });

    const result = await request(app)
      .post("/api/todos")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Todo 3",
        description: "Description study 3",
        category: "study",
      });

    filteredTodoId = result.body.id;
    await request(app)
      .put(`/api/todos/${filteredTodoId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        completed: true,
      });
  });

  it("should get todos", async () => {
    const response = await request(app).get("/api/todos");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(3);
  });

  it("should get todos filtered by category", async () => {
    const response = await request(app).get("/api/todos?category=work");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].category).toBe("work");
  });

  it("should get todos filtered by title", async () => {
    const response = await request(app).get("/api/todos?title=Todo 1");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].title).toBe("Todo 1");
  });

  it("should get todos filtered by description", async () => {
    const response = await request(app).get("/api/todos?description=study");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].description).toBe("Description study 2");
    expect(response.body[1].description).toBe("Description study 3");
  });

  it("should get todos filtered by complete", async () => {
    const response = await request(app).get("/api/todos?completed=true");
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].completed).toBe(true);
    expect(response.body[0].title).toBe("Todo 3");
  });

  it("should get todos filtered by title and description", async () => {
    const response = await request(app).get(
      "/api/todos?title=Todo 3&description=study"
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].title).toBe("Todo 3");
    expect(response.body[0].description).toBe("Description study 3");
  });
});
