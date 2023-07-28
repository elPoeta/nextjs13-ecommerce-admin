import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const accounts = pgTable(
  "accounts",
  {
    id: serial("id").primaryKey().notNull(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 256 }).notNull(),
    provider: varchar("provider", { length: 256 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 256,
    }).notNull(),
    access_token: text("access_token"),
    expires_in: integer("expires_in"),
    id_token: text("id_token"),
    refresh_token: text("refresh_token"),
    refresh_token_expires_in: integer("refresh_token_expires_in"),
    scope: varchar("scope", { length: 256 }),
    token_type: varchar("token_type", { length: 256 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (account) => ({
    providerProviderAccountIdIndex: uniqueIndex(
      "accounts__provider__providerAccountId__idx"
    ).on(account.provider, account.providerAccountId),
  })
);
