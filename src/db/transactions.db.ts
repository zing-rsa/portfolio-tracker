import client from "./client.ts"
import { Transaction } from "./models.ts";

export async function get(id?: string): Promise<Transaction | null> {
    const results = await list(id);
    return results.length == 0 ? null : results[0];
}

export async function list(id?: string): Promise<Array<Transaction>> {
    let where = "";
    if (id != null)
        where += (where.includes("WHERE") ? "AND " : "WHERE ") + `id = ${id} `;

    const query = `select * from public.transactions ${where}; `;

    console.log("Executing query: ", query)
    const result = await client.queryObject<Transaction>(query);

    return result.rows;
}

export async function create(txn: Transaction) {
    const query = `
    insert into public.assets ("quantity", "symbol", "action", "timestamp") values
    ('${txn.quantity}', '${txn.symbol}', '${txn.action}', '${txn.timestamp}')
    returning *; `;

    const result = await client.queryObject<Transaction>(query);

    return result.rows[0];
}