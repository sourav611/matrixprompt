import { db } from "@/db";
import { postStats } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request, {params}: {params: Promise<{postId: string}>}){
  try{
    const {postId} = await  params;

    const stats = await db.select().from(postStats).where(eq(postStats.postId, postId)).limit(1)

    //no stats row condition handle for posts with no interactions 
    if(stats.length === 0 ){
      return NextResponse.json({
        likeCount: 0,
        downloadCount: 0,
        promptCopyCount: 0,
      })
    }
    return NextResponse.json({
      likeCount: stats[0].likeCount,
      downloadCount: stats[0].downloadCount,
      promptCopyCount: stats[0].promptCopyCount,
    })
  }catch(error){
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      {error: 'Failed to fetch stats'},
      {status: 500}
    )
  }
}