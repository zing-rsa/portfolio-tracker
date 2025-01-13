import { pgClient } from "./db.ts"
import { Car } from "./models.ts";
import { db } from "./db.ts"
import { cars as carsSchema } from "./schema.ts";
import { eq } from "drizzle-orm/expressions";

export async function get(id?: string, name?: string): Promise<Car | null> {
    const results = await list(id, name);
    return results.length == 0 ? null : results[0];
}

export async function list(id?: string, name?: string): Promise<Array<Car>> {
    let where = "";
    if (id != null)
        where += (where.includes("WHERE") ? "AND " : "WHERE ") + `id = ${id} `;
    if (name != null)
        where += (where.includes("WHERE") ? "AND " : "WHERE ") + `name = ${name} `;

    const query = `select * from public.cars ${where}; `;

    console.log("Executing query: ", query)
    const result = await pgClient.queryObject<Car>(query);

    return result.rows;
}


// Find car by id.
export async function findCarById(carId: number) {
    return await db.select().from(carsSchema).where(
      eq(carsSchema.id, carId),
    );
}