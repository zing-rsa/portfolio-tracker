CREATE SCHEMA "iam";
--> statement-breakpoint
CREATE SCHEMA "scheduling";
--> statement-breakpoint
CREATE TABLE "assets" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "assets_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar NOT NULL,
	"symbol" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cars" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "cars_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "iam"."claims" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"value" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "migration" (
	"id" integer PRIMARY KEY NOT NULL,
	"path" text,
	"applied_path" text,
	"applied_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prices" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "prices_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"symbol" varchar NOT NULL,
	"price" numeric NOT NULL,
	"price_quoted_symbol" varchar DEFAULT 'USD' NOT NULL,
	"timestamp" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "iam"."role_claims" (
	"role_id" uuid NOT NULL,
	"claim_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "iam"."roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scheduling"."schedules" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"function_name" varchar NOT NULL,
	"run_datetime" timestamp,
	"run_interval_minutes" integer,
	"last_run_datetime" timestamp
);
--> statement-breakpoint
CREATE TABLE "iam"."tenant_claims" (
	"tenant_id" integer NOT NULL,
	"claim_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "iam"."tenant_roles" (
	"tenant_id" integer NOT NULL,
	"role_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "iam"."tenants" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "iam"."iam.tenants_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"email" varchar NOT NULL,
	"name" varchar NOT NULL,
	"api_key" varchar,
	CONSTRAINT "tenants_api_key_key" UNIQUE("api_key")
);
--> statement-breakpoint
CREATE TABLE "trades" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "trades_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"buy_qty" numeric NOT NULL,
	"buy_symbol" varchar NOT NULL,
	"sell_qty" numeric NOT NULL,
	"sell_symbol" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "transactions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"type" varchar NOT NULL,
	"ident" integer NOT NULL,
	"timestamp" timestamp NOT NULL,
	"fees" numeric DEFAULT '0',
	"fees_symbol" varchar
);
--> statement-breakpoint
CREATE TABLE "transfers" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "transfers_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"sender" varchar,
	"receiver" varchar,
	"qty" numeric NOT NULL,
	"symbol" varchar NOT NULL
);
