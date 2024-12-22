import { Router } from "oak/router";
import cars from "./cars.controller.ts"
import tenants from "./tenants.controller.ts"

const router = new Router({ prefix: "/v1" });

router.use(cars.routes())
router.use(tenants.routes())

export default router;