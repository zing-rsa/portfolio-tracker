import { TransactionsDb } from "../db/mod.ts"

export async function exportToCsv() {
    const transactions = await TransactionsDb.list();

    console.log(transactions)
}

export async function generateSqlFromCsv() {

}