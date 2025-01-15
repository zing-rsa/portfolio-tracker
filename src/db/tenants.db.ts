import { Tenant } from "../models.ts";
import { pgClient } from "./db.ts"

export async function getForAuth(api_key: string): Promise<Tenant | null> {
    type AuthTenant = Tenant & {
        claims_string: string,
        roles_string: string
    }

    const query = `
        with all_tenant_claims as (
            select tr.tenant_id, rc.claim_id
            from iam.tenant_roles tr 
            left join iam.role_claims rc on tr.role_id = rc.role_id
            left join iam.tenants t on tr.tenant_id = t.id
            where t.api_key = '${api_key}'
            union 
            select tc.tenant_id, tc.claim_id 
            from iam.tenant_claims tc 
            left join iam.tenants t on tc.tenant_id = t.id
            where t.api_key = '${api_key}'
        ), all_tenant_roles as (
            select *
            from iam.tenant_roles tr2
            left join iam.roles r on r.id = tr2.role_id
        )
        select t.*, string_agg(distinct c.value, ',') FILTER (WHERE c.value is not null) as claims_string, string_agg(distinct atr."name", ',') FILTER (WHERE atr."name" is not null) as roles_string
        from iam.tenants t 
        left join all_tenant_claims atc on atc.tenant_id = t.id
        left join iam.claims c on c.id = atc.claim_id
        left join all_tenant_roles atr on atr.tenant_id = t.id
        where t.api_key = '${api_key}'
        group by t.id;
    `;

    const result = await pgClient.queryObject<AuthTenant>(query);
    if (!result.rowCount) 
        return null;

    const authTenant = result.rows[0];

    const tenant: Tenant = {
        ...authTenant,
        claims: !authTenant.claims_string ? [] : authTenant.claims_string.split(','),
        roles: !authTenant.roles_string ? [] : authTenant.roles_string.split(',')
    }

    return tenant;
}

export async function list(id?: string, api_key?: string): Promise<Array<Tenant>> {
    let where = "";
    if (id != null)
        where += (where.includes("WHERE") ? "AND " : "WHERE ") + `id = ${id} `;
    if (api_key)
        where += (where.includes("WHERE") ? "AND " : "WHERE ") + `api_key = '${api_key}' `;

    const query = `select * from iam.tenants ${where}; `;
    
    console.log("Executing query: ", query)
    const result = await pgClient.queryObject<Tenant>(query);
    
    return result.rows;
}

export async function create(tenant: Tenant) {
    const query = `
    insert into iam.tenants ("email", "name", "api_key") values
    ('${tenant.email}', '${tenant.name}', '${tenant.api_key}')
    returning *; `;

    const result = await pgClient.queryObject<Tenant>(query);

    return result.rows[0];
}

export async function revoke(id: string) {
    const query = `
    update iam.tenants
    set api_key = NULL
    where id = '${id}' ;`

    await pgClient.queryObject(query);
}