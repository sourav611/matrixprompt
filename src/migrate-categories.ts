// import 'dotenv/config';
// import { db } from '@/db';
// import { galleryImages, imageTags } from '@/db/schema';
// import { getOrCreateTag } from '@/lib/tags';
// import { eq, and } from 'drizzle-orm';

// async function migrate() {
//   console.log("Starting migration of categories to tags...");
  
//   try {
//     const images = await db.select().from(galleryImages);
//     console.log(`Found ${images.length} images.`);

//     for (const img of images) {
//       if (img.category) {
//         console.log(`Processing image ${img.id} with category: '${img.category}'`);
//         try {
//           const tag = await getOrCreateTag(img.category);
          
//           // Check if link exists
//           const existingLink = await db.select()
//               .from(imageTags)
//               .where(and(
//                   eq(imageTags.imageId, img.id),
//                   eq(imageTags.tagId, tag.id)
//               ));
              
//           if (existingLink.length === 0) {
//                await db.insert(imageTags).values({
//                   imageId: img.id,
//                   tagId: tag.id
//               });
//               console.log(`  -> Linked tag '${tag.name}' (ID: ${tag.id})`);
//           } else {
//               console.log(`  -> Tag '${tag.name}' already linked.`);
//           }

//         } catch (e) {
//           console.error(`  -> Error processing ${img.id}:`, e);
//         }
//       }
//     }
//     console.log("Migration complete.");
//   } catch (err) {
//     console.error("Migration failed:", err);
//   }
//   process.exit(0);
// }

// migrate();