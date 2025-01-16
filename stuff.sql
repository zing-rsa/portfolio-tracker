

-- get price history of holdings for a dates range

with dates as (
	select generate_series('2025-01-14'::timestamp at time zone 'UTC', '2025-01-16'::timestamp at time zone 'UTC', '1 day'::interval) at time zone 'UTC'
)
select *
from dates 







-- get a date range
select generate_series('2025-01-14'::timestamp at time zone 'UTC', '2025-01-16'::timestamp at time zone 'UTC', '1 day'::interval) at time zone 'UTC'


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
order by p.symbol, p."timestamp" desc)
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
	

