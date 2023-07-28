CREATE TABLE IF NOT EXISTS "accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" varchar(256) NOT NULL,
	"type" varchar(256) NOT NULL,
	"provider" varchar(256) NOT NULL,
	"providerAccountId" varchar(256) NOT NULL,
	"access_token" text,
	"expires_in" integer,
	"id_token" text,
	"refresh_token" text,
	"refresh_token_expires_in" integer,
	"scope" varchar(256),
	"token_type" varchar(256),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "accounts__provider__providerAccountId__idx" ON "accounts" ("provider","providerAccountId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "accounts__userId__idx" ON "accounts" ("userId");