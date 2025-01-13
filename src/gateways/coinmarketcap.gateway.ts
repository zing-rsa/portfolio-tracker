import { CmcListingsLatestResponse, CmcQuotesLatestResponse, FetchLatestPriceResponse } from "./dtos.ts";
import axiod from "https://deno.land/x/axiod/mod.ts"

const apiBaseUrl = Deno.env.get("CMC_API_BASE_URL");
const apiKey = Deno.env.get("CMC_API_KEY");

if (!apiBaseUrl || !apiKey) 
    throw new Error("CoinMarketcap api credentials are required");

export async function fetchLatestPrice(symbol: string): Promise<FetchLatestPriceResponse> {
    if (!symbol) throw new Error("Symbol must be supplied");

    const endpoint = apiBaseUrl + `/v1/cryptocurrency/quotes/latest?symbol=${symbol}`

    // console.log('cmc request:', endpoint)
    const res = await axiod<CmcQuotesLatestResponse>(endpoint, { headers: { "X-CMC_PRO_API_KEY": apiKey! }});
    // console.log('cmc response:', res)

    return {
        price: res.data.data[symbol].quote["USD"].price,
        timestamp: new Date(res.data.data[symbol].quote["USD"].last_updated),
        symbol: symbol
    }
}

export async function fetchLatestPricesTop20(): Promise<FetchLatestPriceResponse[]> {

    const endpoint = apiBaseUrl + `/v1/cryptocurrency/listings/latest?sort=market_cap&limit=20`

    // console.log('cmc request:', endpoint)
    const res = await axiod<CmcListingsLatestResponse>(endpoint, { headers: { "X-CMC_PRO_API_KEY": apiKey! }});
    // console.log('cmc response:', res)

    return res.data.data.map((x) => {
        return { 
            symbol: x.symbol,
            price: x.quote["USD"].price,
            timestamp: new Date(x.quote["USD"].last_updated)
        }
    })
}
