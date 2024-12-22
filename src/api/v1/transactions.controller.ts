import { Router } from "oak/router"
import * as TransactionsService from "../../services/transactions.service.ts";
import { NotFoundException } from "../../exceptions.ts";
import { CreateTransactionDto } from "./dtos.ts";

const router = new Router({ prefix: "/assets"});

router.get("/", async (ctx) => {
    ctx.response.body = await TransactionsService.list();
})

router.get("/:id", async (ctx) => {
    const res = await TransactionsService.get(ctx.params.id)
    if (!res) throw new NotFoundException("Resource was not found");

    ctx.response.body = res;
})

router.post("/", async (ctx) => {
    const body: CreateTransactionDto = await ctx.request.body.json();

    const res = await TransactionsService.create(body);

    ctx.response.status = 201;
})

export default router;