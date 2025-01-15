export type Tenant = {
    id?: string,
    email: string,
    name: string,
    api_key: string,
    claims?: string[]
    roles?: string[]
}

export type Schedule = {
    id: string,
    function_name: string,
    run_datetime: Date,
    run_interval_minutes: number,
    last_run_datetime: Date
}

export type BalanceSummary = {
    balances: AddressBalance[],
    totalUsd: number
}

export type AddressBalance = {
    address: string,
    assets: AssetSummary[],
    totalUsd: number
}

export type AssetSummary = {
    value: Value
    totalUsd: number
} 

export type Value = {
    qty: number,
    symbol: string
}

export type Car = {
    id: number,
    name: string
}

export type Asset = {
    id?: number,
    name: string,
    symbol: string
}

export type Transaction = {
    id?: number,
    type: string,
    timestamp: Date,
    fees: string | null,
    feesSymbol: string | null
    ident: number
}

export type Transfer = Transaction & {
    sender?: string | null,
    receiver?: string | null,
    qty: string,
    symbol: string
}

export type Trade = Transaction & {
    buyQty: string,
    buySymbol: string,
    sellQty: string,
    sellSymbol: string
}

export type TransactionFlat = {
    id?: number,
    type: string,
    timestamp: Date,
    fees: string | null,
    feesSymbol: string | null
    sender?: string | null,
    receiver?: string | null,
    qty: string | null,
    symbol: string | null,
    buyQty: string | null,
    buySymbol: string | null,
    sellQty: string | null,
    sellSymbol: string | null
}

export type Price = {
    id?: number,
    symbol: string,
    price: string,
    priceQuotedSymbol: string,
    timestamp: Date
}