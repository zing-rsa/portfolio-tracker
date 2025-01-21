import { parse, stringify } from "jsr:@std/csv";

let csv = await Deno.readTextFile("./withlinenumbers.csv")

const data = parse(csv, {
  skipFirstRow: true,
  strip: true,
});

type recordInfo = {
  type: string,
  qty?: number,
  symbol?: string,
  buy: number,
  buySymbol: string,
  sell: number,
  sellSymbol: string,
  fee: number
  feeSymbol: string,
  wd?: string
  date?: string
}


const accum: Record<string, recordInfo> = {}
const lines = new Set()
const deposits = []

for (const line of data) {

  if (line.Operation == 'Deposit' ) {
    deposits.push({ 
      type: 'transfer',
      qty: Math.abs(parseFloat(line.Change)),
      symbol: line.Coin,
      fee: 0,
      feeSymbol: "",
      buy: 0,
      buySymbol: "",
      sell: 0,
      sellSymbol: "",
      wd: "d",
      date: line.UTC_Time
    })
    lines.add(line.num)
  }

  if (accum[line.UTC_Time]) {

    if (line.Operation == 'Transaction Fee' || line.Operation == 'Fee' ) {
      accum[line.UTC_Time].fee += Math.abs(parseFloat(line.Change))
      accum[line.UTC_Time].feeSymbol = line.Coin
      lines.add(line.num)
    }

    if (line.Operation == 'Transaction Sell' || 
        line.Operation == 'Sell' ||
        line.Operation == 'Transaction Sold' || 
        line.Operation == 'Transaction Spend'
    ) {
      accum[line.UTC_Time].sell += Math.abs(parseFloat(line.Change))
      accum[line.UTC_Time].sellSymbol = line.Coin
      lines.add(line.num)
    }
    
    if (line.Operation == 'Transaction Buy' || 
        line.Operation == 'Buy' ||
        line.Operation == 'Transaction Revenue') {
      accum[line.UTC_Time].buy += Math.abs(parseFloat(line.Change))
      accum[line.UTC_Time].buySymbol = line.Coin
      lines.add(line.num)
    }

    if (line.Operation == 'Binance Convert' || line.Operation == 'Transaction Related') {
      if (parseFloat(line.Change) < 0) {
        accum[line.UTC_Time].sell += Math.abs(parseFloat(line.Change));
        accum[line.UTC_Time].sellSymbol = line.Coin
        lines.add(line.num)
      }

      if (parseFloat(line.Change) > 0) {
        accum[line.UTC_Time].buy += Math.abs(parseFloat(line.Change));
        accum[line.UTC_Time].buySymbol = line.Coin;
        lines.add(line.num)
      }
    }

  } else {

    if (line.Operation == 'Commission Rebate' || line.Operation == 'Airdrop Assets' ) {
      accum[line.UTC_Time] = { 
        type: 'transfer',
        qty: Math.abs(parseFloat(line.Change)),
        symbol: line.Coin,
        fee: 0,
        feeSymbol: line.Coin,
        buy: 0,
        buySymbol: "",
        sell: 0,
        sellSymbol: "",
        wd: "d"
      }
      lines.add(line.num)
    }

    if (line.Operation == 'Withdraw' ) {
      accum[line.UTC_Time] = { 
        type: 'transfer',
        qty: Math.abs(parseFloat(line.Change)),
        symbol: line.Coin,
        fee: 0,
        feeSymbol: "",
        buy: 0,
        buySymbol: "",
        sell: 0,
        sellSymbol: "",
        wd: "w"
      }
      lines.add(line.num)
    }

    if (line.Operation == 'Transaction Fee' || line.Operation == 'Fee' ) {
      accum[line.UTC_Time] = { 
        type: 'trade',
        fee:  Math.abs(parseFloat(line.Change)),
        feeSymbol: line.Coin,
        buy: 0,
        buySymbol: "",
        sell: 0,
        sellSymbol: "",
      }
      lines.add(line.num)
    }

    if (line.Operation == 'Transaction Sell' || 
        line.Operation == 'Sell' ||
        line.Operation == 'Transaction Sold' || 
        line.Operation == 'Transaction Spend'
      ) {
      accum[line.UTC_Time] = { 
        type: 'trade',
        sell:  Math.abs(parseFloat(line.Change)),
        sellSymbol: line.Coin,
        buy: 0,
        buySymbol: "",
        fee: 0,
        feeSymbol: "",
      }
      lines.add(line.num)
    }
    
    if (line.Operation == 'Transaction Buy' || 
        line.Operation == 'Buy' ||
        line.Operation == 'Transaction Revenue') {
      accum[line.UTC_Time] = { 
        type: 'trade',
        buy:  Math.abs(parseFloat(line.Change)),
        buySymbol: line.Coin,
        sell: 0,
        sellSymbol: "",
        fee: 0,
        feeSymbol: ""
      }
      lines.add(line.num)
    }

    if (line.Operation == 'Binance Convert' || line.Operation == 'Transaction Related') {
      if (parseFloat(line.Change) < 0) {
        accum[line.UTC_Time] = { 
          type: 'trade',
          sell:  Math.abs(parseFloat(line.Change)),
          sellSymbol: line.Coin,
          buy: 0,
          buySymbol: "",
          fee: 0,
          feeSymbol: "",
        }
        lines.add(line.num)
      }

      if (parseFloat(line.Change) > 0) {
        accum[line.UTC_Time] = { 
          type: 'trade',
          buy:  Math.abs(parseFloat(line.Change)),
          buySymbol: line.Coin,
          sell: 0,
          sellSymbol: "",
          fee: 0,
          feeSymbol: ""
        }
        lines.add(line.num)
      }
    }
  }
}

