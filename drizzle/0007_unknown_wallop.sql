ALTER TABLE "realworld_approuter_trpc_article" DROP CONSTRAINT "realworld_approuter_trpc_article_author_id_realworld_approuter_trpc_auth_user_id_fk";
--> statement-breakpoint
ALTER TABLE "realworld_approuter_trpc_articles_to_tags" DROP CONSTRAINT "realworld_approuter_trpc_articles_to_tags_article_id_realworld_approuter_trpc_article_id_fk";
--> statement-breakpoint
ALTER TABLE "realworld_approuter_trpc_like" DROP CONSTRAINT "realworld_approuter_trpc_like_article_id_realworld_approuter_trpc_article_id_fk";
--> statement-breakpoint
ALTER TABLE "realworld_approuter_trpc_user_key" DROP CONSTRAINT "realworld_approuter_trpc_user_key_user_id_realworld_approuter_trpc_auth_user_id_fk";
--> statement-breakpoint
ALTER TABLE "realworld_approuter_trpc_user_session" DROP CONSTRAINT "realworld_approuter_trpc_user_session_user_id_realworld_approuter_trpc_auth_user_id_fk";
--> statement-breakpoint
ALTER TABLE "realworld_approuter_trpc_follow" DROP CONSTRAINT "realworld_approuter_trpc_follow_user_id_realworld_approuter_trpc_auth_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "realworld_approuter_trpc_article" ADD CONSTRAINT "realworld_approuter_trpc_article_author_id_realworld_approuter_trpc_auth_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "realworld_approuter_trpc_auth_user"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "realworld_approuter_trpc_articles_to_tags" ADD CONSTRAINT "realworld_approuter_trpc_articles_to_tags_article_id_realworld_approuter_trpc_article_id_fk" FOREIGN KEY ("article_id") REFERENCES "realworld_approuter_trpc_article"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "realworld_approuter_trpc_like" ADD CONSTRAINT "realworld_approuter_trpc_like_article_id_realworld_approuter_trpc_article_id_fk" FOREIGN KEY ("article_id") REFERENCES "realworld_approuter_trpc_article"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "realworld_approuter_trpc_user_key" ADD CONSTRAINT "realworld_approuter_trpc_user_key_user_id_realworld_approuter_trpc_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "realworld_approuter_trpc_auth_user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "realworld_approuter_trpc_user_session" ADD CONSTRAINT "realworld_approuter_trpc_user_session_user_id_realworld_approuter_trpc_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "realworld_approuter_trpc_auth_user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "realworld_approuter_trpc_follow" ADD CONSTRAINT "realworld_approuter_trpc_follow_user_id_realworld_approuter_trpc_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "realworld_approuter_trpc_auth_user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
