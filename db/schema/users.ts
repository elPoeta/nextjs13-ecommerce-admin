import { InferModel, relations } from "drizzle-orm";
import {
  pgTable,
  timestamp,
  uniqueIndex,
  varchar,
  text,
  uuid,
} from "drizzle-orm/pg-core";
import { store } from "./store";

export const users = pgTable(
  "user",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    name: varchar("name", { length: 100 }),
    email: varchar("email", { length: 256 }).notNull(),
    emailVerified: timestamp("emailVerified"),
    image: varchar("image", { length: 256 }),
    role: text("role", { enum: ["admin", "user"] })
      .notNull()
      .default("user"),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
  },
  (user) => ({
    emailIndex: uniqueIndex("users__email__idx").on(user.email),
  })
);

export const userRealations = relations(users, ({ many }) => ({
  store: many(store),
}));

export type User = InferModel<typeof users>;
