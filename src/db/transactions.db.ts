import client from "./client.ts"
import { Trade, Transaction, Transfer } from "./models.ts";

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

export async function createTrade(txn: Trade) {
    const query = `
    with inserted as (insert into trades (buyQty, buySymbol, sellQty, sellSymbol) values (${txn.buyQty}, '${txn.buySymbol}', ${txn.sellQty}, '${txn.sellSymbol}') returning id)
    insert into transactions ("timestamp", fees, ident, "type") select ${txn.timestamp}, ${txn.fees}, id, 'transfer' from inserted; `;

    await client.queryObject(query);
}

export async function createTransfer(txn: Transfer) {
    const query = `
    with inserted as (insert into transfers (qty, symbol, sender, receiver) values (${txn.qty}, '${txn.symbol}', '${txn.sender}', '${txn.receiver}') returning id)
    insert into transactions ("timestamp", fees, ident, "type") select ${txn.timestamp}, ${txn.fees}, id, 'transfer' from inserted; `;

    await client.queryObject(query);
}

export async function listTransfers(): Promise<Array<Transfer>> {
    const query = `select * from public.transfers; `;

    console.log("Executing query: ", query)
    const result = await client.queryObject<Transfer>(query);

    return result.rows;
}
