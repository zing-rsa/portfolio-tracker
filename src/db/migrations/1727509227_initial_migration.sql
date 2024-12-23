
-- iam
create schema iam;

create table iam.tenants (
    "id" bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "email" varchar NOT NULL, 
    "name" varchar NOT NULL,
    "api_key" varchar UNIQUE
);

create table iam.claims (
    "id" uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    "value" varchar NOT NULL
);

create table iam.roles (
    "id" uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    "name" varchar NOT NULL
);

create table iam.tenant_claims (
    "tenant_id" bigint NOT NULL,
    "claim_id" uuid NOT NULL
);

create table iam.tenant_roles (
    "tenant_id" bigint NOT NULL,
    "role_id" uuid NOT NULL
);

create table iam.role_claims (
    "role_id" uuid NOT NULL,
    "claim_id" uuid NOT NULL
);

-- scheduling

create schema scheduling;

create table scheduling.schedules (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "function_name" varchar NOT NULL,
    "run_datetime" timestamp,
    "run_interval_minutes" int,
    "last_run_datetime" timestamp
);

-- public

create table cars (
    "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" varchar NOT NULL
);

create table assets (
    "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" varchar NOT NULL,
    "symbol" varchar NOT NULL
);

create table transactions (
    "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "type" varchar NOT NULL, -- transfer | trade
    "buyQty" decimal,
    "buySymbol" varchar,
    "sellQty" decimal,
    "sellSymbol" varchar,
    "sender" varchar,
    "receiver" varchar,
    "timestamp" timestamp NOT NULL
);

create table prices (
    "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "symbol" varchar NOT NULL,
    "priceUsd" decimal NOT NULL,
    "timestamp" timestamp NOT NULL
);