import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

import { cars as carsSchema } from "./schema.ts";
import { transactions as transactionsSchema } from "./schema.ts";

const { Pool } = pg;

export const db = drizzle({
  client: new Pool({
    user: Deno.env.get("PG_USER")!,
    host: Deno.env.get("PG_HOSTNAME")!,
    password: Deno.env.get("PG_PASSWORD")!,
    port: parseInt(Deno.env.get("PG_PORT")!),
    database: Deno.env.get("PG_DATABASE")!,
    ssl: false
  }),
  schema: { carsSchema, transactionsSchema}, 
  casing: 'snake_case' 
});
