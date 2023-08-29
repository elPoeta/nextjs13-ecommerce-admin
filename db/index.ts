import { NodePgClient, drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

import * as usersSchema from "./schema/users";
import * as storeSchema from "./schema/store";
import * as billboardSchema from "./schema/billboard";
import * as categorySchema from "./schema/category";
import * as sizeSchema from "./schema/size";
import * as colorSchema from "./schema/color";
import * as productSchema from "./schema/product";
import * as imageSchema from "./schema/image";
import * as orderSchema from "./schema/order";
import * as orderItemSchema from "./schema/orderItem";

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
    ...sizeSchema,
    ...colorSchema,
    ...productSchema,
    ...imageSchema,
    ...orderSchema,
    ...orderItemSchema,
  },
});
