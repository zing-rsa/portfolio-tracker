import { CreateTradeDto, CreateTransferDto } from "../api/v1/dtos.ts";
import { TransactionsDb } from "../db/mod.ts"
import { Trade, Transfer } from "../db/models.ts";

export async function get(id?: string) {
    const results = await list(id);
    return results.length == 0 ? null : results[0];
}

export async function list(id?: string) {
    return await TransactionsDb.list(id);
}

export async function createTrade(dto: CreateTradeDto) {
    const txn: Trade = { ...dto };
    return await TransactionsDb.createTrade(txn);
}

export async function createTransfer(dto: CreateTransferDto) {
    const txn: Transfer = { ...dto };
    return await TransactionsDb.createTransfer(txn);
}