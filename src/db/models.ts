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
    buyQty: number,
    buySymbol: string,
    sellQty: number,
    sellSymbol: string,
    sender: string,
    receiver: string,
    timestamp: Date
}

export type Price = {
    id?: number,
    symbol: string,
    priceUsd: number,
    timestamp: Date
}