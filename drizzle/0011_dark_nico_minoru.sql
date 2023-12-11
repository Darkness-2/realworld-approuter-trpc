CREATE TABLE IF NOT EXISTS "realworld_approuter_trpc_comment" (
	"id" char(24) PRIMARY KEY NOT NULL,
	"body" text NOT NULL,
	"article_id" char(24) NOT NULL,
	"author_id" varchar(15) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "realworld_approuter_trpc_comment" ADD CONSTRAINT "realworld_approuter_trpc_comment_article_id_realworld_approuter_trpc_article_id_fk" FOREIGN KEY ("article_id") REFERENCES "realworld_approuter_trpc_article"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "realworld_approuter_trpc_comment" ADD CONSTRAINT "realworld_approuter_trpc_comment_author_id_realworld_approuter_trpc_auth_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "realworld_approuter_trpc_auth_user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
