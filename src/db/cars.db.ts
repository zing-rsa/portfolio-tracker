import { Car } from "./models.ts";
import { db } from "./db.ts"
import { cars } from "./schema.ts";
import { and, eq } from "drizzle-orm/expressions";

export async function get(id?: number, name?: string): Promise<Car | null> {
    const results = await list(id, name);
    return results.length == 0 ? null : results[0];
}

export async function list(id?: number, name?: string): Promise<Car[]> {
    console.log('checking id: ', id)
    console.log('checking name: ', name)
    const results = await db.select().from(cars).where(
        and(
            id ? eq(cars.id, id) : undefined,
            name ? eq(cars.name, name) : undefined
        )
    )

    return results;
}


// Find car by id.
export async function findCarById(carId: number) {
    return await db.select().from(cars).where(
      eq(cars.id, carId),
    );
}