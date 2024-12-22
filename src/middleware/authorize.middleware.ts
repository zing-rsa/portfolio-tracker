import { Context, Next } from "oak";
import { ForbiddenException } from "../exceptions.ts";

export default function authorize(claims: string[] | string) {
    if (typeof claims === "string") {
        claims = [claims];
    }

    return async (ctx: Context, next: Next) => {
        const tenant = ctx.state.tenant;

        for (let claim of claims) {
            if (tenant.claims.includes(claim) || tenant.claims.includes("*")) {
                await next();
            } else {
                if (claim.includes("admin")) {
                    ctx.response.status = 404;
                    return;
                } else {
                    throw new ForbiddenException(
                        "Unauthorized to perform this action",
                    );
                }
            }
        }
    };
}
