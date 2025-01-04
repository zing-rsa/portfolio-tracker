// CMC
export type CmcQuotesLatestResponse = {
    data: Record<string, CmcQuotesLatestData>
}

export type CmcQuotesLatestData = {
    id: number,
    name: string,
    symbol: string
    quote: Record<string, CmcCurrencyQuote>
}

export type CmcCurrencyQuote = {
    price: number, 
    volume_24h: number
    last_updated: Date
}

export type CmcListingsLatestResponse = {
    data: CmcQuotesLatestData[]
}


// internal
export type FetchLatestPriceResponse = {
    symbol: string,
    price: number,
    timestamp: Date
}