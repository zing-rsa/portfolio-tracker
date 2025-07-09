import { CreateTradeDto, CreateTransferDto } from "../dtos.ts";
import { TransactionsDb } from "../db/mod.ts"
import { Trade, Transfer } from "../models.ts";

export async function get(id?: number) {
    const results = await list(id);
    return results.length == 0 ? null : results[0];
}

export async function list(id?: number) {
    return await TransactionsDb.list();
}

export async function createTrade(dto: CreateTradeDto) {
    const txn: Trade = { ...dto, ident: 0, fees: dto.fees.toString(), buyQty: dto.buyQty.toString(), sellQty: dto.sellQty.toString() };
    return await TransactionsDb.createTrade(txn);
}

export async function createTransfer(dto: CreateTransferDto) {
    const txn: Transfer = { ...dto, ident: 0, fees: dto.fees.toString(), qty: dto.qty.toString() };
    return await TransactionsDb.createTransfer(txn);
}