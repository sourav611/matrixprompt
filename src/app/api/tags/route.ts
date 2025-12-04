import { db } from "@/db";
import { imageTags, tags } from "@/db/schema";
import { count, desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const allTags = await db
      .select({
        id: tags.id,
        name: tags.name,
        slug: tags.slug,
        usageCount: count(imageTags.tagId),
      })
      .from(tags)
      .leftJoin(imageTags, eq(tags.id, imageTags.tagId))
      .groupBy(tags.id)
      .orderBy(desc(count(imageTags.tagId)));

    return NextResponse.json(allTags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}
