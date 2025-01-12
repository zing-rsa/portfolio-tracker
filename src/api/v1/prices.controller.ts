import { Router } from "oak/router"
import * as PricesService from "../../services/prices.service.ts";
import { CreatePriceDto } from "../../dtos.ts";

const router = new Router({ prefix: "/prices"});

router.get("/", async (ctx) => {
    ctx.response.body = await PricesService.list();
})

router.post("/", async (ctx) => {
    const body: CreatePriceDto = await ctx.request.body.json();

    const res = await PricesService.create(body);

    ctx.response.status = 201;
})

export default router;