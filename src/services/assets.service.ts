import { CreateAssetDto } from "../api/v1/dtos.ts";
import { AssetsDb } from "../db/mod.ts"
import { Asset } from "../db/models.ts";

export async function get(id?: string) {
    const results = await list(id);
    return results.length == 0 ? null : results[0];
}

export async function list(id?: string) {
    return await AssetsDb.list(id);
}

export async function create(dto: CreateAssetDto) {
    const asset: Asset = { ...dto };
    return await AssetsDb.create(dto);
}