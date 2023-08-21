import {
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { InferModel, relations } from "drizzle-orm";
import { billboard } from "./billboard";
import { category } from "./category";
import { size } from "./size";
import { color } from "./color";

export const store = pgTable(
  "store",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    userId: uuid("userId")
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

export const storeRelation = relations(store, ({ one, many }) => ({
  users: one(users, {
    fields: [store.userId],
    references: [users.id],
  }),
  billboards: many(billboard),
  categories: many(category),
  sizes: many(size),
  colors: many(color),
}));

export type Store = InferModel<typeof store>;
