import { db } from "@/db";
import { galleryImages } from "@/db/schema";
import { getUser } from "@/utils/supabase/server";
import { getSupabaseStorageClient } from "@/utils/supabase/storage";
import { NextResponse } from "next/server";

export async function POST(request: Request){
  try{
    //check if it is admin 
    const user = await getUser();
    if(!user || user.email !== process.env.ADMIN_EMAIL){
      return NextResponse.json({error: "Unauthorized request"}, {status: 401})
    }

    const { fileName, fileSize, prompt, aiModel, category } =
      await request.json();
    //validate inputs 
    if(!fileName || !fileSize || !prompt){
      return NextResponse.json({error: "Missing required fields"}, {status: 400})
    }
    //check file size (not more than 5 mb)
    if(fileSize > 5 * 1024 * 1024){
      return NextResponse.json({error: "File size exceeds 5MB limit"}, {status: 400})
    }
    //generate unique file path 
    const timestamp = Date.now();
    const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `${timestamp}-${cleanFileName}`;

    //create pending record in db 
    const [record] = await db.insert(galleryImages).values({
      uploadedBy: user.id,
      imageUrl: `pending-${timestamp}`,
      prompt,
      aiModel: aiModel || null,
      category: category || null,
      fileSize,
      isPublic: true,
    }).returning();

    //generate signed upload url 
    const supabase = getSupabaseStorageClient();
    const {data, error} = await supabase.storage.from('gallery-main').createSignedUploadUrl(filePath);

    if(error){
      console.error("Signed URL generation error:", error);
      return NextResponse.json({error: "Failed to generate upload URL"}, {status: 500})
    }

    return NextResponse.json({
      uploadUrl: data.signedUrl,
      filePath,
      recordId: record.id,
    })
  }catch(error){
    console.error("Generate URL error:", error);
    return NextResponse.json({error: "Internal server error"}, {status: 500})
  }
}