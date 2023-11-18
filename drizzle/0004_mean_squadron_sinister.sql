ALTER TABLE "realworld_approuter_trpc_articles_to_tags" DROP CONSTRAINT "realworld_approuter_trpc_articles_to_tags_article_id_realworld_approuter_trpc_article_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "realworld_approuter_trpc_articles_to_tags" ADD CONSTRAINT "realworld_approuter_trpc_articles_to_tags_article_id_realworld_approuter_trpc_article_id_fk" FOREIGN KEY ("article_id") REFERENCES "realworld_approuter_trpc_article"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
