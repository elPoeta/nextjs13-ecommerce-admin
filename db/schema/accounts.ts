import {
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
//@ts-ignore
import type { AdapterAccount } from "@auth/core/adapters";
import { users } from "./users";
import { InferModel } from "drizzle-orm";

// export const accounts = pgTable(
//   "accounts",
//   {
//     id: uuid("id").defaultRandom().primaryKey().notNull(),
//     userId: uuid("user_id")
//       .notNull()
//       .references(() => users.id),
//     type: varchar("type", { length: 256 }).notNull(),
//     provider: varchar("provider", { length: 256 }).notNull(),
//     providerAccountId: varchar("provider_account_id", {
//       length: 256,
//     }).notNull(),
//     access_token: text("access_token"),
//     expires_in: integer("expires_in"),
//     id_token: text("id_token"),
//     refresh_token: text("refresh_token"),
//     refresh_token_expires_in: integer("refresh_token_expires_in"),
//     scope: varchar("scope", { length: 256 }),
//     token_type: varchar("token_type", { length: 256 }),
//     createdAt: timestamp("created_at").defaultNow().notNull(),
//     updatedAt: timestamp("updated_at").defaultNow().notNull(),
//   },
//   (account) => ({
//     providerProviderAccountIdIndex: uniqueIndex(
//       "accounts__provider__providerAccountId__idx"
//     ).on(account.provider, account.providerAccountId),
//   })
//);

export const accounts = pgTable(
  "account",
  {
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
  })
);

export type Account = InferModel<typeof accounts>;
