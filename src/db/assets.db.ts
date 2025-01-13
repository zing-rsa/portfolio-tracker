import { pgClient } from "./db.ts"
import { Asset } from "./models.ts";

export async function get(id?: string, name?: string): Promise<Asset | null> {
    const results = await list(id, name);
    return results.length == 0 ? null : results[0];
}

export async function list(id?: string, name?: string): Promise<Array<Asset>> {
    let where = "";
    if (id != null)
        where += (where.includes("WHERE") ? "AND " : "WHERE ") + `id = ${id} `;
    if (name != null)
        where += (where.includes("WHERE") ? "AND " : "WHERE ") + `name = ${name} `;

    const query = `select * from public.cars ${where}; `;

    console.log("Executing query: ", query)
    const result = await pgClient.queryObject<Asset>(query);

    return result.rows;
}

export async function create(asset: Asset) {
    const query = `
    insert into public.assets ("name", "symbol") values
    ('${asset.name}', '${asset.symbol}')
    returning *; `;

    const result = await pgClient.queryObject<Asset>(query);

    return result.rows[0];
}