"use server";

import { db } from "@/db";
import { imageTags, tags } from "@/db/schema";
import { desc, eq, ilike, sql } from "drizzle-orm";

export async function searchTags(query: string) {
  if (!query || query.length < 1) return [];

  // Returns tags where name starts with or contains the query
  // Limit to 10-20 results for autocomplete
  // Order by most frequently used (count from image_tags)

  const results = await db
    .select({
      id: tags.id,
      name: tags.name,
      slug: tags.slug,
      count: sql<number>`count(${imageTags.tagId})`.mapWith(Number),
    })
    .from(tags)
    .leftJoin(imageTags, eq(tags.id, imageTags.tagId))
    .where(ilike(tags.name, `%${query}%`))
    .groupBy(tags.id)
    .orderBy(desc(sql`count(${imageTags.tagId})`)) // Most used first
    .limit(20);

  return results;
}
