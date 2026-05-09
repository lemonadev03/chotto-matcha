import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  pool?: Pool;
  db?: ReturnType<typeof drizzle<typeof schema>>;
};

function getPool(): Pool {
  if (globalForDb.pool) return globalForDb.pool;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }
  const pool = new Pool({ connectionString });
  if (process.env.NODE_ENV !== "production") globalForDb.pool = pool;
  return pool;
}

export const db = globalForDb.db ?? drizzle(getPool(), { schema });

if (process.env.NODE_ENV !== "production") globalForDb.db = db;

export { schema };
