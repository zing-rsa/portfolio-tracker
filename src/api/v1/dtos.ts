export type CreateAssetDto = {
    name: string,
    symbol: string
}

export type CreateTransactionDto = {
    quantity: number,
    symbol: string,
    action: string,
    timestamp: Date
}

export type CreatePriceDto = {
    symbol: string,
    price_usd: number,
    timestamp: Date
}