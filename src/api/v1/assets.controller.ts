import { Router } from "oak/router"
import * as AssetsService from "../../services/assets.service.ts";
import { NotFoundException } from "../../exceptions.ts";
import { CreateAssetDto } from "./dtos.ts";

const router = new Router({ prefix: "/assets"});

router.get("/", async (ctx) => {
    ctx.response.body = await AssetsService.list();
})

router.get("/:id", async (ctx) => {
    const res = await AssetsService.get(ctx.params.id)
    if (!res) throw new NotFoundException("Resource was not found");

    ctx.response.body = res;
})

router.post("/", async (ctx) => {
    const body: CreateAssetDto = await ctx.request.body.json();

    const res = await AssetsService.create(body);

    ctx.response.status = 201;
})

export default router;