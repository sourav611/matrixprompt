"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { CopyIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { GalleryImage } from "@/types/image.types";

export default function GalleryFetchPage({
  images,
}: {
  images: GalleryImage[];
}) {
  const router = useRouter();
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  const handleImageClick = (imageId: string) => {
    router.push(`/gallery/${imageId}`);
  };

  if (images.length === 0)
    <p className="text-center text-gray-500">
      No images yet. Check back soon!
    </p>;

  return (
    <div className="container mx-auto p-8">
      <div className="masonry-grid py-4">
        {images.map((image) => (
          <motion.div
            key={image.id}
            onMouseEnter={() => setHoveredImage(image.id)}
            onMouseLeave={() => setHoveredImage(null)}
            onClick={() => handleImageClick(image.id)}
            className="masonry-item group relative cursor-pointer rounded-lg overflow-hidden "
          >
            <Image
              src={image.imageUrl}
              alt={image.prompt}
              fill
              className="object-cover"
            />
            {/* hover overlay content on image grid */}
            {hoveredImage === image.id && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="absolute inset-0 "
              >
                {/* prompt card - bottom  */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="rounded-lg bg-card/95 p-3 backdrop-blur-md">
                    <p className="line-clamp-2 text-xs text-foreground/80">
                      {image.prompt}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] font-medium text-muted-foreground">
                        {image.aiModel}
                      </span>{" "}
                      <button className="flex h-7 w-7 items-center justify-center">
                        <CopyIcon
                          className="h-4 w-4 text-muted-foreground"
                          strokeWidth={1.5}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}