import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

export const usersSchema = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  displayId: text("displayId").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
});
