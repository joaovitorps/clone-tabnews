import orchestrator from "tests/orchestrator.js";
import user from "../../../../../../models/user";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/users/[username]", () => {
  describe("Anonymous user", () => {
    test("With exact case match", async () => {
      const userCreated = await user.create({
        username: "joaovitorPS00",
        email: "email@test123.com",
        password: "teste123",
      });

      expect(userCreated).toEqual({
        id: userCreated.id,
        username: userCreated.username,
        email: userCreated.email,
        password: userCreated.password,
        created_at: userCreated.created_at,
        updated_at: userCreated.updated_at,
      });

      const response = await fetch(
        "http://localhost:3000/api/v1/users/joaovitorPS00",
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      responseBody.created_at = new Date(responseBody.created_at);
      responseBody.updated_at = new Date(responseBody.updated_at);

      expect(responseBody).toEqual({
        id: userCreated.id,
        username: userCreated.username,
        email: userCreated.email,
        password: userCreated.password,
        created_at: userCreated.created_at,
        updated_at: userCreated.updated_at,
      });
    });
    test("With no matchin case", async () => {
      const userCreated = await user.create({
        username: "nomachingCASE",
        email: "nomachingcase@test123.com",
        password: "teste123",
      });

      expect(userCreated).toEqual({
        id: userCreated.id,
        username: userCreated.username,
        email: userCreated.email,
        password: userCreated.password,
        created_at: userCreated.created_at,
        updated_at: userCreated.updated_at,
      });

      const response = await fetch(
        "http://localhost:3000/api/v1/users/nomachingcase",
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      responseBody.created_at = new Date(responseBody.created_at);
      responseBody.updated_at = new Date(responseBody.updated_at);

      expect(responseBody).toEqual({
        id: userCreated.id,
        username: userCreated.username,
        email: userCreated.email,
        password: userCreated.password,
        created_at: userCreated.created_at,
        updated_at: userCreated.updated_at,
      });
    });
    test("With invalid username", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/users/asdasdasd",
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "O username informado não foi encontrado.",
        action: "Verifique se o username está digitado corretamente.",
        status_code: 404,
      });
    });
  });
});
