import { CarsDb } from "../db/mod.ts"
import { findCarById } from "../db/cars.db.ts";

// export async function get(id?: string) {
//     const results = await list(id);
//     return results.length == 0 ? null : results[0];
// }

export async function list(id?: string) {
    return await CarsDb.list(id);
}

export async function get(id: string) {
    const results = await findCarById(parseInt(id));
    return results;
}