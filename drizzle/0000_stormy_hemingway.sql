-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "migration" (
	"id" integer PRIMARY KEY NOT NULL,
	"path" text,
	"applied_path" text,
	"applied_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cars" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "cars_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assets" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "assets_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar NOT NULL,
	"symbol" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "transactions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"type" varchar NOT NULL,
	"ident" integer NOT NULL,
	"timestamp" timestamp NOT NULL,
	"fees" numeric DEFAULT '0',
	"feesSymbol" varchar
);
--> statement-breakpoint
CREATE TABLE "trades" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "trades_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"buyQty" numeric NOT NULL,
	"buySymbol" varchar NOT NULL,
	"sellQty" numeric NOT NULL,
	"sellSymbol" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transfers" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "transfers_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"sender" varchar,
	"receiver" varchar,
	"qty" numeric NOT NULL,
	"symbol" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prices" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "prices_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"symbol" varchar NOT NULL,
	"priceUsd" numeric NOT NULL,
	"timestamp" timestamp NOT NULL
);

*/