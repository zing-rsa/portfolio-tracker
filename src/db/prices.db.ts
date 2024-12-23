import client from "./client.ts"
import { Price } from "./models.ts";

export async function list(): Promise<Array<Price>> {
    const query = `select * from public.prices order by timestamp asc; `;

    console.log("Executing query: ", query)
    const result = await client.queryObject<Price>(query);

    return result.rows;
}

export async function listLatestOnly(): Promise<Array<Price>> {
    const query = `
        with latest_prices as (select symbol, max("timestamp") as "timestamp" from prices group by symbol)
        select p.id, p.symbol, p."priceUsd", p.timestamp 
        from latest_prices lp 
        join prices p on p.symbol = lp.symbol and p."timestamp" = lp.timestamp; `;

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