export type CreateAssetDto = {
    name: string,
    symbol: string
}

type CreateTransactionDto = {
    type: "transfer" | "trade",
    timestamp: Date
    fees: number
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