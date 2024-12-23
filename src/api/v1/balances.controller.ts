import { Router } from "oak/router"
import * as CalculationService from "../../services/calculation.service.ts";

const router = new Router({ prefix: "/balances"});

router.get("/", async (ctx) => {
    ctx.response.body = await CalculationService.balances();
})

export default router;