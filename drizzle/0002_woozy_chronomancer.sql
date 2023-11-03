ALTER TABLE "realworld_approuter_trpc_article" ADD COLUMN "author_id" varchar(15) NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "realworld_approuter_trpc_article" ADD CONSTRAINT "realworld_approuter_trpc_article_author_id_realworld_approuter_trpc_auth_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "realworld_approuter_trpc_auth_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
