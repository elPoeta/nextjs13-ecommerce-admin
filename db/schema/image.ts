import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { product } from "./product";
import { InferModel, relations } from "drizzle-orm";

export const image = pgTable("image", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  productId: uuid("product_id")
    .notNull()
    .references(() => product.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const imageRelation = relations(image, ({ one }) => ({
  product: one(product, {
    fields: [image.productId],
    references: [product.id],
  }),
}));

export type Image = InferModel<typeof image>;
