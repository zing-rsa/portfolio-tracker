import { CreateTransactionDto } from "../api/v1/dtos.ts";
import { TransactionsDb } from "../db/mod.ts"
import { Transaction } from "../db/models.ts";

export async function get(id?: string) {
    const results = await list(id);
    return results.length == 0 ? null : results[0];
}

export async function list(id?: string) {
    return await TransactionsDb.list(id);
}

export async function create(dto: CreateTransactionDto) {
    const txn: Transaction = { ...dto };
    return await TransactionsDb.create(txn);
}