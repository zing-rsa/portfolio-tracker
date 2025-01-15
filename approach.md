portfolio tracker project

## requirements:
- track entire portfolio performance over time
- requires generic tracking of: 
    - various crypto currencies/FTs
    - various NFTs
    - many wallets, many exchanges
- must cater for:
    - buy/sells(trades)
    - transfers
    - asset de/a/ppreciation(price action)
        - price action tracked via pricing apis or manual entry

## data schema

#### transactions
- timestamp
- fees
- split between trades and transfers
    - trade, any transaction where one asset is exchanged for another(eg ada/usdt, nft/ada, etc)
        - buyqty
        - buysymbol(ada/btc/etc)
        - sellqty
        - sellsymbol
    - transfer, any transaction where an asset is sent from one place to another(could be wallets, exchanges, etc)
        - sender
        - receiver
        - qty
        - symbol

#### prices
- symbol(ada/btc/etc)
- price
- price quoted currency(usd/eur/ada/etc)
- timestamp

## data persistence:
We want to make sure that once the data is captured to the DB, it is persisted somewhere else as well and easily recoverable should something happen to the DB.

high level:
- allow db exports to csv
- allow db imports from csv
- periodically backup the db data via automated csv export to google drive

1. export to csv will run daily and contain all transactions(transfers, trades, etc)
- it will be a point-in-time view of the state in the db
2. import from csv can be used to refresh the db from the csv backups.
- this can also be used at the beginning to seed the DB with all my historic data

## issue resolutions: 
- invalid PEM key for google drive config
    - Deno deploy seems to auto escape any env vars, so whatever you put in the box is not actually what they expose to the app(ffs)
    - had to use `private_key: Deno.env.get("GOOGLE_PRIV_KEY")!.replace(/\\n/g, '\n'),` to solve this
- migrations failing in github actions:
    - supabase give you ipv6 and ipv4 connection strings, and only ipv4 works on github actions
    - had to update my github action secrets to use the ipv4 connection details
- `SCRAM: server signature missing`
    - password on github actions does not need to be escaped

