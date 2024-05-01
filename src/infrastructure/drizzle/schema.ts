import { relations } from "drizzle-orm";
import { sqliteTable, text, real, integer } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

import { StatusEnum } from "@/domain/Book/Stock/Status/Status";
import { getUnionEnumValues } from "@/util/share";

export const usersSchema = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  displayId: text("displayId").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
});

export const stocks = sqliteTable("stocks", {
  stockId: text("id").primaryKey().notNull(),
  quantityAvailable: integer("quantityAvailable").notNull(),
  bookId: text("bookId")
    .unique()
    .notNull()
    .references(() => books.bookId, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  status: text("status", { enum: getUnionEnumValues(StatusEnum) })
    .notNull()
    .default("OutOfStock"),
});
export const stocksRelations = relations(stocks, ({ one }) => ({
  book: one(books, {
    fields: [stocks.bookId],
    references: [books.bookId],
  }),
}));

export const books = sqliteTable("books", {
  bookId: text("id").primaryKey().notNull(),
  title: text("title").notNull(),
  priceAmount: real("priceAmount").notNull(),
});
export const booksRelations = relations(books, ({ one }) => ({
  stocks: one(stocks),
}));
