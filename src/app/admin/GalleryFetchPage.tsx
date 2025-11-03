"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { CopyIcon } from "lucide-react";

type GalleryImage = {
  id: string;
  imageUrl: string;
  prompt: string;
  aiModel: string | null;
  category: string | null;
  createdAt: string;
};

export default function GalleryFetchPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchImages() {
      try {
        const response = await fetch("/api/gallery");
        const data = await response.json();
        setImages(data.images);
      } catch (error) {
        console.error("Failed to fetch images:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchImages();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 animate-spin" />
        <span>Loading.....</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-[7.8vw] tracking-tight leading-[9vw] font-semibold whitespace-nowrap">
          Stop faking it in Photoshop
        </h2>
        <div className="text-xl ">
          Put yourself in the picture. Literally with one click
        </div>
      </div>

      <div className="masonry-grid py-4">
        {images.map((image) => (
          <motion.div
            key={image.id}
            onMouseEnter={() => setHoveredImage(image.id)}
            onMouseLeave={() => setHoveredImage(null)}
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

      {images.length === 0 && (
        <p className="text-center text-gray-500">
          No images yet. Check back soon!
        </p>
      )}
    </div>
  );
}