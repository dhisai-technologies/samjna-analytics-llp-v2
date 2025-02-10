import * as dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import interviewQuestionsData from "./data/interview-questions";
import nursingQuestionsData from "./data/nursing-questions";
import stroopTestQuestionsData from "./data/stroop-test-questions";
import usersData from "./data/users";

import { coreInterviewQuestions, coreNursingQuestions, stroopTestQuestions, users } from "./schema";

dotenv.config();

const client = new pg.Client({
  connectionString: process.env.DB_URL,
  ssl: false,
});

const db = drizzle(client);

async function main() {
  await client.connect();
  console.log("📦 connected to database");
  for (const user of usersData) {
    await db.insert(users).values(user as typeof users.$inferInsert);
  }
  for (const question of interviewQuestionsData) {
    await db.insert(coreInterviewQuestions).values(question as typeof coreInterviewQuestions.$inferInsert);
  }
  for (const [index, question] of nursingQuestionsData.entries()) {
    await db.insert(coreNursingQuestions).values({
      ...question,
      order: index + 1,
    } as typeof coreNursingQuestions.$inferInsert);
  }
  for (const question of stroopTestQuestionsData) {
    await db.insert(stroopTestQuestions).values(question as typeof stroopTestQuestions.$inferInsert);
  }
  console.log("🌱 seeded database");
  process.exit(0);
}

main();
