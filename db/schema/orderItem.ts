import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { product } from "./product";
import { order } from "./order";
import { InferModel, relations } from "drizzle-orm";

export const orderItem = pgTable(
  "orderItem",
  {
    id: uuid("id").defaultRandom().notNull(),
    productId: uuid("product_id")
      .notNull()
      .references(() => product.id),
    orderId: uuid("order_id")
      .notNull()
      .references(() => order.id),
  },
  (t) => ({
    pk: primaryKey(t.id, t.productId, t.orderId),
  })
);

export const orderItemRelations = relations(orderItem, ({ one }) => ({
  product: one(product, {
    fields: [orderItem.productId],
    references: [product.id],
  }),

  order: one(order, {
    fields: [orderItem.orderId],
    references: [order.id],
  }),
}));

export type OrderItem = InferModel<typeof orderItem>;
