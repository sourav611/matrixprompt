"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { CopyIcon, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { GalleryImage } from "@/types/image.types";

interface GalleryFetchPageProps {
  images: GalleryImage[];
  likedPostIds: Set<string>;
  currentUserId: string | null;
}

export default function GalleryFetchPage({
  images,
  likedPostIds,
  currentUserId,
}: GalleryFetchPageProps) {
  const router = useRouter();
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  const [localLikedPosts, setLocalLikedPosts] =
    useState<Set<string>>(likedPostIds);

  const [loadingPosts, setLoadingPosts] = useState<Set<string>>(new Set());

  const heartVariants: Variants = {
    hidden: { opacity: 0, y: -6, pointerEvents: "none" },
    visible: {
      opacity: 1,
      y: 0,
      pointerEvents: "auto",
      transition: { delay: 0.08, duration: 0.18, ease: "easeOut" },
    },
  };
  const handleImageClick = (imageId: string) => {
    router.push(`/gallery/${imageId}`);
  };

  const handleLikeToggle = async (e: React.MouseEvent, postId: string) => {
    console.log("Heart clicked ", postId);
    console.log("Current user", currentUserId);
    e.stopPropagation();

    if (!currentUserId) {
      alert("Please log in to like posts");
      return;
    }
    //don't allow clicking if already loading
    if (loadingPosts.has(postId)) return;

    const isCurrentlyLiked = localLikedPosts.has(postId);

    //optimized update  - change UI instantly
    setLocalLikedPosts((prev) => {
      const newSet = new Set(prev);
      if (isCurrentlyLiked) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });

    setLoadingPosts((prev) => new Set(prev).add(postId));

    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: isCurrentlyLiked ? "DELETE" : "POST",
      });
      if (!response.ok) {
        throw new Error("Failed to toggle like");
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      //rollback on error
      setLocalLikedPosts((prev) => {
        const newSet = new Set(prev);
        if (isCurrentlyLiked) {
          newSet.add(postId); //was liked then add it back
        } else {
          newSet.delete(postId); //was unliked remove it then
        }
        return newSet;
      });
      alert("Failed to update like , Please try again");
    } finally {
      //remove from loading
      setLoadingPosts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }
  };

  if (images.length === 0) {
    return (
      <p className="text-center text-gray-500">
        No images yet. Check back soon!
      </p>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="masonry-grid py-4">
        {images.map((image) => {
          const isLiked = localLikedPosts.has(image.id);
          const isLoading = loadingPosts.has(image.id);
          return (
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
                  {/* like and dislike button  */}
                  <div className="absolute right-3 top-3 ">
                    <motion.button
                      variants={heartVariants}
                      onClick={(e) => handleLikeToggle(e, image.id)}
                      disabled={isLoading}
                      className="flex size-9 border border-y-lime-300 items-center justify-center rounded-lg backdrop-blur-md transition-all"
                    >
                      <Heart
                        className={`size-4 cursor-pointer transition-colors ${
                          isLiked
                            ? "fill-red-500 stroke-red-500"
                            : "fill-none stroke-current"
                        }`}
                        strokeWidth={1.5}
                      />
                    </motion.button>
                  </div>
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
          );
        })}
      </div>
    </div>
  );
}