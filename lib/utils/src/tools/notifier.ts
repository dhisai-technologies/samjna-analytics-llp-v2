import type * as schema from "@lib/database";
import { notifications } from "@lib/database";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

export class Notifier {
  db: NodePgDatabase<typeof schema>;
  constructor(db: NodePgDatabase<typeof schema>) {
    this.db = db;
  }
  default(this: Notifier, data: typeof notifications.$inferInsert) {
    this.db.insert(notifications).values(data);
  }
  important(this: Notifier, data: typeof notifications.$inferInsert) {
    this.db.insert(notifications).values({
      ...data,
      type: "IMPORTANT",
    });
  }
}
