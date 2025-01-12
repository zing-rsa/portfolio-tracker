import { pgTable, integer, text, timestamp, pgSchema, unique, bigint, varchar, uuid, numeric } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const iam = pgSchema("iam");
export const scheduling = pgSchema("scheduling");


export const migration = pgTable("migration", {
	id: integer().primaryKey().notNull(),
	path: text(),
	appliedPath: text("applied_path"),
	appliedAt: timestamp("applied_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const tenantsInIam = iam.table("tenants", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity({ name: "iam.tenants_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	email: varchar().notNull(),
	name: varchar().notNull(),
	apiKey: varchar("api_key"),
}, (table) => [
	unique("tenants_api_key_key").on(table.apiKey),
]);

export const claimsInIam = iam.table("claims", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	value: varchar().notNull(),
});

export const rolesInIam = iam.table("roles", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar().notNull(),
});

export const tenantClaimsInIam = iam.table("tenant_claims", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	tenantId: bigint("tenant_id", { mode: "number" }).notNull(),
	claimId: uuid("claim_id").notNull(),
});

export const tenantRolesInIam = iam.table("tenant_roles", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	tenantId: bigint("tenant_id", { mode: "number" }).notNull(),
	roleId: uuid("role_id").notNull(),
});

export const roleClaimsInIam = iam.table("role_claims", {
	roleId: uuid("role_id").notNull(),
	claimId: uuid("claim_id").notNull(),
});

export const schedulesInScheduling = scheduling.table("schedules", {
	id: uuid().defaultRandom().notNull(),
	functionName: varchar("function_name").notNull(),
	runDatetime: timestamp("run_datetime", { mode: 'string' }),
	runIntervalMinutes: integer("run_interval_minutes"),
	lastRunDatetime: timestamp("last_run_datetime", { mode: 'string' }),
});

export const cars = pgTable("cars", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "cars_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	name: varchar().notNull(),
});

export const assets = pgTable("assets", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "assets_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	name: varchar().notNull(),
	symbol: varchar().notNull(),
});

export const transactions = pgTable("transactions", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "transactions_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	type: varchar().notNull(),
	ident: integer().notNull(),
	timestamp: timestamp({ mode: 'string' }).notNull(),
	fees: numeric().default('0'),
	feesSymbol: varchar(),
});

export const trades = pgTable("trades", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "trades_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	buyQty: numeric().notNull(),
	buySymbol: varchar().notNull(),
	sellQty: numeric().notNull(),
	sellSymbol: varchar().notNull(),
});

export const transfers = pgTable("transfers", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "transfers_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	sender: varchar(),
	receiver: varchar(),
	qty: numeric().notNull(),
	symbol: varchar().notNull(),
});

export const prices = pgTable("prices", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "prices_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	symbol: varchar().notNull(),
	priceUsd: numeric().notNull(),
	timestamp: timestamp({ mode: 'string' }).notNull(),
});
