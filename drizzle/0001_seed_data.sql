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