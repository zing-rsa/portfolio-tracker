import { and, eq } from "drizzle-orm/expressions";

import { cars } from "./schema.ts";
import { Car } from "./models.ts";
import { db } from "./db.ts"

export async function get(id?: number, name?: string): Promise<Car | null> {
    const results = await list(id, name);
    return results.length == 0 ? null : results[0];
}

export async function list(id?: number, name?: string): Promise<Car[]> {
    const results = await db.select().from(cars).where(
        and(
            id ? eq(cars.id, id) : undefined,
            name ? eq(cars.name, name) : undefined
        )
    )

    return results;
}

export async function findCarById(carId: number) {
    return await db.select().from(cars).where(
      eq(cars.id, carId),
    );
}