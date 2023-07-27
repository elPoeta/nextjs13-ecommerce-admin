import { NodePgClient, drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

const client: NodePgClient = new Client({
  connectionString: process.env.DATABASE_URL,
});

await client.connect();

export const db = drizzle(client);
