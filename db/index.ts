import { NodePgClient, drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

import * as usersSchema from "./schema/users";
import * as storeSchema from "./schema/store";
import * as billboardSchema from "./schema/billboard";
import * as categorySchema from "./schema/category";

const client: NodePgClient = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect();

export const db = drizzle(client, {
  schema: {
    ...usersSchema,
    ...storeSchema,
    ...billboardSchema,
    ...categorySchema,
  },
});
