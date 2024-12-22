
import { PostgresMigrate, ClientOptions } from "https://deno.land/x/migrate@0.2.5/postgres.ts";
import { apply } from "https://deno.land/x/migrate@0.2.5/basic.ts";
import { dirname, fromFileUrl, resolve,} from "jsr:@std/path";
import "jsr:@std/dotenv/load";

const cfg = {
    PG_USER: Deno.env.get("PG_USER"),
    PG_DATABASE: Deno.env.get("PG_DATABASE"),
    PG_HOSTNAME: Deno.env.get("PG_HOSTNAME"),
    PG_PASSWORD: Deno.env.get("PG_PASSWORD"),
    PG_PORT: Deno.env.get("PG_PORT"),
}

const clientConfig: ClientOptions = {
    database: cfg.PG_DATABASE,
    hostname: cfg.PG_HOSTNAME,
    user: cfg.PG_USER,
    password: cfg.PG_PASSWORD,
    port: cfg.PG_PORT,
}

// migrations
const migrate = new PostgresMigrate({
    migrationsDir: resolve(dirname(fromFileUrl(import.meta.url)), "./src/db/migrations"),
    client: clientConfig
});

await apply(migrate)