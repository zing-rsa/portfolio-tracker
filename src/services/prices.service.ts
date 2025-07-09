import { CreatePriceDto } from "../dtos.ts";
import { PricesDb } from "../db/mod.ts"
import { Price } from "../models.ts";
import { fetchLatestPricesTop20 } from "../gateways/coinmarketcap.gateway.ts";
import { fetchBudzFloor } from "../gateways/jpg.gateway.ts";

export async function get() {
    const results = await list();
    return results.length == 0 ? null : results[0];
}

export async function list() {
    return await PricesDb.list();
}

export async function create(dto: CreatePriceDto) {
    const price: Price = { ...dto, price: dto.price.toString(), timestamp: new Date(dto.timestamp)};
    return await PricesDb.create(price);
}


export async function updateTop20Prices() {
    console.log("updating top 20 prices")
    const priceInfo = await fetchLatestPricesTop20();

    for (let price of priceInfo) {
        await PricesDb.create({ symbol: price.symbol, price: price.price.toString(), priceQuotedSymbol: "USD", timestamp: price.timestamp});
    }
}

export async function updateBudzPrices() {
    console.log("updating budz prices")
    const priceInfo = await fetchBudzFloor();

    await PricesDb.create({ symbol: priceInfo.symbol, price: priceInfo.price.toString(), priceQuotedSymbol: "ADA", timestamp: priceInfo.timestamp});
}