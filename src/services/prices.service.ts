import { CreatePriceDto } from "../api/v1/dtos.ts";
import { PricesDb } from "../db/mod.ts"
import { Price } from "../db/models.ts";

export async function get(id?: string) {
    const results = await list(id);
    return results.length == 0 ? null : results[0];
}

export async function list(id?: string) {
    return await PricesDb.list(id);
}

export async function create(dto: CreatePriceDto) {
    const price: Price = { ...dto };
    return await PricesDb.create(price);
}