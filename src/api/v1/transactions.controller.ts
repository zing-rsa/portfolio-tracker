import { Router } from "oak/router"
import * as TransactionsService from "../../services/transactions.service.ts";
import { NotFoundException } from "../../exceptions.ts";
import { CreateTradeDto, CreateTransferDto } from "./dtos.ts";

const router = new Router({ prefix: "/transactions"});

router.get("/", async (ctx) => {
    ctx.response.body = await TransactionsService.list();
})

router.get("/:id", async (ctx) => {
    const res = await TransactionsService.get(ctx.params.id)
    if (!res) throw new NotFoundException("Resource was not found");

    ctx.response.body = res;
})

router.post("/trade", async (ctx) => {
    const body: CreateTradeDto = await ctx.request.body.json();

    const res = await TransactionsService.createTrade(body);

    ctx.response.status = 201;
})

router.post("/transfer", async (ctx) => {
    const body: CreateTransferDto = await ctx.request.body.json();

    const res = await TransactionsService.createTransfer(body);

    ctx.response.status = 201;
})


export default router;