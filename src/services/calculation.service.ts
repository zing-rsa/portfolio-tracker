import { BalanceSummary, Value } from "../dtos.ts";
import { TransactionsDb } from "../db/mod.ts";
import { Price } from "../models.ts";

export async function balances() : Promise<BalanceSummary> {
    const addressBalances = await TransactionsDb.listHistoricAddressBalances()
    const accumulator: Record<string, Value[]> = {}
    const now = new Date();

    const summary : BalanceSummary = {
        addresses: [],
        totalUsd: 0
    }

    const todayInfo = addressBalances
        .filter(x => 
            x.date.getFullYear() == now.getFullYear() && 
            x.date.getMonth() == now.getMonth() && 
            x.date.getDate() == now.getDate() &&
            x.qty > 0 // only calculate on positive non-zero qtys
        )

    for (const balance of todayInfo) {
        const value = { symbol: balance.symbol, qty: balance.qty, totalUsd: balance.total }

        if (!accumulator[balance.address]) {
            accumulator[balance.address] = [value]
        } else {
            accumulator[balance.address].push(value)
        }
    }

    for (const k in accumulator) {
        const addressTotal = accumulator[k].map(x => x.totalUsd).reduce((curr, next) => curr + next);

        summary.addresses.push({ 
            address: k, 
            totalUsd: addressTotal, 
            values: accumulator[k] 
        })

        summary.totalUsd += addressTotal;
    }

    return summary;
}

export async function totalsHistoric() {

}

function getUsdFromValue(value: Value, prices: Price[]) {
    const latestPriceForSymbol = prices.find((p) => p.symbol == value.symbol);
    if (!latestPriceForSymbol) {
        console.error(`No price found for symbol. symbol=${value.symbol}`)
        return 0;
    }

    if(latestPriceForSymbol.priceQuotedSymbol != "USD") {
        const innerPrice = prices.find((p) => latestPriceForSymbol.priceQuotedSymbol == p.symbol);

        if (!innerPrice) {
            console.error(`No price found for inner symbol. symbol=${value.symbol}`)
            return 0;
        }

        return parseFloat(latestPriceForSymbol.price) * parseFloat(innerPrice.price) * value.qty;
    }

    return parseFloat(latestPriceForSymbol.price) * value.qty;
}