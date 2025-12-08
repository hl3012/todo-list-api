import request from "supertest";
import { getApp } from "../src/app";

describe("auth tests", () => {
  const app = getApp();

  it("should register a new user", async () => {
    const result = await request(app).post("/api/auth/register").send({
      username: "test",
      email: "test@example.com",
      password: "123456",
    });

    expect(result.status).toBe(201);
    expect(result.body.user.username).toBe("test");
    expect(result.body.user.email).toBe("test@example.com");
    expect(result.body.user).not.toHaveProperty("hashedPassword");
  });

  it("should not register a user with existing email", async () => {
    const result = await request(app).post("/api/auth/register").send({
      username: "test",
      email: "test@example.com",
      password: "123456",
    });

    expect(result.status).toBe(400);
    expect(result.body.message).toBe("Email is already registered");
  });

  it("should not register a user with missing fields", async () => {
    const result = await request(app)
      .post("/api/auth/register")
      .send({ email: "test@example.com", password: "123456" });

    expect(result.status).toBe(400);
    expect(result.body).toHaveProperty("errors");
    expect(result.body.errors.username).toBe("username is empty");
  });

  it("should not register a user with invalid password", async () => {
    const result = await request(app)
      .post("/api/auth/register")
      .send({ username: "ada", email: "ada@example.com", password: "13456" });

    expect(result.status).toBe(400);
    expect(result.body).toHaveProperty("errors");
    expect(result.body.errors.password).toBe(
      "password must be at least 6 characters long"
    );
  });

  it("should log in a user", async () => {
    const result = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "123456" });

    expect(result.status).toBe(200);
    expect(result.body).toHaveProperty("token");
    expect(result.body).toHaveProperty("user");
  });

  it("should not log in a user with invalid password", async () => {
    const result = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "1234567" });

    expect(result.status).toBe(401);
    expect(result.body.message).toBe("Invalid email or password");
  });

  it("should not log in a user with missing fields", async () => {
    const result = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com" });

    expect(result.status).toBe(400);
    expect(result.body).toHaveProperty("errors");
    expect(result.body.errors.password).toBe("password is empty");
  });

  it("should not log in a user not registered", async () => {
    const result = await request(app)
      .post("/api/auth/login")
      .send({ email: "ada@example.com", password: "123456" });

    expect(result.status).toBe(401);
    expect(result.body.message).toBe("Invalid email or password");
  });
});
