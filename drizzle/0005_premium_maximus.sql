CREATE TABLE IF NOT EXISTS "realworld_approuter_trpc_follow" (
	"user_id" varchar(15) NOT NULL,
	"author_id" varchar(15) NOT NULL,
	CONSTRAINT realworld_approuter_trpc_follow_author_id_user_id_pk PRIMARY KEY("author_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "realworld_approuter_trpc_articles_to_tags" DROP CONSTRAINT "realworld_approuter_trpc_articles_to_tags_article_id_tag_id";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "realworld_approuter_trpc_follow" ADD CONSTRAINT "realworld_approuter_trpc_follow_user_id_realworld_approuter_trpc_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "realworld_approuter_trpc_auth_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "realworld_approuter_trpc_follow" ADD CONSTRAINT "realworld_approuter_trpc_follow_author_id_realworld_approuter_trpc_auth_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "realworld_approuter_trpc_auth_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "realworld_approuter_trpc_articles_to_tags" ADD CONSTRAINT "realworld_approuter_trpc_articles_to_tags_article_id_tag_id_pk" PRIMARY KEY("article_id","tag_id");