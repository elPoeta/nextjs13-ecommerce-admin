import {
  boolean,
  pgTable,
  real,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { store } from "./store";
import { InferModel, relations } from "drizzle-orm";
import { category } from "./category";
import { size } from "./size";
import { color } from "./color";
import { image } from "./image";

export const product = pgTable("product", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  storeId: uuid("store_id")
    .notNull()
    .references(() => store.id),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => category.id),
  sizeId: uuid("size_id")
    .notNull()
    .references(() => size.id),
  colorId: uuid("color_id")
    .notNull()
    .references(() => color.id),
  name: varchar("name", { length: 256 }).notNull(),
  price: real("price").notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  isArchived: boolean("is_archived").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const productRelation = relations(product, ({ one, many }) => ({
  store: one(store, {
    fields: [product.storeId],
    references: [store.id],
  }),
  category: one(category, {
    fields: [product.categoryId],
    references: [category.id],
  }),
  color: one(color, {
    fields: [product.colorId],
    references: [color.id],
  }),
  size: one(size, {
    fields: [product.sizeId],
    references: [size.id],
  }),
  images: many(image),
}));

export type Product = InferModel<typeof product>;
