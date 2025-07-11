import axiod from "https://deno.land/x/axiod/mod.ts"
import { FetchLatestPriceResponse } from "./dtos.ts";

const baseUrl = Deno.env.get("JPG_STORE_BASE_URL");

export type JpgFloorResponse = {
    floor: number
}

export async function fetchBudzFloor(): Promise<FetchLatestPriceResponse> {

    const endpoint = baseUrl + `/collection/4523c5e21d409b81c95b45b0aea275b8ea1406e6cafea5583b9f8a5f/floor`

    const res = await axiod.get<JpgFloorResponse>(endpoint, { headers: { "x-jpgstore-csrf-protection": 1 }});

    return {
        price: res.data.floor / 1_000_000,
        timestamp: new Date(),
        symbol: "SPACEBUD"
    }
}

export async function fetchClayFloor(): Promise<FetchLatestPriceResponse> {

    const endpoint = baseUrl + `/collection/40fa2aa67258b4ce7b5782f74831d46a84c59a0ff0c28262fab21728/floor`

    const res = await axiod.get<JpgFloorResponse>(endpoint, { headers: { "x-jpgstore-csrf-protection": 1 }});

    return {
        price: res.data.floor / 1_000_000,
        timestamp: new Date(),
        symbol: "CLAYNATION"
    }
}