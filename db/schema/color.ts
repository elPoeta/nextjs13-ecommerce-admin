import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { store } from "./store";
import { InferModel, relations } from "drizzle-orm";

export const color = pgTable("color", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  storeId: uuid("store_id")
    .notNull()
    .references(() => store.id),
  name: varchar("name", { length: 256 }).notNull(),
  value: varchar("value", {}).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sizeRelation = relations(color, ({ one }) => ({
  color: one(store, {
    fields: [color.storeId],
    references: [store.id],
  }),
}));

export type Color = InferModel<typeof color>;
