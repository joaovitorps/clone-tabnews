import database from "infra/database";

const resetDatabase = async () => {
  await database.query("drop schema public cascade; create schema public;");
}

beforeAll(resetDatabase)

test("Any HTTP method other than GET or POST should return 405 with a message", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "DELETE"
  });
  expect(response.status).toBe(405);
});