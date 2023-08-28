import { InferModel, relations } from "drizzle-orm";
import {
  boolean,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { store } from "./store";

export const order = pgTable("order", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  storeId: uuid("store_id")
    .notNull()
    .references(() => store.id),
  isPaid: boolean("is_paid").default(false).notNull(),
  phone: varchar("phone", { length: 255 }).default("").notNull(),
  address: varchar("address", { length: 255 }).default("").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orderRelation = relations(order, ({ one, many }) => ({
  store: one(store, {
    fields: [order.storeId],
    references: [store.id],
  }),
}));

export type Order = InferModel<typeof order>;
