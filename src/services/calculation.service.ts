import { BalanceSummary, HistoricTotal, Value } from "../dtos.ts";
import { TransactionsDb } from "../db/mod.ts";

export async function balancesToday(refresh?: boolean) : Promise<BalanceSummary> {
    const addressBalances = await TransactionsDb.listHistoricAddressBalances(refresh)
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
            parseFloat(x.qty) > 0 // only calculate on positive non-zero qtys
        )

    for (const balance of todayInfo) {
        const value: Value = { symbol: balance.symbol, qty: parseFloat(balance.qty), totalUsd: parseFloat(balance.total), priceUsd: parseFloat(balance.price) }

        if (!accumulator[balance.address]) {
            accumulator[balance.address] = [value]
        } else {
            accumulator[balance.address].push(value)
        }
    }

    for (const key in accumulator) {
        const addressTotal = accumulator[key].map(x => x.totalUsd).reduce((curr, next) => curr + next);

        summary.addresses.push({ 
            address: key, 
            totalUsd: addressTotal, 
            values: accumulator[key]
        })

        summary.totalUsd += addressTotal;
    }

    return summary;
}

export async function totalsHistoric(refresh?: boolean): Promise<HistoricTotal[]> {
    let addressBalances = await TransactionsDb.listHistoricAddressBalances(refresh)
    const accumulator: Record<string, number> = {};
    const records: HistoricTotal[] = [];

    addressBalances = addressBalances.filter(x => parseFloat(x.qty) > 0);

    for (const record of addressBalances) {
        const dateString = record.date.toISOString()
        if (!accumulator[dateString]) {
            accumulator[dateString] = parseFloat(record.total)
        } else {
            accumulator[dateString] += parseFloat(record.total)
        }
    }

    for (const key in accumulator) {
        records.push({ date: new Date(key), total: accumulator[key]})
    }
    
    return records;
}

export async function cacheAddressBalances(): Promise<void> {
    console.log("caching address balances")
    await TransactionsDb.cacheAddressBalances()
    console.log("caching address balances completed")
}