import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";
import { InferModel } from "drizzle-orm";

// export const sessions = pgTable(
//   "sessions",
//   {
//     id: uuid("id").defaultRandom().primaryKey().notNull(),
//     sessionToken: text("session_token").notNull(),
//     userId: uuid("user_id")
//       .notNull()
//       .references(() => users.id, { onDelete: "cascade" }),
//     expires: timestamp("expires", { mode: "date" }).notNull(),
//     created_at: timestamp("created_at").notNull().defaultNow(),
//     updated_at: timestamp("updated_at").notNull().defaultNow(),
//   },
//   (session) => ({
//     sessionTokenIndex: uniqueIndex("sessions__sessionToken__idx").on(
//       session.sessionToken
//     ),
//   })
// );

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export type Sessions = InferModel<typeof sessions>;
