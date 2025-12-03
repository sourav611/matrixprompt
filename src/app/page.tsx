import GalleryFetchPage from "./admin/GalleryFetchPage";
import { db } from "@/db";
import { postLikes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getUser } from "@/utils/supabase/server";
import { getImages } from "@/lib/gallery-image";

export const revalidate = 3600;

async function getLikedPostIds(userId: string | null) {
  if (!userId) return new Set<string>();

  const likedPosts = await db
    .select({ postId: postLikes.postId })
    .from(postLikes)
    .where(eq(postLikes.userId, userId));

  return new Set(likedPosts.map((row) => row.postId));
}

export default async function Home() {
  const showImages = await getImages();
  const user = await getUser();

  const likedPostIds = await getLikedPostIds(user?.id || null);

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

        <GalleryFetchPage
          images={showImages}
          likedPostIds={likedPostIds}
          currentUserId={user?.id || null}
        />
      </div>
    </div>
  );
}
