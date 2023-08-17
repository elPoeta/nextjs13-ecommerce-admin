ALTER TABLE "store" DROP CONSTRAINT "store_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "store" RENAME COLUMN "user_id" TO "userId";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "store" ADD CONSTRAINT "store_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
