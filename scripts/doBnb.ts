import { parse, stringify } from "jsr:@std/csv";

let csv = await Deno.readTextFile("./notMatched.csv")

const data = parse(csv, {
  skipFirstRow: true,
  strip: true,
});

const coinAPiKey=""
const coinApiBaseUrl="https://rest.coinapi.io/v1/exchangerate"

const matched: Record<string, string>[] = []

for (const line of data) {
    if (line.Operation == 'Small Assets Exchange BNB') {
      const url = `${coinApiBaseUrl}/${line.Coin}/USD?time=${line.UTC_Time}`;

      console.log(url)

      const res = await fetch(url, 
      { 
        headers: {
          "X-CoinAPI-Key": coinAPiKey
        }
      })
      const json = await res.json()

      console.log(json)

      const amount = Math.abs(parseFloat(line.Change)) * json.rate

      const record = {
        ...line,
        usd: amount.toString()
      }
      console.log(record)

      matched.push(record)
    }
}

const out = stringify(matched, {
    columns: [
        "num",
        "User_ID",
        "UTC_Time",
        "Account",
        "Operation",
        "Coin",
        "Change",
        "Remark",
        "usd"
    ],
  });

Deno.writeTextFile("./withamounts.csv", out);