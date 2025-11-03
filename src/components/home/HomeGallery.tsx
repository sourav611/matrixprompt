"use client"
import React, { useState } from 'react'
import { DemoGalleryImage, mockImages } from "../demo/gallery-data";
import { motion } from "framer-motion";
import { Copy, Heart, ThumbsDown } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HomeGallery() {
  const router = useRouter();
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const [images, setImages] = useState<DemoGalleryImage[]>(mockImages);

  const handleImageClick = (imageId: string) => {
    router.push(`/image/${imageId}`);
  };

  const toggleLike = (imageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setImages((prev) =>
      prev.map((img) =>
        img.id === imageId
          ? {
              ...img,
              isLiked: !img.isLiked,
              likes: img.isLiked ? img.likes - 1 : img.likes + 1,
            }
          : img
      )
    );
  };

  const copyPrompt = (prompt: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(prompt);
    // In production, show toast notification
  };
  return (
    <div className="p-4 pt-6">
      {/* masonry grid for gallery images */}
      <div className="p-6">
        <div className="masonry-grid">
          {images.map((image, idx) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="masonry-item group relative cursor-pointer overflow-hidden rounded-lg"
              onMouseEnter={() => setHoveredImage(image.id)}
              onMouseLeave={() => setHoveredImage(null)}
              onClick={() => handleImageClick(image.id)}
            >
              <Image
                src={image.url}
                alt={image.prompt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Hover Overlay */}
              {hoveredImage === image.id && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-linear-to-t from-overlay/90 via-overlay/40 to-transparent"
                >
                  {/* Like & Dislike Buttons - Top Right */}
                  <div className="absolute right-3 top-3 flex gap-2">
                    <motion.button
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      onClick={(e) => toggleLike(image.id, e)}
                      className={`flex h-9 w-9 items-center justify-center rounded-lg backdrop-blur-md transition-all ${
                        image.isLiked
                          ? "bg-destructive/90 text-destructive-foreground"
                          : "bg-card/90 text-foreground hover:bg-card"
                      }`}
                    >
                      <Heart
                        className="h-4 w-4"
                        strokeWidth={1.5}
                        fill={image.isLiked ? "currentColor" : "none"}
                      />
                    </motion.button>
                    <motion.button
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.15 }}
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-card/90 text-foreground backdrop-blur-md hover:bg-card"
                    >
                      <ThumbsDown className="h-4 w-4" strokeWidth={1.5} />
                    </motion.button>
                  </div>

                  {/* Prompt Card - Bottom */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="absolute bottom-0 left-0 right-0 p-4"
                  >
                    <div className="rounded-lg bg-card/95 p-3 backdrop-blur-md">
                      <p className="line-clamp-2 text-xs text-foreground/80">
                        {image.prompt}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[10px] font-medium text-muted-foreground">
                          {image.model}
                        </span>
                        <button
                          onClick={(e) => copyPrompt(image.prompt, e)}
                          className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-secondary/50"
                        >
                          <Copy
                            className="h-3 w-3 text-muted-foreground"
                            strokeWidth={1.5}
                          />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}