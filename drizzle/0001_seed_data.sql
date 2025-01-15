-- Custom SQL migration file, put your code below! --

-- tenants
insert into iam.tenants ("name", "api_key", "email") VALUES ('rob', '12345', 'test@example.com');

-- roles/claims
insert into iam.tenant_roles (tenant_id, "role_id") values (1, 'b6bd858c-3852-4185-b2b7-0b438c9b3190');
insert into iam.roles ("id", "name") values ('b6bd858c-3852-4185-b2b7-0b438c9b3190', 'admin');
insert into iam.claims ("id", "value") values ('e265115e-3ce5-4f29-bdef-1e6b3a505d84', '*');
insert into iam.role_claims ("role_id", "claim_id") values ('b6bd858c-3852-4185-b2b7-0b438c9b3190', 'e265115e-3ce5-4f29-bdef-1e6b3a505d84');

-- schedules
insert into scheduling.schedules ("function_name", "run_datetime", "run_interval_minutes", "last_run_datetime") values ('updateTop20Prices', null, 1, date_trunc('month', now() at time zone 'utc'));
insert into scheduling.schedules ("function_name", "run_datetime", "run_interval_minutes", "last_run_datetime") values ('saveStateToDrive',  null, 1, date_trunc('month', now() at time zone 'utc'));

-- public data
insert into cars ("name") values ('mclaren');

insert into transfers ("sender", "receiver", "qty", "symbol") values (NULL, '0xFC2463F32f75010389cd82972e570b4f269C554f', 1.29814, 'ETH');
insert into transfers ("sender", "receiver", "qty", "symbol") values (NULL, '0x5d8b5358Ad7bEc1932eC0683e49c427fCF0Ba8EE', 0.01963, 'ETH');
insert into transfers ("sender", "receiver", "qty", "symbol") values (NULL, 'addr1qysgdw6uqzk9tqv744d7pnz9m7pv0tyldyl029d6myvgedqsej9ypqxscxvt5qesv77jxyfgv8cyd70dgf2p3m4wctaqt2569t', 24.36, 'ADA');
insert into transfers ("sender", "receiver", "qty", "symbol") values (NULL, 'addr1qysgdw6uqzk9tqv744d7pnz9m7pv0tyldyl029d6myvgedqsej9ypqxscxvt5qesv77jxyfgv8cyd70dgf2p3m4wctaqt2569t', 1, 'SPACEBUD3733');
insert into transfers ("sender", "receiver", "qty", "symbol") values (NULL, 'addr1qysgdw6uqzk9tqv744d7pnz9m7pv0tyldyl029d6myvgedqsej9ypqxscxvt5qesv77jxyfgv8cyd70dgf2p3m4wctaqt2569t', 1, 'SPACEBUD4142');

insert into transactions ("type", "ident", "timestamp") select 'transfer', id, '2024-12-23 00:00:00' from transfers;

insert into prices ("symbol", "price", "price_quoted_symbol", "timestamp") values ('ADA', 0.88, 'USD', '2024-12-23 00:00:00');
insert into prices ("symbol", "price", "price_quoted_symbol", "timestamp") values ('ETH', 3300, 'USD', '2024-12-23 00:00:00');
insert into prices ("symbol", "price", "price_quoted_symbol", "timestamp") values ('SPACEBUD3733', 897.04, 'ADA', '2024-12-23 00:00:00');
insert into prices ("symbol", "price", "price_quoted_symbol", "timestamp") values ('SPACEBUD4142', 897.04, 'ADA', '2024-12-23 00:00:00');