const notMatchedLines = []

for (const line of data) {
  if (!lines.has(line.num)) {
    notMatchedLines.push(line)
  }
}

const notMatchedOut = stringify(notMatchedLines, {
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

Deno.writeTextFile("./notMatched.csv", notMatchedOut);

const matched: Record<string, string>[] = []

for (const key in accum) {

  if (accum[key].type == "trade") {
    matched.push(
      {
        type: "trade",
        timestamp: key,
        fees: accum[key].fee.toString(),
        feesSymbol: accum[key].feeSymbol,
        sender: "",
        receiver: "",
        qty: "",
        symbol: "",
        buyQty: accum[key].buy.toString(),
        buySymbol: accum[key].buySymbol,
        sellQty: accum[key].sell.toString(),
        sellSymbol: accum[key].sellSymbol,
        address: "binance wallet",
        txId: ""
      }
    )
  }

  if (accum[key].type == "transfer") {
    matched.push(
      {
        type: "transfer",
        timestamp: key,
        fees: "0",
        feesSymbol: "",
        sender: accum[key].wd == 'w' ? "binance wallet" : "",
        receiver: accum[key].wd == 'd' ? "binance wallet" : "",
        qty: accum[key].qty!.toString(),
        symbol: accum[key].symbol!,
        buyQty: "",
        buySymbol: "",
        sellQty: "",
        sellSymbol: "",
        address: "",
        txId: ""
      }
    )
  }
}

for (const dep of deposits) {
  matched.push(
    {
      type: "transfer",
        timestamp: dep.date,
        fees: "0",
        feesSymbol: "",
        sender: "",
        receiver: "binance wallet",
        qty: dep.qty!.toString(),
        symbol: dep.symbol!,
        buyQty: "",
        buySymbol: "",
        sellQty: "",
        sellSymbol: "",
        address: "",
        txId: ""
    }
  )
}

const matchedOut = stringify(matched, {
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
    "address",
    "txId",
  ],
});

Deno.writeTextFile("./matched.csv", matchedOut);