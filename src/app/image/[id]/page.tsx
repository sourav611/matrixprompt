'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Heart,
  Download,
  Share2,
  MoreHorizontal,
  Sparkles,
  ChevronDown,
  Monitor,
  Zap,
} from 'lucide-react';
import Image from 'next/image';
import { useParams } from "next/navigation";
import { mockImages } from "@/components/demo/gallery-data";
import { mockCategories } from "@/app/gallery/category-data";

// Types
interface ImageData {
  id: string;
  url: string;
  prompt: string;
  model: string;
  settings: {
    resolution: string;
    quality: string;
    steps?: number;
    seed?: number;
  };
  category: string;
  likes: number;
  isLiked: boolean;
}

interface RelatedImage {
  id: string;
  url: string;
  title: string;
}

// Mock Data
const mockImageData: ImageData = {
  id: "2454624264",
  url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=1600",
  prompt:
    "A cozy wooden cabin nestled in misty mountains during golden hour, surrounded by pine trees and wildflowers, atmospheric lighting, cinematic composition, highly detailed, photorealistic",
  model: "Midjourney v6",
  settings: {
    resolution: "1024×1024",
    quality: "HD",
    steps: 50,
    seed: 123456789,
  },
  category: "Landscape",
  likes: 342,
  isLiked: false,
};


const mockExploreImages: RelatedImage[] = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
    title: "Mountain Cabin",
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
    title: "Snowy Peaks",
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e",
    title: "Forest Path",
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1426604966848-d7adac402bff",
    title: "Lake Reflection",
  },
  {
    id: "5",
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
    title: "Misty Forest",
  },
  {
    id: "6",
    url: "https://images.unsplash.com/photo-1511497584788-876760111969",
    title: "Waterfall",
  },
  {
    id: "7",
    url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
    title: "Northern Lights",
  },
  {
    id: "8",
    url: "https://images.unsplash.com/photo-1518623489648-a173ef7824f3",
    title: "Enchanted Forest",
  },
  {
    id: "9",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
    title: "Ocean Cliff",
  },
  {
    id: "10",
    url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
    title: "Zen Garden",
  },
  {
    id: "11",
    url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e",
    title: "Cityscape",
  },
  {
    id: "12",
    url: "https://images.unsplash.com/photo-1426604966848-d7adac402bff",
    title: "Desert Dunes",
  },
  {
    id: "13",
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
    title: "Floating Castle",
  },
  {
    id: "14",
    url: "https://images.unsplash.com/photo-1511497584788-876760111969",
    title: "Tropical Beach",
  },
  {
    id: "15",
    url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
    title: "Winter Village",
  },
  {
    id: "16",
    url: "https://images.unsplash.com/photo-1518623489648-a173ef7824f3",
    title: "Sunset Hills",
  },
  {
    id: "17",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
    title: "Canyon View",
  },
  {
    id: "18",
    url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
    title: "Alpine Lake",
  },
  {
    id: "19",
    url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e",
    title: "Autumn Forest",
  },
  {
    id: "20",
    url: "https://images.unsplash.com/photo-1426604966848-d7adac402bff",
    title: "River Valley",
  },
];

export default function ImagePage() {
  const params = useParams();
  const detailImageId = params.id as string;
  const foundImage = mockImages.find((img) => img.id === detailImageId);
  const initialImageData = foundImage || mockImageData;
  const [imageData, setImageData] = useState<ImageData>(initialImageData);
  const [showFullPrompt, setShowFullPrompt] = useState(false);
  const [visibleExploreImages, setVisibleExploreImages] = useState(15);

  const toggleLike = () => {
    setImageData((prev) => ({
      ...prev,
      isLiked: !prev.isLiked,
      likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
    }));
  };

  const loadMoreExplore = () => {
    setVisibleExploreImages((prev) =>
      Math.min(prev + 20, mockExploreImages.length)
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Action Bar */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-border bg-background/80 backdrop-blur-sm"
      >
        <div className="mx-auto max-w-[1920px] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary/50">
                <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
                <span className="hidden sm:inline">Back</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleLike}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-secondary/50 ${
                    imageData.isLiked ? "text-destructive" : "text-foreground"
                  }`}
                >
                  <Heart
                    className="h-4 w-4"
                    strokeWidth={1.5}
                    fill={imageData.isLiked ? "currentColor" : "none"}
                  />
                  <span className="hidden sm:inline">{imageData.likes}</span>
                </button>

                <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary/50">
                  <Download className="h-4 w-4" strokeWidth={1.5} />
                  <span className="hidden sm:inline">Download</span>
                </button>

                <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary/50">
                  <Share2 className="h-4 w-4" strokeWidth={1.5} />
                  <span className="hidden sm:inline">Share</span>
                </button>

                <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary/50">
                  <MoreHorizontal className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>
            </div>

            <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90">
              <Sparkles className="h-4 w-4" strokeWidth={1.5} />
              Generate Similar
            </button>
          </div>
        </div>
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
                  src={imageData.url}
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
                  {imageData.model}
                </p>
              </div>

              {/* Category Tag */}
              <div>
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {imageData.category}
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
                  <p
                    className={`text-sm leading-relaxed text-foreground/80 ${
                      !showFullPrompt ? "line-clamp-3" : ""
                    }`}
                  >
                    {imageData.prompt}
                  </p>
                  {imageData.prompt.length > 150 && (
                    <button
                      onClick={() => setShowFullPrompt(!showFullPrompt)}
                      className="mt-2 flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80"
                    >
                      {showFullPrompt ? "Show less" : "Show more"}
                      <ChevronDown
                        className={`h-3 w-3 transition-transform ${
                          showFullPrompt ? "rotate-180" : ""
                        }`}
                        strokeWidth={1.5}
                      />
                    </button>
                  )}
                </div>
              </div>

              <div className="h-px bg-border" />

              {/* Settings */}
              <div>
                <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <Zap className="h-3.5 w-3.5" strokeWidth={1.5} />
                  Settings
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-border bg-muted/30 p-3">
                    <p className="text-xs text-muted-foreground">Resolution</p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {imageData.settings.resolution}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/30 p-3">
                    <p className="text-xs text-muted-foreground">Quality</p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {imageData.settings.quality}
                    </p>
                  </div>
                  {imageData.settings.steps && (
                    <div className="rounded-lg border border-border bg-muted/30 p-3">
                      <p className="text-xs text-muted-foreground">Steps</p>
                      <p className="mt-1 text-sm font-medium text-foreground">
                        {imageData.settings.steps}
                      </p>
                    </div>
                  )}
                  {imageData.settings.seed && (
                    <div className="rounded-lg border border-border bg-muted/30 p-3">
                      <p className="text-xs text-muted-foreground">Seed</p>
                      <p className="mt-1 text-sm font-medium text-foreground">
                        {imageData.settings.seed}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Related Section - 25% */}
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

          <div className="columns-1 gap-4 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5">
            {mockExploreImages
              .slice(0, visibleExploreImages)
              .map((img, idx) => (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group relative mb-4 break-inside-avoid overflow-hidden rounded-xl"
                >
                  <div className="relative h-64 w-full">
                    <Image
                      src={img.url}
                      alt={img.title}
                      fill
                      className="rounded-xl object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-overlay/0 transition-colors group-hover:bg-overlay/20" />
                </motion.div>
              ))}
          </div>

          {visibleExploreImages < mockExploreImages.length && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={loadMoreExplore}
                className="rounded-lg border border-border bg-card px-6 py-3 text-sm font-medium text-foreground shadow-sm hover:bg-secondary/50"
              >
                Load More Images
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}