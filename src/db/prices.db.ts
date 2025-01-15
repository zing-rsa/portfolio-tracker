import { desc } from "drizzle-orm/expressions";

import { prices } from "./schema.ts";
import { Price } from "../models.ts";
import { db } from "./db.ts";

export async function list(): Promise<Price[]> {
    const results = await db.select().from(prices);

    return results.map((x) => {
        return { ...x, timestamp: new Date(x.timestamp) };
    });
}

export async function listLatestOnly(): Promise<Price[]> {

    const results = await db.selectDistinctOn([prices.symbol]).from(prices).orderBy(prices.symbol, desc(prices.timestamp));
    
    return results.map((x) => {
        return { ...x, timestamp: new Date(x.timestamp) };
    });
}

export async function create(price: Price) {
    const priceIns: typeof prices.$inferInsert = { ...price, timestamp: price.timestamp.toISOString()};

    const results = await db.insert(prices).values(priceIns).returning();

    return results[0];
}
