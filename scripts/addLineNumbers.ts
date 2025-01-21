import { parse, stringify } from "jsr:@std/csv";

let csv = await Deno.readTextFile("./AllTxHistory.csv")

const data = parse(csv, {
  skipFirstRow: true,
  strip: true,
});

let count = 0;

for (const line of data) {
    line.num = count.toString()
    count++;
}

const out = stringify(data, {
    columns: [
        "num",
        "User_ID",
        "UTC_Time",
        "Account",
        "Operation",
        "Coin",
        "Change",
        "Remark"
    ],
  });

Deno.writeTextFile("./withlinenumbers.csv", out);