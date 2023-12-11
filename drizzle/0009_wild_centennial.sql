ALTER TABLE "realworld_approuter_trpc_articles_to_tags" RENAME TO "realworld_approuter_trpc_article_to_tag";--> statement-breakpoint
ALTER TABLE "realworld_approuter_trpc_article_to_tag" DROP CONSTRAINT "realworld_approuter_trpc_articles_to_tags_article_id_realworld_approuter_trpc_article_id_fk";
--> statement-breakpoint
ALTER TABLE "realworld_approuter_trpc_article_to_tag" DROP CONSTRAINT "realworld_approuter_trpc_articles_to_tags_tag_id_realworld_approuter_trpc_tag_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "realworld_approuter_trpc_article_to_tag" ADD CONSTRAINT "realworld_approuter_trpc_article_to_tag_article_id_realworld_approuter_trpc_article_id_fk" FOREIGN KEY ("article_id") REFERENCES "realworld_approuter_trpc_article"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "realworld_approuter_trpc_article_to_tag" ADD CONSTRAINT "realworld_approuter_trpc_article_to_tag_tag_id_realworld_approuter_trpc_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "realworld_approuter_trpc_tag"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
