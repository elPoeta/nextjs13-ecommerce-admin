import {
  integer,
  pgTable,
  serial,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { store } from "./store";
import { InferModel, relations } from "drizzle-orm";
import { product } from "./product";

export const size = pgTable("size", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  storeId: uuid("store_id")
    .notNull()
    .references(() => store.id),
  name: varchar("name", { length: 256 }).notNull(),
  value: varchar("value", {}).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sizeRelation = relations(size, ({ one, many }) => ({
  size: one(store, {
    fields: [size.storeId],
    references: [store.id],
  }),
  products: many(product),
}));

export type Size = InferModel<typeof size>;
