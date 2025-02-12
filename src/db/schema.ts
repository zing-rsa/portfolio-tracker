import { 
    addressBalanceCache, 
    cars,
    assets,
    transactions,
    trades,
    transfers,
    prices,
    addresses 
} from "../../drizzle/schema.ts";

export * from "../../drizzle/schema.ts"

export type Car = typeof cars.$inferSelect;
export type Asset = typeof assets.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type Trade = typeof trades.$inferSelect;
export type Transfer = typeof transfers.$inferSelect;
export type Price = typeof prices.$inferSelect;
export type Address = typeof addresses.$inferSelect;
export type AddressBalance = typeof addressBalanceCache.$inferSelect

export type NewCar = typeof cars.$inferInsert;
export type NewAsset = typeof assets.$inferInsert;
export type NewTransaction = typeof transactions.$inferInsert;
export type NewTrade = typeof trades.$inferInsert;
export type NewTransfer = typeof transfers.$inferInsert;
export type NewPrice = typeof prices.$inferInsert;
export type NewAddress = typeof addresses.$inferInsert;
export type NewAddressBalance = typeof addressBalanceCache.$inferInsert;