CREATE TABLE IF NOT EXISTS "realworld_approuter_trpc_like" (
	"article_id" char(24) NOT NULL,
	"user_id" varchar(15) NOT NULL,
	CONSTRAINT realworld_approuter_trpc_like_article_id_user_id_pk PRIMARY KEY("article_id","user_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "realworld_approuter_trpc_like" ADD CONSTRAINT "realworld_approuter_trpc_like_article_id_realworld_approuter_trpc_article_id_fk" FOREIGN KEY ("article_id") REFERENCES "realworld_approuter_trpc_article"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "realworld_approuter_trpc_like" ADD CONSTRAINT "realworld_approuter_trpc_like_user_id_realworld_approuter_trpc_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "realworld_approuter_trpc_auth_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
