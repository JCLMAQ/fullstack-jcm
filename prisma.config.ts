import "@dotenvx/dotenvx/config";
import path from "node:path";
import { defineConfig, env } from "prisma/config";

// dotenvx gère automatiquement l'expansion des variables

export default defineConfig({
  schema: path.join("libs/db/src/lib/prisma", "schema.prisma"),
  migrations: {
    path: path.join("libs/db/src/lib", "migrations"),
  },
  views: {
    path: path.join("libs/db/src/lib/views", "views"),
  },
  typedSql: {
    path: path.join("libs/db/src/lib/queries", "queries"),
  },
  datasource: {
    url: env("DATABASE_URL"),
  }
});
