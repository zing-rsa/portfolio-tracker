import { Client } from "deno-postgres";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

import { cars as carsSchema } from "./schema.ts";
import { transactions as transactionsSchema } from "./schema.ts";

const { Pool } = pg;

// used for majority of queries
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

// used for fine grain queries
export const pgClient = new Client({
  user: Deno.env.get("PG_USER"),
  hostname: Deno.env.get("PG_HOSTNAME"),
  database: Deno.env.get("PG_DATABASE"),
  password: Deno.env.get("PG_PASSWORD"),
  port: Deno.env.get("PG_PORT"),
  controls: {
    decoders: {
      // Custom decoder for decimal
      numeric: (value: any) => value.toString(),
    },
  },
  tls: JSON.parse(Deno.env.get("PG_USE_TLS") ?? "false")
    ? {
      enabled: true,
      caCertificates: [
        await Deno.readTextFile(
          new URL("../../pg-cert.crt", import.meta.url),
        ),
      ],
    }
    : undefined,
});
