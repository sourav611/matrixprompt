import { db } from "@/db";
import { galleryImages, imageTags } from "@/db/schema";
import { getUser } from "@/utils/supabase/server";
import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";
import { getOrCreateTag } from "@/lib/tags";
import { validateTagName } from "@/lib/tags-validation";

export async function POST(request: Request){
  try{
    //check if it is admin 
    const user = await getUser();
    if(!user || user.email !== process.env.ADMIN_EMAIL){
      return NextResponse.json({error: "Unauthorized request"}, {status: 401})
    }

    const { fileName, fileSize, prompt, aiModel, category, tags: tagNames } =
      await request.json();
    //validate inputs 
    if(!fileName || !fileSize || !prompt){
      return NextResponse.json({error: "Missing required fields"}, {status: 400})
    }

    //check file size (not more than 10 mb for Cloudinary usually, keeping 5 for safety or increasing)
    // Cloudinary handles large files well, but let's keep a check.
    if(fileSize > 10 * 1024 * 1024){
      return NextResponse.json({error: "File size exceeds 10MB limit"}, {status: 400})
    }
    
    // Create pending record in db with transaction
    const record = await db.transaction(async (tx) => {
      // We don't have the final URL yet, so we use a placeholder
      const [newRecord] = await tx.insert(galleryImages).values({
        uploadedBy: user.id,
        imageUrl: "pending-upload", 
        prompt,
        aiModel: aiModel || null,
        category: category || null,
        fileSize,
        isPublic: true,
      }).returning();

      // Handle Tags
      if (tagNames && Array.isArray(tagNames)) {
        for (const tagName of tagNames) {
          // Validate tag name using the utility
          const validationError = validateTagName(tagName);
          if (validationError) {
            // Throwing an error here triggers the transaction rollback
            throw new Error(`Invalid tag '${tagName}': ${validationError}`);
          }

          const tag = await getOrCreateTag(tagName, tx);
          // Create junction
          await tx.insert(imageTags).values({
            imageId: newRecord.id,
            tagId: tag.id,
          });
        }
      }
      
      return newRecord;
    });

    // Generate Cloudinary Signature
    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = "slopdrift-gallery"; // Organized folder

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder,
      },
      process.env.CLOUDINARY_API_SECRET!
    );

    return NextResponse.json({
      timestamp,
      folder,
      signature,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      recordId: record.id,
    })
  }catch(error){
    console.error("Generate URL error:", error);
    return NextResponse.json({error: "Internal server error"}, {status: 500})
  }
}