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
import Link from "next/link";

interface ImageProps {
  imagedata: GalleryImage;
  imageStats: ImageMetadata;
  allImages: GalleryImage[];
}

export default function ImageDetailClient({
  imagedata,
  imageStats,
  allImages,
}: ImageProps) {
  return (
    <div className="bg-background h-full rounded-lg overflow-y-auto">
      {/* Main Content */}
      <div className="flex">
        <div className="flex w-full border-r border-border">
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
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex w-[40%] flex-col gap-6 overflow-y-auto p-8"
          >
            {/* Model, Category, Prompt, Settings... */}
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5" strokeWidth={1.5} />
                Model
              </div>
              <p className="text-lg font-semibold text-foreground">
                {imagedata.aiModel}
              </p>
            </div>
            <div>
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {imagedata.category}
              </span>
            </div>
            <div className="h-px bg-border" />
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
      </div>
      {/* More Posts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6"
      >
        <h3 className="mb-4 text-sm font-semibold text-foreground">
          More Posts
        </h3>
        <div className="masonry-grid">
          {allImages.map((image) => (
            <Link key={image.id} href={`/gallery/${image.id}`} scroll={false}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative cursor-pointer overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-lg"
              >
                <div className="relative aspect-square w-full overflow-hidden">
                  <Image
                    src={image.imageUrl}
                    alt=""
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

