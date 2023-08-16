import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { store } from "./store";
import { InferModel, relations } from "drizzle-orm";
import { billboard } from "./billboard";

export const category = pgTable("category", {
  id: serial("id").primaryKey().notNull(),
  storeId: integer("store_id")
    .notNull()
    .references(() => store.id),
  billboardId: integer("billboard_id")
    .notNull()
    .references(() => billboard.id),
  name: varchar("name", { length: 256 }).unique().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const categoryRelation = relations(category, ({ one }) => ({
  store: one(store, {
    fields: [category.storeId],
    references: [store.id],
  }),
  billboard: one(billboard, {
    fields: [category.billboardId],
    references: [billboard.id],
  }),
}));

export type Category = InferModel<typeof category>;
