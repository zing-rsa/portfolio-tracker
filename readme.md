portfolio tracker project

## approach:
- track entire portfolio performance over time
- requires generic tracking of: 
    - various crypto currencies/FTs
    - various NFTs
    - many wallets, many exchanges
- must cater for:
    - buy/sells
    - transfers
    - de/a/ppreciations/price action
        - price action tracked via pricing apis or manual entry

## data schema

assets
- name
- symbol?
- quantity
- nft/ft?

transactions
- order amount
- order currency
- action(buy/sell/transfer)
- date

prices
- asset symbol
- price
- price currency

## data persistance approach:
We want to make sure that once the data is captured to the DB, it is persisted somewhere else as well and easily recoverable should something happen to the DB.

high level:
- export all data to csv
- csv to sql

1. export to csv will run daily and contain all transactions(transfers, trades, etc)
- it will be a point-in-time view of the state in the db
2. import from csv can be used to generate the sql required to re-instate the DB
- this can also be used at the beginning to seed the DB with all my historic data

## DB:

create a local postgres db:
```
./run_local_db_docker.sh
```

create a new migration based off of `./drizzle/schema.ts`:
```
deno --env -A --node-modules-dir npm:drizzle-kit push
```

migrate db:
```
deno --env -A --node-modules-dir npm:drizzle-kit migrate
```