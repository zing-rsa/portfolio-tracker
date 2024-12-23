import client from "./client.ts"
import { Price } from "./models.ts";

export async function get(id?: string): Promise<Price | null> {
    const results = await list(id);
    return results.length == 0 ? null : results[0];
}

export async function list(id?: string): Promise<Array<Price>> {
    let where = "";
    if (id != null)
        where += (where.includes("WHERE") ? "AND " : "WHERE ") + `id = ${id} `;

    const query = `select * from public.prices ${where}; `;

    console.log("Executing query: ", query)
    const result = await client.queryObject<Price>(query);

    return result.rows;
}

export async function create(price: Price) {
    const query = `
    insert into public.prices ("symbol", "price_usd", "timestamp") values
    ('${price.symbol}', '${price.priceUsd}', '${price.timestamp}')
    returning *; `;

    const result = await client.queryObject<Price>(query);

    return result.rows[0];
}