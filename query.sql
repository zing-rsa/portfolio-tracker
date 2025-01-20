with address_day_aggregates as (
    select address, "date", sum(qty) as "qty", symbol
    from (
        -- all receives 
        select receiver as "address", "timestamp"::date as "date", qty, symbol
        from transfers t
        join transactions tx on tx.ident = t.id and tx."type" = 'transfer'
        where receiver is not null
        union
        -- negative all sends
        select sender as "address","timestamp"::date as "date",-qty, symbol
        from transfers t
        join transactions tx on tx.ident = t.id and tx."type" = 'transfer'
        where sender is not null
        union
        -- all buys
        select address, "timestamp"::date as "date", buy_qty as "qty", buy_symbol as "symbol"
        from trades t 
        join transactions tx on tx.ident = t.id and tx."type" = 'trade'
        union 
        -- negative all sells
        select address, "timestamp"::date as "date", -sell_qty as "qty", sell_symbol as "symbol"
        from trades t 
        join transactions tx on tx.ident = t.id and tx."type" = 'trade'
    ) as "all" 
    group by address, "date", symbol 
    having sum(qty) <> 0 -- don't need 0's
), 
cumulative_holdings as (
    select
        address,
        date,
        symbol,
        SUM(qty) OVER (PARTITION BY symbol, address ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS qty_held
    FROM address_day_aggregates
    order by date, address, symbol
),
all_combos as (
    select dates."date", addresses_distinct.address, symbols_distinct.symbol
    from (
        select (generate_series((select min(timestamp) from transactions t ) at time zone 'UTC', now() at time zone 'UTC', '1 day'::interval) at time zone 'UTC')::date as "date"
    ) dates
    cross join (
        select distinct address from (
            select address as "address" from trades where address is not null
            union 
            select sender as "address" from transfers where sender is not null
            union
            select receiver as "address" from transfers where receiver is not null
        ) addresses_all
    ) addresses_distinct
    cross join (
        select distinct symbol 
        from (
            select buy_symbol as "symbol" from trades t 
            union
            select sell_symbol as "symbol" from trades te
            union
            select symbol from transfers trs
        ) symbols_all
    ) symbols_distinct
)
select ac.*, 
    ch.qty_held as "qty",
    case 
        when (p_quoted.price_quoted_symbol is not null) then p.price * p_quoted.price
        when (p.price_quoted_symbol <> 'USD' and not exists (select * from prices where prices.symbol = p.price_quoted_symbol)) then 0
        else coalesce(p.price, 0)
    end as "price",
    case 
        when (p_quoted.price_quoted_symbol is not null) then p.price * p_quoted.price * ch.qty_held
        when (p.price_quoted_symbol <> 'USD' and not exists (select * from prices where prices.symbol = p.price_quoted_symbol)) then 0
        else coalesce(p.price, 0) * ch.qty_held
    end as "total"
from all_combos ac
join (
    select *
    from cumulative_holdings
) ch on ac.address = ch.address
    and ac.symbol = ch.symbol 
    and ch.date = (select max(date) from cumulative_holdings ch2 where ac.address = ch2.address and ac.symbol = ch2.symbol and ch2.date <= ac.date)
left join prices p on p.symbol = ac.symbol and p."timestamp" = (select max(timestamp) from prices p2 where p2.symbol = ac.symbol and p2.timestamp <= ac.date)
left join prices p_quoted on p_quoted.symbol = p.price_quoted_symbol and p_quoted."timestamp" = (select max(timestamp) from prices p3 where p3.symbol = p_quoted.symbol and p3.timestamp <= ac.date)
order by date, address, symbol;