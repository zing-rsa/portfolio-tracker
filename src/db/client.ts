import { dirname, fromFileUrl, resolve } from "@std/path";

import { PostgresMigrate } from "https://deno.land/x/migrate@0.2.5/postgres.ts";
import { apply } from "https://deno.land/x/migrate@0.2.5/basic.ts";
import { Client } from "deno-postgres";

const useTls = JSON.parse(Deno.env.get("PG_USE_TLS") ?? "false");

const clientConfig = {
  database: Deno.env.get("PG_DATABASE"),
  user: Deno.env.get("PG_USER"),
  hostname: Deno.env.get("PG_HOSTNAME"),
  password: Deno.env.get("PG_PASSWORD"),
  port: Deno.env.get("PG_PORT"),
  tls: useTls
    ? {
      enabled: true,
      caCertificates: [
        await Deno.readTextFile(
          new URL("../../pg-cert.crt", import.meta.url),
        ),
      ],
    }
    : undefined,
};

const client = new Client(clientConfig);

export default client;
