ALTER TABLE "connections" DROP CONSTRAINT "connections_connectionId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "connections" ADD COLUMN "connection_id" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "connections" ADD CONSTRAINT "connections_connection_id_users_id_fk" FOREIGN KEY ("connection_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "connections" DROP COLUMN IF EXISTS "connectionId";