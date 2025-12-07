import request from "supertest";
import { getApp } from "../src/app";

describe("auth tests", () => {
  const app = getApp();

  it("should register a new user", async () => {
    const result = await request(app)
      .post("/api/auth/register")
      .send({
        username: "test",
        email: "test@example.com",
        password: "123456",
      });

    expect(result.status).toBe(201);
    expect(result.body.username).toBe("test");
    expect(result.body.email).toBe("test@example.com");
    expect(result.body).not.toHaveProperty("hashedPassword");
  });

  it("should not register a user with existing email", async () => {
    const result = await request(app)
      .post("/api/auth/register")
      .send({
        username: "test",
        email: "test@example.com",
        password: "123456",
      });

    expect(result.status).toBe(400);
    expect(result.body.message).toBe("The user email already exists");
  });

  it("should not register a user with missing fields", async () => {
    const result = await request(app)
      .post("/api/auth/register")
      .send({ email: "test@example.com", password: "123456" });

    expect(result.status).toBe(400);
    expect(result.body).toHaveProperty("errors");
    expect(result.body.errors).toContain("Username is empty");
  });

  it("should not register a user with invalid password", async () => {
    const result = await request(app)
      .post("/api/auth/register")
      .send({ username: "ada", email: "ada@example.com", password: "13456" });

    expect(result.status).toBe(400);
    expect(result.body).toHaveProperty("errors");
    expect(result.body.errors).toContain(
      "Password must be at least 6 characters long"
    );
  });
});
