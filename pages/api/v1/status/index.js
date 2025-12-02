import { createRouter } from "next-connect";

import database from "infra/database.js";
import controller from "infra/controller.js";

const router = createRouter();

router
  .use(async (request, event, next) => {
    const start = Date.now();
    await next();
    const end = Date.now();
    console.log(`Request took ${end - start}ms`);
  })
  .get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const dbMaxConnectionsResult = await database.query("SHOW max_connections;");
  const dbMaxConnectionsValue = dbMaxConnectionsResult.rows[0].max_connections;

  const dbName = process.env.POSTGRES_DB;

  const dbOpenedConnectionsResult = await database.query({
    text: "SELECT count(*)::int opened_connections FROM pg_stat_activity WHERE datname = $1;",
    values: [dbName],
  });

  const dbOpenedConnectionsValue =
    dbOpenedConnectionsResult.rows[0].opened_connections;

  const dbVersionResult = await database.query("SHOW server_version;");
  const dbVersionValue = dbVersionResult.rows[0].server_version;

  return response.status(200).json({
    updated_at: new Date().toISOString(),
    dependencies: {
      database: {
        max_connections: parseInt(dbMaxConnectionsValue),
        opened_connections: dbOpenedConnectionsValue,
        version: dbVersionValue,
      },
    },
  });
}
