import runner from "node-pg-migrate";
import { resolve } from "node:path";

import database from "infra/database.js";
import { InternalServerError } from "../../../../infra/errors";

export default async function migrations(request, response) {
  const allowedHttpMethods = ["GET", "POST"];

  let dbNewClient;

  if (!allowedHttpMethods.includes(request.method)) {
    return response
      .status(405)
      .json({ message: `Method ${request.method} not allowed.` });
  }

  try {
    dbNewClient = await database.getNewClient();
    const migrationsConfig = {
      dbClient: dbNewClient,
      dir: resolve("infra", "migrations"),
      direction: "up",
      dryRun: true,
      verbose: true,
      migrationsTable: "pgmigrations",
    };

    if (request.method === "GET") {
      const pendingMigrations = await runner({
        ...migrationsConfig,
      });

      return response.status(200).json(pendingMigrations);
    }

    if (request.method === "POST") {
      const migratedMigrations = await runner({
        ...migrationsConfig,
        dryRun: false,
      });

      if (migratedMigrations.length > 0) {
        return response.status(201).json(migratedMigrations);
      }

      return response.status(200).json(migratedMigrations);
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await dbNewClient.end();
  }
}
