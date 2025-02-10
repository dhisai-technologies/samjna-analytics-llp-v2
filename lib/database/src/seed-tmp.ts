import * as dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import stroopTestQuestionsData from "./data/stroop-test-questions";

import { stroopTestQuestions } from "./schema";

dotenv.config();

const client = new pg.Client({
  connectionString: process.env.DB_URL,
  ssl: false,
});

const db = drizzle(client);

async function main() {
  await client.connect();
  console.log("📦 connected to database");
  for (const question of stroopTestQuestionsData) {
    await db.insert(stroopTestQuestions).values(question as typeof stroopTestQuestions.$inferInsert);
  }
  console.log("🌱 seeded database");
  process.exit(0);
}

main();
