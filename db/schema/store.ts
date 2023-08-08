import {
  integer,
  pgTable,
  serial,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { InferModel, relations } from "drizzle-orm";

export const store = pgTable(
  "store",
  {
    id: serial("id").primaryKey().notNull(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    name: varchar("name", { length: 256 }).unique().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (store) => ({
    nameIndex: uniqueIndex("sotore__name__idx").on(store.name),
  })
);

export const storeRelation = relations(store, ({ one }) => ({
  users: one(users, {
    fields: [store.userId],
    references: [users.id],
  }),
}));

export type Store = InferModel<typeof store>;
