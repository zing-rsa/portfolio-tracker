export type Tenant = {
    id?: string,
    email: string,
    name: string,
    api_key: string,
    claims?: string[]
    roles?: string[]
}

export type OnboardRequestDTO = {
    name: string,
    email: string
}

export type Schedule = {
    id: string,
    function_name: string,
    run_datetime: Date,
    run_interval_minutes: number,
    last_run_datetime: Date
}

// Data

export type Car = {
    id: string,
    name: string
}

export type Asset = {
    id?: number,
    name: string,
    symbol: string
}

export type Transaction = {
    id?: number,
    type: "transfer" | "trade",
    timestamp: Date,
    fees: string,
    feesSymbol: string
    ident: number
}

export type Transfer = Transaction & {
    sender: string,
    receiver: string,
    qty: string,
    symbol: string
}

export type Trade = Transaction & {
    buyQty: string,
    buySymbol: string,
    sellQty: string,
    sellSymbol: string
}

export type TransactionFlat = Transaction & Transfer & Trade

export type Price = {
    id?: number,
    symbol: string,
    priceUsd: string,
    timestamp: Date
}