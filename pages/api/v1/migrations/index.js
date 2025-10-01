import database from "infra/database.js";
import runner from "node-pg-migrate";

import { join } from "node:path";
import { NextApiRequest, NextApiResponse } from "next";

/**
 *
 * @param {NextApiRequest} request
 * @param {NextApiResponse} response
 * @returns
 */

export default async function migrations(request, response) {
  const allowedHttpMethods = ['GET', 'POST'];

  let dbNewClient;

  if (!allowedHttpMethods.includes(request.method)) {
    return response.status(405).json({ 'message': `Method ${request.method} not allowed.` });
  }

  try {
    dbNewClient = await database.getNewClient();
    const migrationsConfig = {
      dbClient: dbNewClient,
      dir: join("infra", "migrations"),
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
