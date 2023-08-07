ALTER TABLE "store" DROP CONSTRAINT "store_user_id_users_id_fk";
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "sotore__name__idx" ON "store" ("name");--> statement-breakpoint
ALTER TABLE "store" ADD CONSTRAINT "store_name_unique" UNIQUE("name");