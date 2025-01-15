import { Address } from "../models.ts";
import { addresses } from "./schema.ts";
import { db } from "./db.ts"
import { eq } from "drizzle-orm/expressions";

export async function list(id?: number): Promise<Address[]> {
    const results = await db
        .select()
        .from(addresses)
        .where(id ? eq(addresses.id, id) : undefined);

    return results;
}