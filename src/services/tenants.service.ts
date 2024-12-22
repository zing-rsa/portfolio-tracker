import { crypto } from "jsr:@std/crypto/crypto";
import * as base64 from "jsr:@std/encoding/base64";

import { OnboardRequestDTO, Tenant } from "../db/models.ts";
import { OnboardValidator } from "../api/v1/schema.ts";
import { TenantsDb } from "../db/mod.ts"
import { NotFoundException } from "../exceptions.ts";

export async function get(id?: string, api_key?: string) {
    const results = await await list(id, api_key);
    return results.length == 0 ? null : results[0];
}

export async function getForAuth(api_key: string) {
    return await TenantsDb.getForAuth(api_key);
}

export async function list(id?: string, api_key?: string) {
    return await await TenantsDb.list(id, api_key);
}

export async function create(dto: OnboardRequestDTO) {
    await OnboardValidator.validateAsync(dto, {abortEarly: false});

    const tenant: Tenant = {
        email: dto.email,
        name: dto.name,
        api_key: generateApiKey(64)
    }

    return await TenantsDb.create(tenant);
}

export async function revoke(id: string) {
    const res = await await get(id);
    if (!res) throw new NotFoundException("Resource was not found");

    await TenantsDb.revoke(id);
}

function generateApiKey(length: number): string {

    const numBytes = Math.ceil((length * 3) / 4) + 10;
    
    const randomBytes = new Uint8Array(numBytes);

    crypto.getRandomValues(randomBytes);

    const base64String = base64.encodeBase64(randomBytes).replaceAll(/[+/]/g, '')

    return base64String.slice(0, length);
}

