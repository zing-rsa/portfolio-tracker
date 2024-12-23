import { Client } from "deno-postgres";

const useTls = JSON.parse(Deno.env.get("PG_USE_TLS") ?? "false");

const clientConfig = {
  database: Deno.env.get("PG_DATABASE"),
  user: Deno.env.get("PG_USER"),
  hostname: Deno.env.get("PG_HOSTNAME"),
  password: Deno.env.get("PG_PASSWORD"),
  port: Deno.env.get("PG_PORT"),
  controls: {
    decoders: {
      // Custom decoder for decimal
      numeric: (value: any) => parseFloat(value.toString()),
    },
  },
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
