import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { Router } from "oak/router";
import { Application } from "oak";
import "jsr:@std/dotenv/load";

import requestLogging from "./middleware/requestlogging.middleware.ts";
import errorHandling from "./middleware/errorhandling.middleware.ts"
import authentication from "./middleware/authenticate.middleware.ts"
import * as scheduler from "./scheduler.ts"
import v1 from "./api/v1/mod.ts"

const router = new Router({ prefix: "/api" });
const port = Deno.env.get("APP_PORT");
const app = new Application();

// middleware
app.use(requestLogging);
app.use(errorHandling);
app.use(authentication);
app.use(
    oakCors({
      origin: "*"
    }),
);

// routes
router.use(v1.routes())
app.use(router.routes());
app.use(router.allowedMethods());

scheduler.start();

console.log("--------------------\nServer listening on port ", port);
await app.listen({ port: Number(port) });