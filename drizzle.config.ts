import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  schemaFilter: ["public", "iam", "scheduling"],
  dbCredentials: {
    user: Deno.env.get("PG_USER")!,
    host: Deno.env.get("PG_HOSTNAME")!,
    password: Deno.env.get("PG_PASSWORD")!,
    port: parseInt(Deno.env.get("PG_PORT")!),
    database: Deno.env.get("PG_DATABASE")!,
    ssl: JSON.parse(Deno.env.get("PG_USE_TLS") ?? "false")
  }, 
  casing: 'snake_case' 
});