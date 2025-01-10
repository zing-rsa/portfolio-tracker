import { TransactionsDb } from "../db/mod.ts";
import { parse, stringify } from "jsr:@std/csv";
import { TransactionFlat } from "../db/models.ts";

export async function exportToCsv() {
  const transactions = await TransactionsDb.listWithEntities();

  const transactionLines = transactions.map((x) => {
    return {
      ...x,
      timestamp: x.timestamp.toISOString(),
    };
  });

  const csv = stringify(
    transactionLines,
    {
      columns: [
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
      ],
    },
  );

  Deno.writeTextFile("./example.csv", csv);
}

export async function importFromCsv(csv: string, overwrite: boolean) {
  const lines = parse(csv, {
    skipFirstRow: true,
    strip: true,
    columns: [
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
    ],
  });

  const data: TransactionFlat[] = lines.map((x: any) => {
    for (let key in x) {
      if (x[key] === "") x[key] = null;
    }

    return x;
  });
  console.log(data);

  if (overwrite) {
    await TransactionsDb.clear();
  }

  for (const transaction of data) {
    if (transaction.type === "transfer") {
      await TransactionsDb.createTransfer(transaction);
    } else if (transaction.type === "trade") {
      await TransactionsDb.createTrade(transaction);
    }
  }
}
