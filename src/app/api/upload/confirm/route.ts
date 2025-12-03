import { db } from "@/db";
import { galleryImages } from "@/db/schema";
import { getUser } from "@/utils/supabase/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(request: Request){
  try {
    //checking admin 
    const user = await getUser();
    if(!user || user.email !== process.env.ADMIN_EMAIL){
      return NextResponse.json({error: "Unauthorized admin access"}, {status: 401})
    }
    
    // We now expect the actual imageUrl from Cloudinary
    const { recordId, imageUrl } = await request.json();
    
    if(!recordId || !imageUrl){
      return NextResponse.json({error: "Missing required fields"}, {status: 400})
    }

    //update database record with actual image url 
    await db.update(galleryImages).set({imageUrl: imageUrl}).where(eq(galleryImages.id, recordId))
    
    return NextResponse.json({
      success: true,
      imageUrl: imageUrl
    });
  } catch (error) {
    console.error("Confirm upload error:", error);
    return NextResponse.json({error: "Internal server error:"},{status: 500})
  }
}