import runner from "node-pg-migrate";
import { resolve } from "node:path";

import database from "../infra/database";
import { ServiceError } from "../infra/errors";

async function migrationHandler(dryRun = true) {
  let dbNewClient;
  try {
    dbNewClient = await database.getNewClient();

    const migrationConfig = {
      dbClient: dbNewClient,
      dir: resolve("infra", "migrations"),
      direction: "up",
      dryRun,
      verbose: true,
      migrationsTable: "pgmigrations",
    };

    return await runner({
      ...migrationConfig,
    });
  } catch (error) {
    throw new ServiceError({
      message: "DB error",
      cause: error,
    });
  } finally {
    dbNewClient?.end();
  }
}

async function getPendingMigrations() {
  return migrationHandler();
}

async function runPendingMigrations() {
  return migrationHandler(false);
}

const migrator = {
  runPendingMigrations,
  getPendingMigrations,
};

export default migrator;
