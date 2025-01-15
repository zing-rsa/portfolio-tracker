import { Trade, Transaction, TransactionFlat, Transfer } from "../models.ts";
import { transactions, trades, transfers } from "./schema.ts";
import { pgClient } from "./db.ts"
import { db } from "./db.ts"
import { eq, and, asc } from "drizzle-orm";
import { symbol, x } from "joi";

export async function get(id?: number): Promise<Transaction | null> {
    const results = await list(id);
    return results.length == 0 ? null : results[0];
}

export async function list(id?: number): Promise<Array<Transaction>> {

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

export async function listWithEntities(id?: number): Promise<Array<TransactionFlat>> {

    const results = await db
        .select({ id: transactions.id, type: transactions.type, timestamp: transactions.timestamp, fees: transactions.fees, feesSymbol: transactions.feesSymbol, sender: transfers.sender, receiver: transfers.receiver, qty: transfers.qty, symbol: transfers.symbol, buyQty: trades.buyQty, buySymbol: trades.buySymbol, sellQty: trades.sellQty, sellSymbol: trades.sellSymbol })
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

export async function listTransfers(): Promise<Array<Transfer>> {
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
