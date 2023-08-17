import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { store } from "./store";
import { InferModel, relations } from "drizzle-orm";

export const size = pgTable("size", {
  id: serial("id").primaryKey().notNull(),
  storeId: integer("store_id")
    .notNull()
    .references(() => store.id),
  name: varchar("name", { length: 256 }).notNull(),
  value: varchar("value", {}).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sizeRelation = relations(size, ({ one }) => ({
  size: one(store, {
    fields: [size.storeId],
    references: [store.id],
  }),
}));

export type Size = InferModel<typeof size>;
