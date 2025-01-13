import { Router } from "oak/router"
import * as CarsService from "../../services/cars.service.ts";
import { NotFoundException } from "../../exceptions.ts";

const router = new Router({ prefix: "/cars"});

router.get("/", async (ctx) => {
    const idFilter = ctx.request.url.searchParams.get("id") != null ? parseInt(ctx.request.url.searchParams.get("id")!) : undefined
    const nameFilter = ctx.request.url.searchParams.get("name") != null ? ctx.request.url.searchParams.get("name")! : undefined

    ctx.response.body = await CarsService.list(idFilter, nameFilter);
})

router.get("/:id", async (ctx) => {
    const res = await CarsService.get(parseInt(ctx.params.id))
    if (!res) throw new NotFoundException("Resource was not found");

    ctx.response.body = res;
})

export default router;