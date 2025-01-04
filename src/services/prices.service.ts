import { CreatePriceDto } from "../api/v1/dtos.ts";
import { PricesDb } from "../db/mod.ts"
import { Price } from "../db/models.ts";
import { fetchLatestPrice, fetchLatestPricesTop20 } from "../gateways/coinmarketcap.ts";

export async function get() {
    const results = await list();
    return results.length == 0 ? null : results[0];
}

export async function list() {
    return await PricesDb.list();
}

export async function create(dto: CreatePriceDto) {
    const price: Price = { ...dto };
    return await PricesDb.create(price);
}

export async function updateAdaPrice() {
    const symbol = "ADA";
    const priceInfo = await fetchLatestPrice(symbol);
    await PricesDb.create({ symbol: symbol, priceUsd: priceInfo.price, timestamp: priceInfo.timestamp});
}

export async function updateEthPrice() {
    const symbol = "ETH";
    const priceInfo = await fetchLatestPrice(symbol);
    await PricesDb.create({ symbol: symbol, priceUsd: priceInfo.price, timestamp: priceInfo.timestamp});
}

export async function updateAvaxPrice() {
    const symbol = "AVAX";
    const priceInfo = await fetchLatestPrice(symbol);
    await PricesDb.create({ symbol: symbol, priceUsd: priceInfo.price, timestamp: priceInfo.timestamp});
}


export async function updateTop20Prices() {
    const priceInfo = await fetchLatestPricesTop20();

    for (let price of priceInfo) {
        await PricesDb.create({ symbol: price.symbol, priceUsd: price.price, timestamp: price.timestamp});
    }
}