import * as dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { users } from "./schema";
import data from "./users.json";

dotenv.config();

const client = new pg.Client({
  connectionString: process.env.DB_URL,
  ssl: false,
});

const db = drizzle(client);

async function main() {
  await client.connect();
  console.log("📦 connected to database");
  for (const el of data) {
    await db.insert(users).values({
      id: el.uid,
      email: el.email,
      name: el.name,
      role: el.role,
      active: el.active,
      module: el.module,
      maxParticipants: el.max_participants,
    });
  }
  console.log("🌱 migrated data");
  process.exit(0);
}

main();
