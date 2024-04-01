test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();

  const ISOparsedDate = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(ISOparsedDate);

  const databasePath = responseBody.dependencies.database;
  expect(databasePath.max_connections).toBe(100);

  // expect(databasePath.opened_connections).toBeGreaterThanOrEqual(1);
  expect(databasePath.opened_connections).toBe(1);
  expect(databasePath.opened_connections).toBeLessThan(
    databasePath.max_connections,
  );

  expect(typeof databasePath.version).toBe("string");
  expect(databasePath.version).toEqual("16.0");
});

// test.only("Teste de SQL Injection", async () => {
//   const response = await fetch(
//     // "http://localhost:3000/api/v1/status?dbName=the_local_db",
//     "http://localhost:3000/api/v1/status?dbName='; SELECT pg_sleep(4) --",
//   );
// });
