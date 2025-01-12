import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

import { cars as carsSchema } from "./schema.ts";

// Use pg driver.
const { Pool } = pg;

// Instantiate Drizzle client with pg driver and schema.
export const db = drizzle({
  client: new Pool({
    user: Deno.env.get("PG_USER")!,
    host: Deno.env.get("PG_HOSTNAME")!,
    password: Deno.env.get("PG_PASSWORD")!,
    port: parseInt(Deno.env.get("PG_PORT")!),
    database: Deno.env.get("PG_DATABASE")!,
    ssl: false
  }),
  schema: { carsSchema },
});
