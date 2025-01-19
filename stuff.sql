

-- get price history of holdings for a dates range

with dates as (
	select generate_series('2025-01-14'::timestamp at time zone 'UTC', '2025-01-16'::timestamp at time zone 'UTC', '1 day'::interval) at time zone 'UTC'
)
select *
from dates 







-- get a date range
select (generate_series('2025-01-14'::timestamp at time zone 'UTC', '2025-01-16'::timestamp at time zone 'UTC', '1 day'::interval) at time zone 'UTC')::date as "dates"


-- get current holdings for a date
select * 
from transactions t 
left join trades trd on trd.id = t.ident
left join transfers trns on trns.id = t.ident
where t."timestamp" <= '2025-01-16'


-- transfers only positive
select t.receiver, t.symbol, sum(t.qty) as qty
from transfers t
join transactions tx on tx.ident = t.id 
where tx."timestamp" <= '2025-01-16'
group by t.receiver, symbol

-- transfers only negative
select t.sender, t.symbol, -sum(t.qty) as qty
from transfers t
join transactions tx on tx.ident = t.id 
where tx."timestamp" <= '2025-01-16'
group by t.sender, symbol

-- trades only positive
select t.address, t.buy_symbol , sum(t.buy_qty) as qty
from trades t
join transactions tx on tx.ident = t.id 
where tx."timestamp" <= '2025-01-16'
group by t.address, t.buy_symbol

-- trades only positive
select t.address, t.sell_symbol, -sum(t.sell_qty) as qty
from trades t
join transactions tx on tx.ident = t.id 
where tx."timestamp" <= '2025-01-16'
group by t.address, t.sell_symbol


with totals as (
	select t.receiver as address, t.symbol, sum(t.qty) as qty
	from transfers t
	join transactions tx on tx.ident = t.id 
	where tx."timestamp" <= '2025-01-17'
	group by t.receiver, symbol
	union 
	select t.sender as address, t.symbol, -sum(t.qty) as qty
	from transfers t
	join transactions tx on tx.ident = t.id 
	where tx."timestamp" <= '2025-01-17'
	group by t.sender, symbol
	union
	select t.address as address, t.buy_symbol , sum(t.buy_qty) as qty
	from trades t
	join transactions tx on tx.ident = t.id 
	where tx."timestamp" <= '2025-01-17'
	group by t.address, t.buy_symbol
	union
	select t.address as address, t.sell_symbol, -sum(t.sell_qty) as qty
	from trades t
	join transactions tx on tx.ident = t.id 
	where tx."timestamp" <= '2025-01-17'
	group by t.address, t.sell_symbol
),
latest_prices as (
	select distinct on (p.symbol) * 
	from prices p 
	where p."timestamp" <= '2025-01-17'
	order by p.symbol, p."timestamp" desc
)
select 
	t.address, 
	t.symbol, 
	sum(qty) as qty,
	case 
		when (lp2.price_quoted_symbol is not null) then lp.price * lp2.price
		when (lp.price_quoted_symbol <> 'USD' and not exists (select * from prices where prices.symbol = lp.price_quoted_symbol)) then 0
		else coalesce(lp.price, 0)
	end as price_usd
from totals t
left join latest_prices lp on lp.symbol = t.symbol
left join latest_prices lp2 on lp2.symbol = lp.price_quoted_symbol
group by 
	t.address, 
	t.symbol, 
	lp.price, 
	lp.price_quoted_symbol,
	lp2.price,
	lp2.price_quoted_symbol
	
with dates as (
	select (generate_series('2025-01-14'::timestamp at time zone 'UTC', '2025-01-16'::timestamp at time zone 'UTC', '1 day'::interval) at time zone 'UTC')::date
) select * 
from dates
join 



