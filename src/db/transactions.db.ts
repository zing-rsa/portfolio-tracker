import client from "./client.ts"
import { Trade, Transaction, TransactionFlat, Transfer } from "./models.ts";


import { db } from "./db.ts"
import { transactions, trades, transfers } from "./schema.ts";

export async function get(id?: string): Promise<Transaction | null> {
    const results = await list(id);
    return results.length == 0 ? null : results[0];
}

export async function list(id?: string): Promise<Array<Transaction>> {
    let where = "";
    if (id != null)
        where += (where.includes("WHERE") ? "AND " : "WHERE ") + `id = ${id} `;

    const query = `select * from public.transactions ${where} order by "timestamp" asc;`;

    console.log("Executing query: ", query)
    const result = await client.queryObject<Transaction>(query);

    return result.rows;
}

export async function listWithEntities(id?: string): Promise<Array<TransactionFlat>> {
    let where = "";
    if (id != null)
        where += (where.includes("WHERE") ? "AND " : "WHERE ") + `t.id = ${id} `;

    const query = `
    select t.id, t.type, t."timestamp", t.fees, t."feesSymbol", trns.sender, trns.receiver, trns.qty, trns.symbol, trds."buyQty", trds."buySymbol", trds."sellQty", trds."sellSymbol" 
    from public.transactions t
    left join public.transfers trns on t."type" = 'transfer' and t.ident = trns.id
    left join public.trades trds on t."type" = 'trade' and t.ident = trds.id
    ${where} 
    order by t."timestamp" asc;`;

    console.log("Executing query: ", query)
    const result = await client.queryObject<TransactionFlat>(query);

    return result.rows;
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

export async function listTransfers(): Promise<Array<Transfer>> {
    const query = `select * from public.transfers; `;

    console.log("Executing query: ", query)
    const result = await client.queryObject<Transfer>(query);

    return result.rows;
}

export async function clear(): Promise<any> {
    const query = `
    delete from public.transfers;
    delete from public.trades;
    delete from public.transactions;`;

    console.log("Executing query: ", query)
    await client.queryObject(query);
}
