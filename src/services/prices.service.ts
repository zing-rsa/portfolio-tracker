import { CreatePriceDto } from "../dtos.ts";
import { PricesDb } from "../db/mod.ts"
import { Price } from "../db/models.ts";
import { fetchLatestPricesTop20 } from "../gateways/coinmarketcap.gateway.ts";

export async function get() {
    const results = await list();
    return results.length == 0 ? null : results[0];
}

export async function list() {
    return await PricesDb.list();
}

export async function create(dto: CreatePriceDto) {
    const price: Price = { ...dto, price: dto.priceUsd.toString(), priceQuotedSymbol: "USD" };
    return await PricesDb.create(price);
}


export async function updateTop20Prices() {
    console.log("updating prices")
    const priceInfo = await fetchLatestPricesTop20();

    for (let price of priceInfo) {
        await PricesDb.create({ symbol: price.symbol, price: price.price.toString(), priceQuotedSymbol: "USD", timestamp: price.timestamp});
    }
}