-- chatgpts' absolute bomb of a query
WITH holdings AS (
    -- Calculate the net holdings of each symbol on each date
    SELECT
        t.date,
        t.buy_symbol AS symbol,
        SUM(t.buy_qty) AS total_buy_qty,
        SUM(t.sell_qty) AS total_sell_qty
    FROM trades t
    GROUP BY t.date, t.buy_symbol

    UNION ALL

    SELECT
        t.date,
        t.sell_symbol AS symbol,
        -SUM(t.sell_qty) AS total_buy_qty,
        -SUM(t.buy_qty) AS total_sell_qty
    FROM trades t
    GROUP BY t.date, t.sell_symbol
),
-- Aggregate the holdings per symbol over time
cumulative_holdings AS (
    SELECT
        date,
        symbol,
        SUM(total_buy_qty) OVER (PARTITION BY symbol ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS qty_held
    FROM holdings
),
-- Get the price for each symbol on the given date
prices_on_date AS (
    SELECT
        p.date,
        p.symbol,
        p.price
    FROM prices p
)
-- Final output: join holdings with prices to calculate the value
SELECT
    ch.date,
    ch.symbol,
    ch.qty_held,
    ch.qty_held * p.price AS total_value_in_usd
FROM cumulative_holdings ch
JOIN prices_on_date p ON ch.date = p.date AND ch.symbol = p.symbol
ORDER BY ch.date, ch.symbol;


-- rebuilding with new understanding:

-- totals of symbols traded per date per address
select 
	address,
	"date",
	sum(qty),
	symbol
from (
	-- all buys
	select 
		address,
		"timestamp"::date as "date",
		buy_qty as "qty",
		buy_symbol as "symbol"
	from trades t 
	join transactions tx on tx.ident = t.id and tx."type" = 'trade'
	union 
	-- all sells
	select 
		address,
		"timestamp"::date as "date",
		-sell_qty as "qty", -- negative
		sell_symbol as "symbol"
	from trades t 
	join transactions tx on tx.ident = t.id and tx."type" = 'trade'
) as "all" 
group by address, "date", symbol -- group by to aggregate trades of the same address of the same symbol on the same day
having sum(qty) <> 0 -- don't need 0's


-- gets cumulative holdings per date per address per symbol
with address_day_aggregates as (
	select 
		address,
		"date",
		sum(qty) as "qty",
		symbol
	from (
		-- all buys
		select 
			address,
			"timestamp"::date as "date",
			buy_qty as "qty",
			buy_symbol as "symbol"
		from trades t 
		join transactions tx on tx.ident = t.id and tx."type" = 'trade'
		union 
		-- all sells
		select 
			address,
			"timestamp"::date as "date",
			-sell_qty as "qty", -- negative
			sell_symbol as "symbol"
		from trades t 
		join transactions tx on tx.ident = t.id and tx."type" = 'trade'
	) as "all" 
	group by address, "date", symbol -- group by to aggregate trades of the same address of the same symbol on the same day
	having sum(qty) <> 0 -- don't need 0's
)
select
	address,
    date,
    symbol,
    SUM(qty) OVER (PARTITION BY symbol, address ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS qty_held
FROM address_day_aggregates
order by date, address, symbol


-- wip: 

with address_day_aggregates as (
	select 
		address,
		"date",
		sum(qty) as "qty",
		symbol
	from (
		-- all buys
		select 
			address,
			"timestamp"::date as "date",
			buy_qty as "qty",
			buy_symbol as "symbol"
		from trades t 
		join transactions tx on tx.ident = t.id and tx."type" = 'trade'
		union 
		-- all sells
		select 
			address,
			"timestamp"::date as "date",
			-sell_qty as "qty", -- negative
			sell_symbol as "symbol"
		from trades t 
		join transactions tx on tx.ident = t.id and tx."type" = 'trade'
	) as "all" 
	group by address, "date", symbol -- group by to aggregate trades of the same address of the same symbol on the same day
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
	select dates."date", addresses.address, symbols_distinct.symbol
	from (
		select (generate_series('2025-01-14'::timestamp at time zone 'UTC', '2025-01-16'::timestamp at time zone 'UTC', '1 day'::interval) at time zone 'UTC')::date as "date"
	) dates
	cross join (select distinct address from trades) addresses
	cross join (
		select distinct symbol 
		from (
			select buy_symbol as "symbol" from trades t 
			union
			select sell_symbol as "symbol" from trades t
		) symbols_all
	) symbols_distinct
)
select *
from all_combos
join (
	select distinct on (date, address, symbol), qty
	from cumulative_holdings
	order by date, address, symbol
)

-- seems to be working
with address_day_aggregates as (
	select 
		address,
		"date",
		sum(qty) as "qty",
		symbol
	from (
		-- all buys
		select 
			address,
			"timestamp"::date as "date",
			buy_qty as "qty",
			buy_symbol as "symbol"
		from trades t 
		join transactions tx on tx.ident = t.id and tx."type" = 'trade'
		union 
		-- all sells
		select 
			address,
			"timestamp"::date as "date",
			-sell_qty as "qty", -- negative
			sell_symbol as "symbol"
		from trades t 
		join transactions tx on tx.ident = t.id and tx."type" = 'trade'
	) as "all" 
	group by address, "date", symbol -- group by to aggregate trades of the same address of the same symbol on the same day
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
	select dates."date", addresses.address, symbols_distinct.symbol
	from (
		select (generate_series((select min(timestamp) from transactions t ) at time zone 'UTC', (select max(timestamp) from transactions t) at time zone 'UTC', '1 day'::interval) at time zone 'UTC')::date as "date"
	) dates
	cross join (select distinct address from trades) addresses
	cross join (
		select distinct symbol 
		from (
			select buy_symbol as "symbol" from trades t 
			union
			select sell_symbol as "symbol" from trades t
		) symbols_all
	) symbols_distinct
)
select ac.*, ch.qty_held, p.price, p.price * ch.qty_held as "total"
from all_combos ac
join (
	select *
	from cumulative_holdings
) ch on ac.address = ch.address
	and ac.symbol = ch.symbol 
	and ch.date = (select max(date) from cumulative_holdings ch2 where ac.address = ch2.address and ac.symbol = ch2.symbol and ch2.date <= ac.date)
join prices p on p.symbol = ac.symbol and p."timestamp" = (select max(timestamp) from prices p2 where p2.symbol = ac.symbol and p2.timestamp <= ac.date)
order by date, address, symbol;