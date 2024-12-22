import { Context, Next } from "oak";
import { UnauthorizedException } from "../exceptions.ts";
import * as tenantsService from "../services/tenants.service.ts";

export default async (ctx: Context, next: Next) => {
    const key = ctx.request.headers.get("x-api-key");

    if (key) {
        const tenant = await tenantsService.getForAuth(key);

        if (tenant) {
            ctx.state.tenant = tenant;
            await next()
            return;
        }
    }

    throw new UnauthorizedException("Unauthorized");
}