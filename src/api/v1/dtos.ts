export type CreateAssetDto = {
    name: string,
    symbol: string
}

export type CreateTransactionDto = {
    type: "transfer" | "trade",
    buyQty: number,
    buySymbol: string,
    sellQty: number,
    sellSymbol: string,
    sender: string,
    receiver: string,
    timestamp: Date
}

export type CreatePriceDto = {
    symbol: string,
    priceUsd: number,
    timestamp: Date
}