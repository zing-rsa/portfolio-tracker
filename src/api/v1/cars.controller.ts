import { Router } from "oak/router"
import * as CarsService from "../../services/cars.service.ts";
import { NotFoundException } from "../../exceptions.ts";

const router = new Router({ prefix: "/cars"});

router.get("/", async (ctx) => {
    ctx.response.body = await CarsService.list();
})

router.get("/:id", async (ctx) => {
    const res = await CarsService.get(ctx.params.id)
    if (!res) throw new NotFoundException("Resource was not found");

    ctx.response.body = res;
})

export default router;