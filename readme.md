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