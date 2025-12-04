"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Download,
  MoreHorizontal,
  Search,
  Filter,
  X,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { GalleryImage } from "@/types/image.types";

interface GalleryFetchPageProps {
  images: GalleryImage[];
  likedPostIds: Set<string>;
  currentUserId: string | null;
}

type SortOption = "newest" | "oldest";

export default function GalleryFetchPage({
  images,
  likedPostIds,
  currentUserId,
}: GalleryFetchPageProps) {
  // State for interactivity
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  // Like System State
  const [localLikedPosts, setLocalLikedPosts] =
    useState<Set<string>>(likedPostIds);
  const [loadingPosts, setLoadingPosts] = useState<Set<string>>(new Set());

  // Extract Unique Categories
  const categories = useMemo(() => {
    const cats = new Set(
      images.map((img) => img.category).filter(Boolean) as string[]
    );
    return ["All", ...Array.from(cats)];
  }, [images]);

  // Filter and Sort Logic
  const filteredImages = useMemo(() => {
    let result = [...images];

    // 1. Filter by Category
    if (selectedCategory !== "All") {
      result = result.filter((img) => img.category === selectedCategory);
    }

    // 2. Filter by Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (img) =>
          img.prompt.toLowerCase().includes(query) ||
          (img.aiModel && img.aiModel.toLowerCase().includes(query)) ||
          (img.category && img.category.toLowerCase().includes(query))
      );
    }

    // 3. Sort
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [images, selectedCategory, searchQuery, sortBy]);

  const handleLikeToggle = async (e: React.MouseEvent, postId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUserId) {
      alert("Please log in to like posts");
      return;
    }
    if (loadingPosts.has(postId)) return;

    const isCurrentlyLiked = localLikedPosts.has(postId);

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
      setLocalLikedPosts((prev) => {
        const newSet = new Set(prev);
        if (isCurrentlyLiked) {
          newSet.add(postId);
        } else {
          newSet.delete(postId);
        }
        return newSet;
      });
      alert("Failed to update like , Please try again");
    } finally {
      setLoadingPosts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }
  };

  const handleDownload = (e: React.MouseEvent, imageUrl: string) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(imageUrl, "_blank");
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Controls Header */}
      <div className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto px-4 py-4 space-y-4">
          {/* Top Row: Search and Sort */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:max-w-md group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Search prompts, models, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-10 rounded-full bg-muted/50 border border-transparent focus:bg-background focus:border-primary/20 focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-muted text-muted-foreground"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="hidden sm:inline">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-transparent font-medium text-foreground outline-none cursor-pointer hover:opacity-80"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bottom Row: Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar mask-fade-right">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                  selectedCategory === category
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background border-border hover:border-foreground/20 text-muted-foreground hover:text-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Result Stats */}
        <div className="mb-6 flex items-center justify-between text-xs text-muted-foreground">
          <p>
            Showing{" "}
            <span className="font-medium text-foreground">
              {filteredImages.length}
            </span>{" "}
            result{filteredImages.length !== 1 && "s"}
            {selectedCategory !== "All" && (
              <span>
                {" "}
                in{" "}
                <span className="font-medium text-foreground">
                  {selectedCategory}
                </span>
              </span>
            )}
          </p>
        </div>

        {filteredImages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No results found
            </h3>
            <p className="text-muted-foreground max-w-sm mx-auto mb-6">
              We couldn&apos;t find any images matching{searchQuery}
              {selectedCategory !== "All"
                ? ` in the ${selectedCategory} category`
                : ""}
              .
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="masonry-grid">
            {filteredImages.map((image) => {
              const isLiked = localLikedPosts.has(image.id);

              return (
                <motion.div
                  layout
                  key={image.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "50px" }}
                  transition={{ duration: 0.4 }}
                  className="masonry-item group relative cursor-pointer break-inside-avoid mb-6"
                  onMouseEnter={() => setHoveredImage(image.id)}
                  onMouseLeave={() => setHoveredImage(null)}
                >
                  <Link
                    href={`/gallery/${image.id}`}
                    scroll={false}
                    className="block w-full h-full"
                  >
                    <div className="relative w-full h-full overflow-hidden rounded-xl bg-muted shadow-sm transition-shadow hover:shadow-xl dark:bg-muted/20">
                      <Image
                        src={image.imageUrl}
                        alt={image.prompt}
                        fill
                        className="object-cover transition-transform duration-700 will-change-transform group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />

                      {/* Stock Badge - e.g. Resolution or Model */}
                      <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                        <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-black/50 text-white rounded backdrop-blur-md border border-white/10">
                          {image.aiModel || "HQ"}
                        </span>
                      </div>

                      {/* Gradient Overlay */}
                      <div
                        className={`absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-300 ${
                          hoveredImage === image.id
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      />

                      {/* Hover Content */}
                      <AnimatePresence>
                        {hoveredImage === image.id && (
                          <>
                            {/* Top Right Actions */}
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute top-3 right-3 flex gap-2 z-20"
                            >
                              <button
                                onClick={(e) => handleLikeToggle(e, image.id)}
                                className={`p-2.5 rounded-lg backdrop-blur-md transition-all active:scale-90 ${
                                  isLiked
                                    ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
                                    : "bg-black/40 text-white hover:bg-white hover:text-black"
                                }`}
                              >
                                <Heart
                                  className={`w-4 h-4 ${
                                    isLiked ? "fill-current" : ""
                                  }`}
                                />
                              </button>
                              <button
                                className="p-2.5 rounded-lg bg-black/40 text-white backdrop-blur-md hover:bg-white hover:text-black transition-all active:scale-90"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }}
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                            </motion.div>

                            {/* Bottom Info */}
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              className="absolute bottom-0 left-0 right-0 p-4 text-white z-20"
                            >
                              <div className="flex items-end justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium leading-snug line-clamp-2 text-white/95 mb-2">
                                    {image.prompt}
                                  </p>

                                  <div className="flex items-center gap-3 text-[11px] font-medium text-white/70">
                                    {image.category && (
                                      <span className="bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
                                        {image.category}
                                      </span>
                                    )}
                                    <span className="uppercase tracking-wider opacity-75">
                                      JPG
                                    </span>
                                  </div>
                                </div>

                                <div className="flex gap-2 shrink-0">
                                  <button
                                    onClick={(e) =>
                                      handleDownload(e, image.imageUrl)
                                    }
                                    className="h-10 w-10 flex items-center justify-center rounded-lg bg-white text-black hover:bg-white/90 shadow-lg transition-colors"
                                    title="Download"
                                  >
                                    <Download className="w-5 h-5" />
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}