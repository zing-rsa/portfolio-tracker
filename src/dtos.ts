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
    timestamp: Date
    fees: number
    feesSymbol: string
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
    address: string
}