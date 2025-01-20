import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "@lib/database";

import { config } from "@/config";

export const client = new Pool({
  connectionString: config.DB_URL,
});

export const db = drizzle(client, { schema });
