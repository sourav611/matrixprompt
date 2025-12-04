"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Heart,
  Download,
  Search,
  X,
  SlidersHorizontal,
  ArrowDownUp,
  Sparkles,
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
      {/* Sleek Floating Toolbar */}
      <div className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-2xl supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto flex flex-col gap-4 px-4 py-3 md:py-4">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            {/* Search Input */}
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground opacity-50" />
              <input
                type="text"
                placeholder="Filter by prompt, model, or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-xl border border-border/50 bg-muted/30 pl-9 pr-8 text-sm shadow-sm transition-all placeholder:text-muted-foreground/50 hover:bg-muted/50 focus:border-primary/30 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center gap-3 self-end md:self-auto">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="appearance-none rounded-lg bg-muted/30 py-2 pl-3 pr-8 text-xs font-medium text-foreground transition-colors hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/10 cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
                <ArrowDownUp className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Categories - Horizontal Scroll */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide mask-fade-right">
            <SlidersHorizontal className="mr-2 h-3 w-3 shrink-0 text-muted-foreground/70" />
            {categories.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`relative px-3 py-1 text-[11px] font-medium transition-all rounded-full whitespace-nowrap ${
                    isSelected
                      ? "bg-foreground text-background shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {isSelected && (
                    <motion.span
                      layoutId="activeCategory"
                      className="absolute inset-0 -z-10 rounded-full bg-foreground"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results Stats */}
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
          <Sparkles className="h-3 w-3" />
          <span>
            {filteredImages.length} Result{filteredImages.length !== 1 && "s"}
          </span>
          {selectedCategory !== "All" && (
            <>
              <span>•</span>
              <span className="text-foreground">{selectedCategory}</span>
            </>
          )}
        </div>

        {filteredImages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted/30 shadow-inner">
              <Search className="h-6 w-6 text-muted-foreground/40" />
            </div>
            <h3 className="mb-2 text-base font-medium text-foreground">
              No results found
            </h3>
            <p className="mb-8 max-w-xs text-sm text-muted-foreground">
              Try adjusting your search or filters to find what you&apos;re
              looking for.
            </p>
            <button
              onClick={clearFilters}
              className="rounded-full border border-border bg-background px-6 py-2 text-xs font-medium transition-colors hover:bg-muted hover:text-foreground"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 2xl:columns-4 gap-4">
            {filteredImages.map((image) => {
              const isLiked = localLikedPosts.has(image.id);

              return (
                <div key={image.id} className="break-inside-avoid mb-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "50px" }}
                    transition={{ duration: 0.4 }}
                    className="group relative cursor-pointer w-full"
                  >
                    <Link
                      href={`/gallery/${image.id}`}
                      scroll={false}
                      className="block w-full"
                    >
                      <div className="relative w-full overflow-hidden rounded-2xl bg-muted transition-all duration-500 hover:shadow-2xl dark:bg-muted/10 dark:shadow-black/50">
                        <Image
                          src={image.imageUrl}
                          alt={image.prompt}
                          width={500}
                          height={500}
                          className="h-auto w-full object-cover transition-transform duration-700 will-change-transform group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />

                        {/* Overlay Gradient - Only shows on hover */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                        {/* Top Badges */}
                        <div className="absolute left-3 top-3 flex gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100">
                          <span className="rounded-md bg-black/40 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-md border border-white/10">
                            {image.aiModel || "AI"}
                          </span>
                        </div>

                        {/* Action Buttons - Slide in from right */}
                        <div className="absolute right-3 top-3 flex flex-col gap-2 translate-x-4 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                          <button
                            onClick={(e) => handleLikeToggle(e, image.id)}
                            className={`flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all ${
                              isLiked
                                ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
                                : "bg-black/40 text-white hover:bg-white hover:text-black"
                            }`}
                          >
                            <Heart
                              className={`h-3.5 w-3.5 ${
                                isLiked ? "fill-current" : ""
                              }`}
                            />
                          </button>
                          <button
                            onClick={(e) => handleDownload(e, image.imageUrl)}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all hover:bg-white hover:text-black"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Bottom Info - Slide up */}
                        <div className="absolute bottom-0 left-0 right-0 translate-y-4 opacity-0 p-4 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                          <p className="line-clamp-2 text-xs font-medium leading-relaxed text-white/90">
                            {image.prompt}
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-[10px] text-white/60 uppercase tracking-wide">
                              {image.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}