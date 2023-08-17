import { InferModel } from "drizzle-orm";
import {
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

// export const verificationTokens = pgTable(
//   "verification_tokens",
//   {
//     identifier: uuid("identifier").defaultRandom().primaryKey().notNull(),
//     token: varchar("token", { length: 256 }).notNull(),
//     expires: timestamp("expires").notNull(),
//     created_at: timestamp("created_at").notNull().defaultNow(),
//     updated_at: timestamp("updated_at").notNull().defaultNow(),
//   },
//   (verificationToken) => ({
//     tokenIndex: uniqueIndex("verification_tokens__token__idx").on(
//       verificationToken.token
//     ),
//   })
// );

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  })
);

export type VerificationToken = InferModel<typeof verificationTokens>;
