import { Router } from "oak/router"
import * as PricesService from "../../services/prices.service.ts";
import { NotFoundException } from "../../exceptions.ts";
import { CreatePriceDto } from "./dtos.ts";

const router = new Router({ prefix: "/prices"});

router.get("/", async (ctx) => {
    ctx.response.body = await PricesService.list();
})

router.get("/:id", async (ctx) => {
    const res = await PricesService.get(ctx.params.id)
    if (!res) throw new NotFoundException("Resource was not found");

    ctx.response.body = res;
})

router.post("/", async (ctx) => {
    const body: CreatePriceDto = await ctx.request.body.json();

    const res = await PricesService.create(body);

    ctx.response.status = 201;
})

export default router;