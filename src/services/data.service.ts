import { TransactionsDb } from "../db/mod.ts";
import { parse, stringify } from "jsr:@std/csv";
import { CsvTransaction } from "../dtos.ts";
import { uploadCsvFile } from "../gateways/drive.gateway.ts";

export async function exportToCsv(): Promise<string> {
  const transactions = await TransactionsDb.listFlat();

  const transactionLines = transactions.map((x) => {
    return {
      ...x,
      timestamp: x.timestamp.toISOString(),
    };
  });

  const csv = stringify(
    transactionLines,
    {
      columns: [ // TODO, add txId, note
        "type",
        "timestamp",
        "fees",
        "feesSymbol",
        "sender",
        "receiver",
        "qty",
        "symbol",
        "buyQty",
        "buySymbol",
        "sellQty",
        "sellSymbol",
        "address",
        "txId",
        "note"
      ],
    },
  );

  return csv;
}

export async function importFromCsv(csv: string, overwrite: boolean) {
  const lines = parse(csv, {
    skipFirstRow: true,
    strip: true,
    columns: [
      // TODO, add txId, note
      "type",
      "timestamp",
      "fees",
      "feesSymbol",
      "sender",
      "receiver",
      "qty",
      "symbol",
      "buyQty",
      "buySymbol",
      "sellQty",
      "sellSymbol",
      "address",
      "txId",
      "note"
    ],
  });

  const data: CsvTransaction[] = lines.map((x: any) => {
    for (let key in x) {
      if (x[key] === "") x[key] = null;
    }

    return x;
  });

  if (overwrite) {
    await TransactionsDb.clear();
  }

  for (const transaction of data) {
    if (transaction.type === "transfer") {
      await TransactionsDb.createTransfer({ ...transaction, timestamp: new Date(transaction.timestamp), ident: 0});
    } else if (transaction.type === "trade") {
      await TransactionsDb.createTrade({ ...transaction, timestamp: new Date(transaction.timestamp), ident: 0});
    }
  }
}

export async function saveStateToDrive() {
    console.log("saving state to drive")

    const bypassFlag = Deno.env.get("BYPASS_SAVE_STATE");

    if (bypassFlag != undefined && JSON.parse(bypassFlag) === true) {
      console.log("bypassing state save due to env flag")
      return;
    }

    const timestamp = new Date();

    const csvData = await exportToCsv(); 

    await uploadCsvFile(
      `crypto-transaction-history_backup_${timestamp.toISOString()}`,
       csvData
    );
}
