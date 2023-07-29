import {
  integer,
  pgTable,
  serial,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { InferModel } from "drizzle-orm";

export const sessions = pgTable(
  "sessions",
  {
    id: serial("id").primaryKey().notNull(),
    sessionToken: varchar("session_token", { length: 256 }).notNull(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires").notNull(),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
  },
  (session) => ({
    sessionTokenIndex: uniqueIndex("sessions__sessionToken__idx").on(
      session.sessionToken
    ),
  })
);

export type Sessions = InferModel<typeof sessions>;
