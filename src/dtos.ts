export type CreateAssetDto = {
    name: string,
    symbol: string
}

type CreateTransactionDto = {
    type: "transfer" | "trade",
    timestamp: Date
    fees: number
    feesSymbol: string
}

export type CreateTradeDto = CreateTransactionDto & {
    buyQty: number,
    buySymbol: string,
    sellQty: number,
    sellSymbol: string
}

export type CreateTransferDto =  CreateTransactionDto & {
    sender: string,
    receiver: string,
    qty: number,
    symbol: string
}

export type CreatePriceDto = {
    symbol: string,
    priceUsd: number,
    timestamp: Date
}

export type Balance = {
    address: string,
    values: Value[],
    totalUsd: number
}

export type Value = {
    qty: number,
    symbol: string
}

export type CsvTransaction = {
    type: "transfer" | "trade",
    timestamp: string,
    fees: string,
    feesSymbol: string
    ident: string,
    sender: string,
    receiver: string,
    qty: string,
    symbol: string,
    buyQty: string,
    buySymbol: string,
    sellQty: string,
    sellSymbol: string
}