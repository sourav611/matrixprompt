import { db } from "@/db";
import { postLikes, postStats } from "@/db/schema";
import { getUser } from "@/utils/supabase/server";
import { and, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(request:Request, {params}: {params: Promise<{postId: string}> | {postId: string}}){
  try{
    // verifying user before like
    const user = await getUser();
    if(!user){
      return NextResponse.json(
        {error: "Unauthorized"},
        {status: 401}
      )
    }
    const {postId} = await Promise.resolve(params);
    await db.insert(postLikes).values({
      userId: user.id,
      postId: postId,
    }).onConflictDoNothing()

    //upsert into post_stats for likes count
    await db.insert(postStats).values({
      postId: postId,
      likeCount: 1,
      downloadCount: 0,
      promptCopyCount: 0,
    }).onConflictDoUpdate({
      target: postStats.postId,
      set: {
        likeCount: sql`${postStats.likeCount} + 1`,
        updatedAt: sql`NOW()`,
      }
    })
    return NextResponse.json({success: true})
  }catch(error){
    console.error('Error liking this post:', error)
    return NextResponse.json(
      {error: 'Failed to like post'},
      {status: 500}
    )
  }
}

//unlike 
export async function DELETE(request:Request,{params}: {params: Promise<{postId: string}> | {postId: string}}){
  try {
    const user = await getUser();
    if(!user){
      return NextResponse.json(
        {error: 'Unauthorized'},
        {status: 401}
      )
    }
    const {postId} = await Promise.resolve(params);

    //delete from post_likes
    await db.delete(postLikes).where(
      and(
        eq(postLikes.userId, user.id),
        eq(postLikes.postId, postId)
      )
    )
    //decrease like count in post_stats
    //!todo - if like count is zero handle it logic add here
    await db.update(postStats).set({
      likeCount: sql`${postStats.likeCount} - 1`,
      updatedAt: sql`NOW()`
    }).where(eq(postStats.postId, postId))
    return NextResponse.json({success: true})
  } catch (error) {
    console.error('Error unliking post:', error)
    return NextResponse.json(
      {error: 'Failed to unlike post'},
      {status: 500}
    )
  }
}