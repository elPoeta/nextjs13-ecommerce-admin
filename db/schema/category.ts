import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { store } from "./store";
import { InferModel, relations } from "drizzle-orm";
import { billboard } from "./billboard";
import { product } from "./product";

export const category = pgTable("category", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  storeId: uuid("store_id")
    .notNull()
    .references(() => store.id),
  billboardId: uuid("billboard_id")
    .notNull()
    .references(() => billboard.id),
  name: varchar("name", { length: 256 }).unique().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const categoryRelation = relations(category, ({ one, many }) => ({
  store: one(store, {
    fields: [category.storeId],
    references: [store.id],
  }),
  billboard: one(billboard, {
    fields: [category.billboardId],
    references: [billboard.id],
  }),
  products: many(product),
}));

export type Category = InferModel<typeof category>;
