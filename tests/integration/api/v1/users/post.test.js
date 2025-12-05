import { version as uuidVersion, validate as uuidValidate } from "uuid";

import database from "infra/database.js";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/users", () => {
  describe("Anonymous user", () => {
    test("With unique and valid data", async () => {
      const userBody = {
        username: "joaovitorps",
        email: "email@test.com",
        password: "teste123",
      };

      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userBody),
      });

      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: userBody.username,
        email: userBody.email,
        password: userBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(
        uuidValidate(responseBody.id) && uuidVersion(responseBody.id) === 4,
      ).toBe(true);

      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      const users = await database.query("SELECT * FROM users;");

      expect(users.rows.length).toBeGreaterThan(0);
    });

    test("With duplicated 'email'", async () => {
      const userBody = {
        username: "joaovitorps1",
        email: "email@test1.com",
        password: "teste123",
      };

      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userBody),
      });

      expect(response.status).toBe(201);

      const response2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "Joaovitorpss",
          email: "Email@test1.com",
          password: "teste123",
        }),
      });

      expect(response2.status).toBe(400);

      const responseBody2 = await response2.json();

      expect(responseBody2).toEqual({
        name: "ValidationError",
        message: "Email já existente na plataforma.",
        action: "Utilize outro email para realiza o cadastro.",
        status_code: 400,
      });
    });

    test("With duplicated 'username'", async () => {
      const userBody = {
        username: "joaovitorpsdp",
        email: "email@test2.com",
        password: "teste123",
      };

      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userBody),
      });

      expect(response.status).toBe(201);

      const response2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "Joaovitorpsdp",
          email: "Email@test3.com",
          password: "teste123",
        }),
      });

      expect(response2.status).toBe(400);

      const responseBody2 = await response2.json();

      expect(responseBody2).toEqual({
        name: "ValidationError",
        message: "Usuário já existente na plataforma.",
        action: "Utilize outro usuário para realiza o cadastro.",
        status_code: 400,
      });
    });
  });
});
