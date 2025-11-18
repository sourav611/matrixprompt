import { db } from "@/db"; // your drizzle instance
import { galleryImages, postStats } from "@/db/schema";
import { GalleryImage, ImageMetadata } from "@/types/image.types";
import { eq } from "drizzle-orm";

export async function getImageById(id: string): Promise<GalleryImage | null> {
  const row = await db
    .select()
    .from(galleryImages)
    .where(eq(galleryImages.id, id))
    .limit(1);

  if (!row || row.length === 0) return null;

  const r = row[0];
  return {
    id: r.id,
    imageUrl: r.imageUrl,
    prompt: r.prompt,
    aiModel: r.aiModel,
    category: r.category,
    createdAt: r.createdAt,
  };
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
