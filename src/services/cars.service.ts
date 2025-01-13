import { CarsDb } from "../db/mod.ts"
import { findCarById } from "../db/cars.db.ts";

export async function list(id?: number, name?: string) {
    return await CarsDb.list(id, name);
}

export async function get(id: number) {
    const results = await findCarById(id);
    return results;
}