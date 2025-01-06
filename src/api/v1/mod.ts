import { Router } from "oak/router";
import cars from "./cars.controller.ts"
import tenants from "./tenants.controller.ts"
import balances from "./balances.controller.ts"
import data from "./data.controller.ts"

const router = new Router({ prefix: "/v1" });

router.use(cars.routes())
router.use(tenants.routes())
router.use(balances.routes())
router.use(data.routes())

export default router;