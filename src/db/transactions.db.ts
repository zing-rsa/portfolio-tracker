import client from "./client.ts"
import { Trade, Transaction, TransactionFlat, Transfer } from "./models.ts";

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

export async function clear(): Promise<any> {
    const query = `
    delete from public.transfers;
    delete from public.trades;
    delete from public.transactions;`;

    console.log("Executing query: ", query)
    await client.queryObject(query);
}
