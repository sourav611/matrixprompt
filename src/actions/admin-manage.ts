"use server";

import { db } from "@/db";
import { galleryImages, imageTags, tags } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import cloudinary from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";

export interface AdminGalleryImage {
  id: string;
  imageUrl: string;
  prompt: string;
  aiModel: string | null;
  category: string | null;
  createdAt: Date;
  tags: string[];
}

export async function getAllImagesForAdmin(): Promise<AdminGalleryImage[]> {
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
    .groupBy(galleryImages.id)
    .orderBy(desc(galleryImages.createdAt));

  return images;
}

export async function deleteImage(id: string, imageUrl: string) {
  try {
    // 1. Delete from Database
    await db.delete(galleryImages).where(eq(galleryImages.id, id));

    // 2. Delete from Cloudinary
    // Extract public_id from URL
    // URL format: https://res.cloudinary.com/<cloud_name>/image/upload/v<version>/<folder>/<public_id>.<ext>
    // or without version, or without folder.
    // Best guess extraction:
    
    const regex = /\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/;
    const match = imageUrl.match(regex);
    
    if (match && match[1]) {
      const publicId = match[1]; // This should capture "folder/filename" or just "filename"
      await cloudinary.uploader.destroy(publicId);
    } else {
        console.warn("Could not extract public_id from Cloudinary URL:", imageUrl);
    }

    revalidatePath("/admin/manage");
    revalidatePath("/admin/dashboard");
    revalidatePath("/"); // Update home page
    return { success: true };
  } catch (error) {
    console.error("Error deleting image:", error);
    return { success: false, error: "Failed to delete image" };
  }
}
