import { Balance, Value } from "../dtos.ts";
import { PricesDb, TransactionsDb } from "../db/mod.ts";
import { Price } from "../db/models.ts";

export async function balances(): Promise<Balance[]> {
    // get all values at each address
    // foreach address
    // all transfers where receiver = address - all where sender = address
    // foreach symbol
    // all trades where buy = symbol - sell = symbol
    // convert each value to usd
    // sum and add to totalUsd

    const addressMap: Record<string, Record<string, number>> = {};

    const transfers = await TransactionsDb.listTransfers();

    for (let i = 0; i < transfers.length; i++) {
        const element = transfers[i];

        if (element.receiver) {
            if (!addressMap[element.receiver]) {
                addressMap[element.receiver] = { [element.symbol]: parseFloat(element.qty) };
            } else {
                if (!addressMap[element.receiver][element.symbol]) {
                    addressMap[element.receiver][element.symbol] = parseFloat(element.qty);
                } else { 
                    addressMap[element.receiver][element.symbol] += parseFloat(element.qty);
                }
            }
        }

        if (element.sender) { // don't track null sender
            if (!addressMap[element.sender]) {
                addressMap[element.sender] = { [element.symbol]: -parseFloat(element.qty) };
            } else {
                if (!addressMap[element.sender][element.symbol]) {
                    addressMap[element.sender][element.symbol] = -parseFloat(element.qty);
                } else {
                    addressMap[element.sender][element.symbol] -= parseFloat(element.qty);
                }
            }
        }
    }

    const balances: Balance[] = [];
    const latestPrices = await PricesDb.listLatestOnly();

    console.log(latestPrices)

    for (const address in addressMap) {
        const balance: Balance = { address: address, values: [], totalUsd: 0 }

        for (const symbol in addressMap[address]) {
            const value = { symbol, qty: addressMap[address][symbol]}
            balance.values.push(value)
            balance.totalUsd += getUsdFromValue(value, latestPrices)
        }

        balances.push(balance)
    }

    return balances;
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