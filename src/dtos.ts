export type OnboardRequestDTO = {
    name: string,
    email: string
}

export type CreateAssetDto = {
    name: string,
    symbol: string
}

type CreateTransactionDto = {
    type: "transfer" | "trade",
    timestamp: Date,
    fees: number,
    feesSymbol: string,
    txId: string,
    note: string
}

export type CreateTradeDto = CreateTransactionDto & {
    buyQty: number,
    buySymbol: string,
    sellQty: number,
    sellSymbol: string,
    address: string
}

export type CreateTransferDto =  CreateTransactionDto & {
    sender: string,
    receiver: string,
    qty: number,
    symbol: string
}

export type CreatePriceDto = {
    symbol: string,
    price: number,
    priceQuotedSymbol: string,
    timestamp: Date
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
    sellSymbol: string,
    address: string,
    txId: string,
    note: string
}

export type BalanceSummary = {
    addresses: AddressBalanceSummary[],
    totalUsd: number
}

export type AddressBalanceSummary = {
    address: string,
    values: Value[]
    totalUsd: number
}

export type AddressBalance = {
    date: Date,
    address: string,
    qty: number,
    symbol: string,
    price: number,
    total: number,
}

export type Value = {
    symbol: string,
    qty: number,
    totalUsd: number,
    priceUsd: number
}

export type HistoricTotal = {
    date: Date,
    total: number
}