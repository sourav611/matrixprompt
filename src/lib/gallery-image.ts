import { db } from "@/db"; // your drizzle instance
import { galleryImages, postStats, tags, imageTags } from "@/db/schema";
import { GalleryImage, ImageMetadata } from "@/types/image.types";
import { and, desc, eq, notLike, sql } from "drizzle-orm";

export async function getImages() {
  const images = await db
    .select({
      id: galleryImages.id,
      imageUrl: galleryImages.imageUrl,
      prompt: galleryImages.prompt,
      aiModel: galleryImages.aiModel,
      category: galleryImages.category,
      createdAt: galleryImages.createdAt,
      tags: sql<string[]>`coalesce(array_agg(${tags.name}) filter (where ${tags.name} is not null), '{}')`,
    })
    .from(galleryImages)
    .leftJoin(imageTags, eq(galleryImages.id, imageTags.imageId))
    .leftJoin(tags, eq(imageTags.tagId, tags.id))
    .where(
      and(
        eq(galleryImages.isPublic, true),
        notLike(galleryImages.imageUrl, "pending-%")
      )
    )
    .groupBy(galleryImages.id)
    .orderBy(desc(galleryImages.createdAt));
  return images;
}

export async function getImageById(id: string): Promise<GalleryImage | null> {
  const row = await db
    .select({
      id: galleryImages.id,
      imageUrl: galleryImages.imageUrl,
      prompt: galleryImages.prompt,
      aiModel: galleryImages.aiModel,
      category: galleryImages.category,
      createdAt: galleryImages.createdAt,
      tags: sql<string[]>`coalesce(array_agg(${tags.name}) filter (where ${tags.name} is not null), '{}')`,
    })
    .from(galleryImages)
    .leftJoin(imageTags, eq(galleryImages.id, imageTags.imageId))
    .leftJoin(tags, eq(imageTags.tagId, tags.id))
    .where(eq(galleryImages.id, id))
    .groupBy(galleryImages.id)
    .limit(1);

  if (!row || row.length === 0) return null;

  return row[0];
}

export async function getImageStatsById(
  postId: string
): Promise<ImageMetadata | null> {
  const stats = await db
    .select()
    .from(postStats)
    .where(eq(postStats.postId, postId))
    .limit(1);

  //if no stats exits
  if (!stats || stats.length === 0) {
    return {
      id: postId,
      likeCount: 0,
      downloadCount: 0,
      promptCopyCount: 0,
    };
  }
  return {
    id: postId,
    likeCount: stats[0].likeCount,
    downloadCount: stats[0].downloadCount,
    promptCopyCount: stats[0].promptCopyCount,
  };
}
