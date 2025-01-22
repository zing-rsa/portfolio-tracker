import { pgTable, integer, text, timestamp, pgSchema, unique, varchar, uuid, numeric, boolean } from "drizzle-orm/pg-core"

export const iam = pgSchema("iam");
export const scheduling = pgSchema("scheduling");


export const migration = pgTable("migration", {
	id: integer().primaryKey().notNull(),
	path: text(),
	appliedPath: text(),
	appliedAt: timestamp({ withTimezone: true, mode: 'string' }),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const tenantsInIam = iam.table("tenants", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "iam.tenants_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	email: varchar().notNull(),
	name: varchar().notNull(),
	apiKey: varchar(),
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
	tenantId: integer().notNull(),
	claimId: uuid().notNull(),
});

export const tenantRolesInIam = iam.table("tenant_roles", {
	tenantId: integer().notNull(),
	roleId: uuid().notNull(),
});

export const roleClaimsInIam = iam.table("role_claims", {
	roleId: uuid().notNull(),
	claimId: uuid().notNull(),
});

export const schedulesInScheduling = scheduling.table("schedules", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	functionName: varchar().notNull(),
	runDatetime: timestamp({ mode: 'string' }),
	runIntervalMinutes: integer(),
	lastRunDatetime: timestamp({ mode: 'string' }),
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
	txId: varchar(),
	note: varchar()
});

export const trades = pgTable("trades", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "trades_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	buyQty: numeric().notNull(),
	buySymbol: varchar().notNull(),
	sellQty: numeric().notNull(),
	sellSymbol: varchar().notNull(),
	address: varchar().notNull(),
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
	price: numeric().notNull(),
	priceQuotedSymbol: varchar().notNull().default("USD"),
	timestamp: timestamp({ mode: 'string' }).notNull(),
});

export const addresses = pgTable("addresses", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "addresses_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	address: varchar().notNull(),
	counted: boolean().notNull().default(true)
});
