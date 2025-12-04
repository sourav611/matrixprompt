import { db } from "@/db";
import { tags } from "@/db/schema";
import { eq } from "drizzle-orm";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getOrCreateTag(name: string, tx: any = db) {
  // 1. Generate slug
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // remove non-alphanumeric chars
    .replace(/\s+/g, "-"); // replace spaces with hyphens

  // 2. Check if tag exists
  const existingTag = await tx
    .select()
    .from(tags)
    .where(eq(tags.slug, slug))
    .limit(1);

  if (existingTag && existingTag.length > 0) {
    return existingTag[0];
  }

  // 3. Create new tag
  const [newTag] = await tx
    .insert(tags)
    .values({
      name: name.trim(),
      slug,
    })
    .returning();

  return newTag;
}
