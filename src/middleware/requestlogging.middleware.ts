import { Next, Context } from "oak";

export default async (ctx: Context, next: Next) => {
    console.log(`${ctx.request.method}:${ctx.request.url.pathname}${ctx.request.url.search} body=${JSON.stringify(ctx.request.body)}`)

    await next()
    
    console.log(`${ctx.request.method}:${ctx.request.url.pathname}${ctx.request.url.search} status=${ctx.response.status} body=${JSON.stringify(ctx.response.body)}`)
}