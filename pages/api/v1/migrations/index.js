import runner from "node-pg-migrate";
import { resolve } from "node:path";
import { createRouter } from "next-connect";

import database from "infra/database.js";
import controller from "infra/controller.js";
import { ServiceError } from "infra/errors";

const router = createRouter();

router
  .use(async (request, event, next) => {
    let dbNewClient;
    try {
      dbNewClient = await database.getNewClient();
      request.migrationConfig = {
        dbClient: dbNewClient,
        dir: resolve("infra", "migrations"),
        direction: "up",
        dryRun: true,
        verbose: true,
        migrationsTable: "pgmigrations",
      };

      await next();
    } catch (error) {
      throw new ServiceError({
        message: "DB error",
        cause: error,
      });
    } finally {
      dbNewClient?.end();
    }
  })
  .get(getHandler)
  .post(postHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const pendingMigrations = await runner({
    ...request.migrationConfig,
  });

  return response.status(200).json(pendingMigrations);
}

async function postHandler(request, response) {
  const migratedMigrations = await runner({
    ...request.migrationConfig,
    dryRun: false,
  });

  if (migratedMigrations.length > 0) {
    return response.status(201).json(migratedMigrations);
  }

  return response.status(200).json(migratedMigrations);
}
