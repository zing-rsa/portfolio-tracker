import { Next, Context } from "oak";
import * as errors from "../exceptions.ts"
import Joi from "joi";

export default async (ctx: Context, next: Next) => {

    try {
        await next()
    } catch (err) { 
        if (err instanceof errors.RequestException) {
            ctx.response.body = { message: err.message };
            ctx.response.status = 400;
            return;
        }

        if (err instanceof Joi.ValidationError) {
            ctx.response.body = { message: err.message };
            ctx.response.status = 400;
            return;
        }
        
        if (err instanceof errors.NotFoundException) {
            ctx.response.body = null;
            ctx.response.status = 404;
            return;
        }
        
        if (err instanceof errors.UnauthorizedException) {
            ctx.response.body = null;
            ctx.response.status = 401;
            return;
        }
        
        if (err instanceof errors.ForbiddenException) {
            ctx.response.body = err.message;
            ctx.response.status = 403;
            return;
        }

        throw err;
    }
}