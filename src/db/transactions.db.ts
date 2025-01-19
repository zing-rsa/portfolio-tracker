import { AddressBalance, Trade, Transaction, TransactionFlat, Transfer } from "../models.ts";
import { transactions, trades, transfers } from "./schema.ts";
import { pgClient } from "./db.ts"
import { db } from "./db.ts"
import { eq, and, asc } from "drizzle-orm";
import { symbol, x } from "joi";

export async function get(id?: number): Promise<Transaction | null> {
    const results = await list(id);
    return results.length == 0 ? null : results[0];
}

export async function list(id?: number): Promise<Transaction[]> {

    const results = await db
        .select()
        .from(transactions)
        .where(
            and(
                id ? eq(transactions.id, id) : undefined
            )
        )
        .orderBy(transactions.timestamp);

    return results.map((x) => { return { ...x, timestamp: new Date(x.timestamp) }});
}

export async function listFlat(id?: number): Promise<TransactionFlat[]> {

    const results = await db
        .select({ id: transactions.id, type: transactions.type, timestamp: transactions.timestamp, fees: transactions.fees, feesSymbol: transactions.feesSymbol, sender: transfers.sender, receiver: transfers.receiver, qty: transfers.qty, symbol: transfers.symbol, buyQty: trades.buyQty, buySymbol: trades.buySymbol, sellQty: trades.sellQty, sellSymbol: trades.sellSymbol, address: trades.address })
        .from(transactions)
        .leftJoin(transfers, and(eq(transactions.type, 'transfer'), eq(transactions.ident, transfers.id)))
        .leftJoin(trades, and(eq(transactions.type, 'trade'), eq(transactions.ident, trades.id)))
        .where(
            and(
                id ? eq(transactions.id, id): undefined
            )
        )
        .orderBy(asc(transactions.timestamp))

    return results.map((x) => { return { ...x, timestamp: new Date(x.timestamp) }});
}

export async function createTrade(tradeFull: Trade) {
    const txn: typeof transactions.$inferInsert = { ...tradeFull, timestamp: tradeFull.timestamp.toISOString() };
    const trade: typeof trades.$inferInsert = tradeFull;

    const insertedTrade = await db.insert(trades).values(trade).returning();

    txn.ident = insertedTrade[0].id;

    return (await db.insert(transactions).values(txn).returning())[0]; 
}

export async function createTransfer(transferFull: Transfer) {
    const txn: typeof transactions.$inferInsert = { ...transferFull, timestamp: transferFull.timestamp.toISOString() };
    const transfer: typeof transfers.$inferInsert = transferFull;

    const insertedTransfer = await db.insert(transfers).values(transfer).returning();

    txn.ident = insertedTransfer[0].id;

    return (await db.insert(transactions).values(txn).returning())[0];
}

export async function listTransfers(): Promise<Transfer[]> {
    const query = `select * from public.transfers; `;

    console.log("Executing query: ", query)
    const result = await pgClient.queryObject<Transfer>(query);

    return result.rows;
}

export async function clear(): Promise<any> {
    await db.delete(transfers);
    await db.delete(trades);
    await db.delete(transactions);
}

export async function listHistoricAddressBalances() {
    
    const query = `
    with address_day_aggregates as (
    -- TODO: add transfers
        select 
            address,
            "date",
            sum(qty) as "qty",
            symbol
        from (
            -- all buys
            select 
                address,
                "timestamp"::date as "date",
                buy_qty as "qty",
                buy_symbol as "symbol"
            from trades t 
            join transactions tx on tx.ident = t.id and tx."type" = 'trade'
            union 
            -- all sells
            select 
                address,
                "timestamp"::date as "date",
                -sell_qty as "qty", -- negative
                sell_symbol as "symbol"
            from trades t 
            join transactions tx on tx.ident = t.id and tx."type" = 'trade'
        ) as "all" 
        group by address, "date", symbol -- group by to aggregate trades of the same address of the same symbol on the same day
        having sum(qty) <> 0 -- don't need 0's
    ), 
    cumulative_holdings as (
        select
            address,
            date,
            symbol,
            SUM(qty) OVER (PARTITION BY symbol, address ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS qty_held
        FROM address_day_aggregates
        order by date, address, symbol
    ),
    all_combos as (
        select dates."date", addresses.address, symbols_distinct.symbol
        from (
            select (generate_series((select min(timestamp) from transactions t ) at time zone 'UTC', now() at time zone 'UTC', '1 day'::interval) at time zone 'UTC')::date as "date"
        ) dates
        cross join (select distinct address from trades) addresses
        cross join (
            select distinct symbol 
            from (
                select buy_symbol as "symbol" from trades t 
                union
                select sell_symbol as "symbol" from trades t
            ) symbols_all
        ) symbols_distinct
    )
    select ac.*, ch.qty_held, p.price, p.price * ch.qty_held as "total"
    from all_combos ac
    join (
        select *
        from cumulative_holdings
    ) ch on ac.address = ch.address
        and ac.symbol = ch.symbol 
        and ch.date = (select max(date) from cumulative_holdings ch2 where ac.address = ch2.address and ac.symbol = ch2.symbol and ch2.date <= ac.date)
    join prices p on p.symbol = ac.symbol and p."timestamp" = (select max(timestamp) from prices p2 where p2.symbol = ac.symbol and p2.timestamp <= ac.date)
    -- TODO: add price quoted symbols
    order by date, address, symbol;`

    const results = await pgClient.queryObject<AddressBalance>(query);
    return results.rows;
}