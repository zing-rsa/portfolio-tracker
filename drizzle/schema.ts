import { pgTable, integer, text, timestamp, varchar, numeric } from "drizzle-orm/pg-core"


export const migration = pgTable("migration", {
	id: integer().primaryKey().notNull(),
	path: text(),
	appliedPath: text("applied_path"),
	appliedAt: timestamp("applied_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
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
