CREATE TABLE IF NOT EXISTS "realworld_approuter_trpc_article" (
	"id" char(24) PRIMARY KEY NOT NULL,
	"title" varchar(128) NOT NULL,
	"description" varchar(256) NOT NULL,
	"body" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "realworld_approuter_trpc_articles_to_tags" (
	"article_id" char(24) NOT NULL,
	"tag_id" char(24) NOT NULL,
	CONSTRAINT realworld_approuter_trpc_articles_to_tags_article_id_tag_id PRIMARY KEY("article_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "realworld_approuter_trpc_tag" (
	"id" char(24) PRIMARY KEY NOT NULL,
	"text" varchar(32) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "realworld_approuter_trpc_articles_to_tags" ADD CONSTRAINT "realworld_approuter_trpc_articles_to_tags_article_id_realworld_approuter_trpc_article_id_fk" FOREIGN KEY ("article_id") REFERENCES "realworld_approuter_trpc_article"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "realworld_approuter_trpc_articles_to_tags" ADD CONSTRAINT "realworld_approuter_trpc_articles_to_tags_tag_id_realworld_approuter_trpc_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "realworld_approuter_trpc_tag"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
