import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { InferModel, relations } from "drizzle-orm";

export const store = pgTable("store", {
  id: serial("id").primaryKey().notNull(),
  userId: integer("user_id").notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const storeRelation = relations(store, ({ one }) => ({
  users: one(users, {
    fields: [store.userId],
    references: [users.id],
  }),
}));

export type Store = InferModel<typeof store>;
