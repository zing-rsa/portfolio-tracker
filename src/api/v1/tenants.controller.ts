import { Router } from "oak/router"

import { OnboardRequestDTO } from "../../dtos.ts";
import * as TenantsService from "../../services/tenants.service.ts";
import { NotFoundException } from "../../exceptions.ts";
import authorize from "../../middleware/authorize.middleware.ts";

const router = new Router({ prefix: "/tenants"});

router.get("/:id", authorize('admin.tenants'), async (ctx) => {
    const res = await TenantsService.get(ctx.params.id);
    if (!res) throw new NotFoundException("Resource was not found");
    
    ctx.response.body = await TenantsService.get(ctx.params.id);
})

router.post("/onboard", authorize('admin.tenants'), async (ctx) => {
    const body: OnboardRequestDTO = await ctx.request.body.json();

    const res = await TenantsService.create(body);

    ctx.response.status = 201;
    ctx.response.body = { api_key: res.api_key };
})

router.post("/:id/revoke", authorize('admin.tenants'), async (ctx) => {
    await TenantsService.revoke(ctx.params.id);

    ctx.response.status = 200;
})


export default router;