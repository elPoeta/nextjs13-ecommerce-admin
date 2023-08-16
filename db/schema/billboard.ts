import { InferModel, relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { store } from "./store";
import { category } from "./category";

export const billboard = pgTable("billboard", {
  id: serial("id").primaryKey().notNull(),
  storeId: integer("store_id")
    .notNull()
    .references(() => store.id),
  label: varchar("label", { length: 50 }).notNull(),
  imageUrl: varchar("image_url", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const billboardRelation = relations(billboard, ({ one, many }) => ({
  store: one(store, {
    fields: [billboard.storeId],
    references: [store.id],
  }),
  categories: many(category),
}));

export type Billboard = InferModel<typeof billboard>;
