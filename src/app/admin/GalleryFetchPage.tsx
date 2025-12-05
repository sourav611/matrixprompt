"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Download,
  Search,
  X,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Filter,
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
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [isTagsExpanded, setIsTagsExpanded] = useState(false);

  // Like System
  const [localLikedPosts, setLocalLikedPosts] =
    useState<Set<string>>(likedPostIds);
  const [loadingPosts, setLoadingPosts] = useState<Set<string>>(new Set());

  // Extract Tags with Counts
  const allTagsWithCounts = useMemo(() => {
    const tagCounts = new Map<string, number>();
    
    images.forEach((img) => {
      img.tags?.forEach((tag) => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });

    // Sort by count (descending), then alphabetical
    return Array.from(tagCounts.entries())
      .sort((a, b) => {
        if (b[1] !== a[1]) return b[1] - a[1];
        return a[0].localeCompare(b[0]);
      })
      .map(([tag, count]) => ({ tag, count }));
  }, [images]);

  const visibleTags = useMemo(() => {
    if (isTagsExpanded) return allTagsWithCounts;
    return allTagsWithCounts.slice(0, 15); // Show top 15 initially
  }, [allTagsWithCounts, isTagsExpanded]);

  // Filter Logic
  const filteredImages = useMemo(() => {
    let result = [...images];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (img) =>
          img.prompt.toLowerCase().includes(query) ||
          (img.aiModel && img.aiModel.toLowerCase().includes(query)) ||
          (img.tags && img.tags.some((t) => t.toLowerCase().includes(query)))
      );
    }

    if (selectedTags.size > 0) {
      result = result.filter((img) =>
        img.tags?.some((tag) => selectedTags.has(tag))
      );
    }

    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [images, searchQuery, sortBy, selectedTags]);

  // Handlers
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
      if (isCurrentlyLiked) newSet.delete(postId);
      else newSet.add(postId);
      return newSet;
    });

    setLoadingPosts((prev) => new Set(prev).add(postId));

    try {
      await fetch(`/api/posts/${postId}/like`, {
        method: isCurrentlyLiked ? "DELETE" : "POST",
      });
    } catch (error) {
      console.error("Error toggling like:", error);
      setLocalLikedPosts((prev) => {
        const newSet = new Set(prev);
        if (isCurrentlyLiked) newSet.add(postId);
        else newSet.delete(postId);
        return newSet;
      });
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

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(tag)) newSet.delete(tag);
      else newSet.add(tag);
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* 1. Hero Section */}
      <div className="relative h-[550px] w-full flex items-center justify-center mb-8 overflow-hidden">
        {/* Hero Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/stockimages/divingwa.jpeg" // Fallback or dynamic
            alt="Hero Background"
            fill
            className="object-cover opacity-100" // Full opacity, handled by overlay
            priority
          />
          {/* Radial Gradient Overlay for Spotlight Effect */}
          <div 
            className="absolute inset-0" 
            style={{ background: 'radial-gradient(circle at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)' }} 
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-4xl px-6 text-center space-y-8 mt-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight drop-shadow-xl text-balance leading-tight">
            The best free AI generated stock photos shared by creators.
          </h1>
          
          {/* Big Search Bar */}
          <div className="relative max-w-2xl mx-auto">
             <div className="relative flex items-center w-full h-14 bg-white/95 backdrop-blur-sm rounded-full shadow-2xl overflow-hidden focus-within:ring-4 focus-within:ring-blue-500/30 transition-all duration-300 transform hover:scale-[1.01]">
               <div className="pl-5 text-gray-400">
                 <Search size={22} />
               </div>
               <input
                 type="text"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder="Search for free photos..."
                 className="w-full h-full px-4 text-gray-800 placeholder:text-gray-400 bg-transparent border-none outline-none text-lg font-medium"
               />
               {searchQuery && (
                 <button
                   onClick={() => setSearchQuery("")}
                   className="pr-5 text-gray-400 hover:text-gray-600 transition-colors"
                 >
                   <X size={20} />
                 </button>
               )}
             </div>
             <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-white/90 text-sm font-medium drop-shadow-md">
                <span className="opacity-70">Trending:</span>
                <span className="hover:text-white cursor-pointer hover:underline transition-all">nature,</span>
                <span className="hover:text-white cursor-pointer hover:underline transition-all">wallpaper,</span>
                <span className="hover:text-white cursor-pointer hover:underline transition-all">3d render,</span>
                <span className="hover:text-white cursor-pointer hover:underline transition-all">portrait</span>
             </div>
          </div>
        </div>
      </div>

      {/* 2. Sticky Navigation / Filter Bar */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-xl border-b border-border/40 transition-all duration-300">
         <div className="container mx-auto px-4 py-3">
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                {/* Tags Area */}
                <div className="flex-1 overflow-hidden relative">
                  {/* Fade Mask */}
                  <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
                  
                  <div className={`flex flex-wrap gap-2 ${!isTagsExpanded && "max-h-[40px] overflow-hidden transition-all duration-500 ease-out"}`}>
                      <button
                        onClick={() => {
                          setSelectedTags(new Set());
                          setSortBy("newest");
                        }}
                        className={`
                          px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap
                          ${selectedTags.size === 0 ? "bg-foreground text-background shadow-sm" : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"}
                        `}
                      >
                        Home
                      </button>
                      
                      {visibleTags.map(({ tag, count }) => {
                        const isSelected = selectedTags.has(tag);
                        return (
                          <button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className={`
                              flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border whitespace-nowrap
                              ${isSelected 
                                ? "bg-primary text-primary-foreground border-primary shadow-md transform scale-105" 
                                : "bg-background text-muted-foreground border-border/60 hover:border-foreground/30 hover:text-foreground hover:bg-muted/30"}
                            `}
                          >
                            {tag}
                            <span className={`text-[10px] font-semibold ${isSelected ? "opacity-100 text-primary-foreground/80" : "opacity-40"}`}>
                              {count}
                            </span>
                          </button>
                        );
                      })}

                      {/* Expand/Collapse Trigger */}
                      {allTagsWithCounts.length > 15 && (
                         <button 
                           onClick={() => setIsTagsExpanded(!isTagsExpanded)}
                           className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-primary hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/20"
                         >
                           {isTagsExpanded ? (
                             <>Show Less <ChevronUp size={14} /></>
                           ) : (
                             <>View All ({allTagsWithCounts.length}) <ChevronDown size={14} /></>
                           )}
                         </button>
                      )}
                  </div>
                </div>

                {/* Filter / Sort Trigger */}
                <div className="flex-shrink-0 relative group z-50 pl-2 border-l border-border/40">
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm font-medium text-muted-foreground hover:text-foreground">
                      <span className="hidden sm:inline">{sortBy === "newest" ? "Newest" : "Oldest"}</span>
                      <Filter size={16} />
                    </button>
                    {/* Dropdown */}
                    <div className="absolute right-0 top-full mt-2 w-36 bg-card/95 backdrop-blur-md border border-border rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
                      <button 
                        onClick={() => setSortBy("newest")}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-muted/50 first:rounded-t-xl transition-colors"
                      >
                        Newest First
                      </button>
                      <button 
                        onClick={() => setSortBy("oldest")}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-muted/50 last:rounded-b-xl transition-colors"
                      >
                        Oldest First
                      </button>
                    </div>
                </div>
              </div>
            </div>
         </div>
      </div>

      {/* 3. Masonry Grid */}
      <div className="container mx-auto px-4 py-8 min-h-[60vh]">
        {/* Results Count (Hidden if empty query) */}
        {(searchQuery || selectedTags.size > 0) && (
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-semibold tracking-tight">
              {filteredImages.length} Free Photos
            </h2>
          </div>
        )}

        {filteredImages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center opacity-60">
            <div className="bg-muted/50 p-6 rounded-full mb-4">
               <Search size={40} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">No images found</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
               Try adjusting your search terms or filters to find what you are looking for.
            </p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {filteredImages.map((image, index) => {
               const isLiked = localLikedPosts.has(image.id);
               
               return (
                 <div key={image.id} className="break-inside-avoid mb-6">
                   <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true, margin: "100px" }}
                     transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
                     className="group relative w-full bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 ring-1 ring-black/5 dark:ring-white/10"
                   >
                     <Link href={`/gallery/${image.id}`} scroll={false}>
                       <div className="relative w-full">
                         <Image
                           src={image.imageUrl}
                           alt={image.prompt}
                           width={800}
                           height={1000}
                           className="w-full h-auto object-cover block transition-transform duration-700 will-change-transform group-hover:scale-105"
                           sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                         />
                         
                         {/* Hover Overlay - Pexels Style */}
                         <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {/* Top Right Actions */}
                            <div className="absolute top-3 right-3 flex gap-2 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75">
                              <button 
                                onClick={(e) => handleLikeToggle(e, image.id)}
                                className={`p-2.5 rounded-full backdrop-blur-md transition-all transform hover:scale-110 active:scale-95 ${isLiked ? "bg-red-500 text-white shadow-lg shadow-red-500/20" : "bg-white/90 text-gray-700 hover:bg-white hover:text-black"}`}
                              >
                                <Heart size={18} className={isLiked ? "fill-current" : ""} />
                              </button>
                              <button 
                                onClick={(e) => { e.preventDefault(); /* Add to collection logic */ }}
                                className="p-2.5 rounded-full bg-white/90 text-gray-700 hover:bg-white hover:text-black backdrop-blur-md transform hover:scale-110 active:scale-95"
                              >
                                <TrendingUp size={18} />
                              </button>
                            </div>

                            {/* Bottom Info Bar */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                               <div className="flex items-center gap-3 text-white max-w-[70%]">
                                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold backdrop-blur-md shadow-inner border border-white/10 flex-shrink-0">
                                    {image.aiModel ? image.aiModel.slice(0, 2).toUpperCase() : "AI"}
                                  </div>
                                  <div className="flex flex-col min-w-0">
                                     <span className="text-sm font-semibold leading-none drop-shadow-md truncate">
                                       {image.aiModel || "Unknown Model"}
                                     </span>
                                     <span className="text-[10px] opacity-90 font-medium truncate mt-1">
                                       {image.tags?.[0] || "Promoted"}
                                     </span>
                                  </div>
                                </div>
                               <button 
                                 onClick={(e) => handleDownload(e, image.imageUrl)}
                                 className="p-2.5 rounded-full bg-white/90 text-gray-900 hover:bg-white transition-all transform hover:scale-110 active:scale-95 shadow-lg"
                               >
                                 <Download size={20} />
                               </button>
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