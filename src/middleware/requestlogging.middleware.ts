import { Next, Context } from "oak";

export default async (ctx: Context, next: Next) => {
    console.log(`${ctx.request.method}:${ctx.request.url.pathname} body=${JSON.stringify(ctx.request.body)}`)

    await next()
    
    console.log(`${ctx.request.method}:${ctx.request.url.pathname} status=${ctx.response.status} body=${JSON.stringify(ctx.response.body)}`)
}