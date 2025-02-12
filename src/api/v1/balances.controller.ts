import { Router } from "oak/router"
import * as CalculationService from "../../services/calculation.service.ts";

const router = new Router({ prefix: "/balances"});

router.get("/", async (ctx) => {
    const refresh = JSON.parse(ctx.request.url.searchParams.get("refresh") ?? "false");
    ctx.response.body = await CalculationService.balancesToday(refresh);
})

router.get("/historic", async (ctx) => {
    const refresh = JSON.parse(ctx.request.url.searchParams.get("refresh") ?? "false");
    ctx.response.body = await CalculationService.totalsHistoric(refresh);
})

export default router;