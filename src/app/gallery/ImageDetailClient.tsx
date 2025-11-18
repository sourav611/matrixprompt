"use client";
import { GalleryImage, ImageMetadata } from "@/types/image.types";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import {
  Copy,
  DownloadIcon,
  Heart,
  Monitor,
  Sparkles,
  Zap,
} from "lucide-react";
import { mockCategories } from "./category-data";

interface ImageProps {
  imagedata: GalleryImage;
  imageStats: ImageMetadata;
}

export default function ImageDetailClient({
  imagedata,
  imageStats,
}: ImageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Action Bar */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-border bg-background/80 backdrop-blur-sm"
      >
        add a header here
      </motion.header>

      {/* Main Content - 100vh */}
      <div className="mx-auto max-w-[1920px]">
        <div className="flex h-[calc(100vh-73px)]">
          {/* Image Container - 75% */}
          <div className="flex w-[75%] border-r border-border">
            {/* Image - 60% of 75% */}
            <div className="flex w-[60%] items-center justify-center bg-muted/30 p-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="relative h-full w-full"
              >
                <Image
                  src={imagedata.imageUrl}
                  alt="AI Generated Image"
                  fill
                  className="rounded-lg object-contain"
                  priority
                />
              </motion.div>
            </div>

            {/* Metadata - 40% of 75% */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex w-[40%] flex-col gap-6 overflow-y-auto p-8"
            >
              {/* Model */}
              <div>
                <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5" strokeWidth={1.5} />
                  Model
                </div>
                <p className="text-lg font-semibold text-foreground">
                  {imagedata.aiModel}
                </p>
              </div>

              {/* Category Tag */}
              <div>
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {imagedata.category}
                </span>
              </div>

              <div className="h-px bg-border" />

              {/* Prompt */}
              <div>
                <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <Monitor className="h-3.5 w-3.5" strokeWidth={1.5} />
                  Prompt
                </div>
                <div className="relative">
                  <p className={`text-sm leading-relaxed text-foreground/80`}>
                    {imagedata.prompt}
                  </p>
                </div>
              </div>

              <div className="h-px bg-border" />

              {/* Settings */}
              <div>
                <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <Zap className="h-3.5 w-3.5" strokeWidth={1.5} />
                  Settings
                </div>
                <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Heart className="size-4" />
                    <span>{imageStats.likeCount} likes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DownloadIcon className="size-4" />
                    <span>{imageStats.downloadCount} downloads</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Copy className="size-4" />
                    <span>{imageStats.promptCopyCount} copies</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          {/* side explore more categories */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-[25%] overflow-y-auto p-6"
          >
            <h3 className="mb-4 text-sm font-semibold text-foreground">
              More Like This
            </h3>
            <div className="space-y-4">
              {mockCategories.map((category) => (
                <motion.div
                  key={category.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative cursor-pointer overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg"
                >
                  <div className="grid grid-cols-2 gap-1 p-1">
                    {category.thumbnails.map((thumb, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-square overflow-hidden rounded-lg"
                      >
                        <Image
                          src={thumb}
                          alt=""
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-end bg-linear-to-t from-overlay/80 via-overlay/40 to-transparent p-4">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {category.name}
                      </p>
                      <p className="text-xs text-white/80">
                        {category.pinCount} pins
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <button className="mt-6 w-full rounded-lg border border-border bg-secondary/50 px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary">
              Load More Categories
            </button>
          </motion.aside>
        </div>
      </div>

      {/* More to Explore - 5 Column Masonry */}
      <section className="border-t border-border bg-background py-12">
        <div className="mx-auto max-w-[1920px] px-6">
          <h2 className="mb-8 text-2xl font-semibold text-foreground">
            More to Explore
          </h2>
        </div>
      </section>
    </div>
  );
}
