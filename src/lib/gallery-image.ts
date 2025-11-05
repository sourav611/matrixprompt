// lib/gallery.ts
import { db } from "@/db"; // your drizzle instance
import { galleryImages } from "@/db/schema";
import { GalleryImage } from "@/types/image.types";
import { eq } from "drizzle-orm";

export async function getImageById(id: string): Promise<GalleryImage | null> {
  const row = await db.select()
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
