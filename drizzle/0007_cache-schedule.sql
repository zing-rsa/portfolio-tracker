-- Custom SQL migration file, put your code below! --
insert into scheduling.schedules ("function_name", "run_datetime", "run_interval_minutes", "last_run_datetime") values ('cacheAddressBalances',  null, 1, date_trunc('month', now() at time zone 'utc'));
