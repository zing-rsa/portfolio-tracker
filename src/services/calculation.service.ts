import { AddressBalance, BalanceSummary, Value } from "../models.ts";
import { AddressesDb, PricesDb, TransactionsDb } from "../db/mod.ts";
import { Price } from "../models.ts";

export async function balances(): Promise<BalanceSummary> {
    const addressMap: Record<string, Record<string, number>> = {};
    const transactions = await TransactionsDb.listFlat();
    const excludedAddresses = new Set((await AddressesDb.list()).filter(x => !x.counted).map(x => x.address))

    for (let i = 0; i < transactions.length; i++) {
        const tx = transactions[i];

        if (tx.type == 'trade') {
            // these will always be set if trade
            tx.address = tx.address!;
            tx.buyQty = tx.buyQty!;
            tx.buySymbol = tx.buySymbol!;
            tx.sellQty = tx.sellQty!;
            tx.sellSymbol = tx.sellSymbol!;
            
            if (!addressMap[tx.address]) {
                addressMap[tx.address] = {
                    [tx.buySymbol]: parseFloat(tx.buyQty),
                    [tx.sellSymbol]: -parseFloat(tx.sellQty)
                };
            } else {
                if (!addressMap[tx.address][tx.buySymbol])
                    addressMap[tx.address][tx.buySymbol] = parseFloat(tx.buyQty)
                else 
                    addressMap[tx.address][tx.buySymbol] += parseFloat(tx.buyQty);

                if (!addressMap[tx.address][tx.sellSymbol])
                    addressMap[tx.address][tx.sellSymbol] = -parseFloat(tx.sellQty);
                else 
                    addressMap[tx.address][tx.sellSymbol] -= parseFloat(tx.sellQty);
            }
        } else if (tx.type == 'transfer') {
            // these will always be set if transfer
            tx.symbol = tx.symbol!;
            tx.qty = tx.qty!;

            if (tx.receiver) {
                if (!addressMap[tx.receiver]) {
                    addressMap[tx.receiver] = { [tx.symbol]: parseFloat(tx.qty) };
                } else {
                    if (!addressMap[tx.receiver][tx.symbol]) {
                        addressMap[tx.receiver][tx.symbol] = parseFloat(tx.qty);
                    } else { 
                        addressMap[tx.receiver][tx.symbol] += parseFloat(tx.qty);
                    }
                }
            }
    
            if (tx.sender) { // don't track null sender
                if (!addressMap[tx.sender]) {
                    addressMap[tx.sender] = { [tx.symbol]: -parseFloat(tx.qty) };
                } else {
                    if (!addressMap[tx.sender][tx.symbol]) {
                        addressMap[tx.sender][tx.symbol] = -parseFloat(tx.qty);
                    } else {
                        addressMap[tx.sender][tx.symbol] -= parseFloat(tx.qty);
                    }
                }
            }
        }
    }

    const summary: BalanceSummary = { balances: [], totalUsd: 0 }
    const latestPrices = await PricesDb.listLatestOnly();

    for (const address in addressMap) {
        const balance: AddressBalance = { address: address, assets: [], totalUsd: 0 }

        for (const symbol in addressMap[address]) {
            const value = { symbol, qty: addressMap[address][symbol] }
            const usd = getUsdFromValue(value, latestPrices);

            const asset = { value, totalUsd: usd }

            balance.assets.push(asset)
            balance.totalUsd += usd
        }

        summary.balances.push(balance)
    }

    summary.totalUsd = summary.balances
        .filter(x => !excludedAddresses.has(x.address))
        .map(x => x.totalUsd)
        .reduce((curr, next) => { return curr + next })

    return summary;
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