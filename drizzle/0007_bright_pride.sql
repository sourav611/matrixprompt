CREATE TABLE "image_tags" (
	"image_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "image_tags_image_id_tag_id_pk" PRIMARY KEY("image_id","tag_id")
);
--> statement-breakpoint
ALTER TABLE "image_tags" ADD CONSTRAINT "image_tags_image_id_gallery_images_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."gallery_images"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "image_tags" ADD CONSTRAINT "image_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "image_tags_image_id_idx" ON "image_tags" USING btree ("image_id");--> statement-breakpoint
CREATE INDEX "image_tags_tag_id_idx" ON "image_tags" USING btree ("tag_id");