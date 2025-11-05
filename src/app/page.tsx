import HomeGallery from "@/components/home/HomeGallery";
import GalleryFetchPage from "./admin/GalleryFetchPage";
import { db } from "@/db";
import { galleryImages } from "@/db/schema";
import { and, desc, eq, notLike } from "drizzle-orm";

export const revalidate = 3600;

async function getImages() {
  const images = await db
    .select()
    .from(galleryImages)
    .where(
      and(
        eq(galleryImages.isPublic, true),
        notLike(galleryImages.imageUrl, "pending-%")
      )
    )
    .orderBy(desc(galleryImages.createdAt));
  return images;
}

export default async function Home() {
  const showImages = await getImages();

  return (
    <div>
      <div className="container mx-auto p-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-[7.8vw] tracking-tight leading-[9vw] font-semibold whitespace-nowrap">
            Stop faking it in Photoshop
          </h2>
          <div className="text-xl">
            Put yourself in the picture. Literally with one click
          </div>
        </div>

        <GalleryFetchPage images={showImages} />
      </div>

      <HomeGallery />
    </div>
  );
}
