"use client";

import { GalleryImage, ImageMetadata } from "@/types/image.types";
import Image from "next/image";
import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Copy,
  Download,
  Heart,
  Sparkles,
  Check,
  Command,
  Code,
  FileJson,
  Tag,
  Share2,
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
  const [isCopied, setIsCopied] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(imagedata.prompt);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    window.open(imagedata.imageUrl, "_blank");
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // Add actual API call logic here
  };

  // Robust JSON formatting check
  const { isJson, formattedPrompt } = useMemo(() => {
    try {
      const parsed = JSON.parse(imagedata.prompt);
      return { isJson: true, formattedPrompt: JSON.stringify(parsed, null, 2) };
    } catch (e) {
      return { isJson: false, formattedPrompt: imagedata.prompt };
    }
  }, [imagedata.prompt]);

  const renderHighlightedJson = (jsonString: string) => {
    if (!isJson) return jsonString;

    const tokens = [];
    const regex =
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g;

    let lastIndex = 0;
    let match;

    while ((match = regex.exec(jsonString)) !== null) {
      const [token] = match;
      const index = match.index;

      if (index > lastIndex) {
        tokens.push(
          <span key={`text-${lastIndex}`} className="text-zinc-500">
            {jsonString.slice(lastIndex, index)}
          </span>
        );
      }

      let colorClass = "text-zinc-300";
      if (/^"/.test(token)) {
        if (/:$/.test(token)) {
          colorClass = "text-sky-400 font-semibold";
        } else {
          colorClass = "text-amber-300";
        }
      } else if (/true|false/.test(token)) {
        colorClass = "text-rose-400";
      } else if (/null/.test(token)) {
        colorClass = "text-zinc-400 italic";
      } else if (/^-?\d/.test(token)) {
        colorClass = "text-emerald-400";
      }

      tokens.push(
        <span key={`token-${index}`} className={colorClass}>
          {token}
        </span>
      );

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < jsonString.length) {
      tokens.push(
        <span key={`text-${lastIndex}`} className="text-zinc-500">
          {jsonString.slice(lastIndex)}
        </span>
      );
    }

    return tokens;
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-background text-foreground lg:flex-row">
      {/* LEFT: Image Stage */}
      <div className="relative flex h-[40vh] w-full shrink-0 items-center justify-center overflow-hidden bg-zinc-950 p-4 lg:h-full lg:flex-1 lg:p-8">
        {/* Ambient Background Blur */}
        <div className="absolute inset-0 z-0 opacity-60 blur-[150px] saturate-150">
          <Image
            src={imagedata.imageUrl}
            alt="background blur"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/30 z-0" />

        {/* Main Image Wrapper */}
        <div className="relative z-10 h-full w-full max-w-5xl flex items-center justify-center">
          <Image
            src={imagedata.imageUrl}
            alt={imagedata.prompt}
            fill
            className="object-contain drop-shadow-2xl transition-transform duration-300 ease-out"
            priority
            sizes="(max-width: 1024px) 100vw, 80vw"
          />
        </div>
      </div>

      {/* RIGHT: Information Sidebar */}
      <div className="flex h-full w-full flex-col border-l border-border bg-card lg:w-[480px] xl:w-[520px] shadow-xl z-20">
        
        {/* HEADER: Actions */}
        <div className="flex flex-col gap-4 border-b border-border bg-card/95 p-6 pr-16 backdrop-blur-sm lg:px-8 lg:pr-20 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center justify-between">
             {/* User/Date Info */}
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary ring-4 ring-primary/5">
                  <Sparkles size={20} />
               </div>
               <div>
                 <h2 className="text-sm font-semibold text-foreground">AI GENERATED</h2>
                 <p className="text-xs text-muted-foreground font-medium">
                   {new Date(imagedata.createdAt).toLocaleDateString(undefined, {
                     month: "long",
                     day: "numeric",
                     year: "numeric"
                   })}
                 </p>
               </div>
             </div>

             {/* Primary Actions */}
             <div className="flex items-center gap-3 mr-8 lg:mr-0">
                <button
                  onClick={handleLike}
                  className={`group flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-200 active:scale-90 ${
                    isLiked
                      ? "border-red-200 bg-red-50 text-red-600 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400 shadow-inner"
                      : "border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground hover:shadow-sm"
                  }`}
                  title="Like"
                >
                  <Heart className={`h-5 w-5 transition-transform duration-300 ${isLiked ? "fill-current scale-110" : "group-hover:scale-110"}`} />
                </button>
                <button
                   onClick={() => {/* Share logic */}}
                   className="group flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-all active:scale-95"
                   title="Share"
                >
                   <Share2 className="h-5 w-5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 hover:shadow-lg hover:shadow-primary/20 active:scale-95"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
             </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-8 scrollbar-thin scrollbar-thumb-border lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Tags Section - Prominent */}
            {imagedata.tags && imagedata.tags.length > 0 && (
              <div className="mb-8">
                <div className="flex flex-wrap gap-2">
                  {imagedata.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/?search=${tag}`} // Or toggle tag filter
                      className="inline-flex items-center rounded-full border border-border bg-muted/30 px-3.5 py-1.5 text-xs font-medium text-foreground transition-all hover:bg-muted hover:border-primary/30 hover:text-primary"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Prompt Section */}
            <div className="mb-8">
              <div className="mb-3 flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {isJson ? <Code className="h-3 w-3" /> : <Command className="h-3 w-3" />}
                  Prompt
                </span>
                <button
                  onClick={handleCopyPrompt}
                  className="flex items-center gap-1.5 text-xs font-medium text-primary transition-colors hover:text-primary/80"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-3.5 w-3.5" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" /> Copy
                    </>
                  )}
                </button>
              </div>

              <div
                className={`relative overflow-hidden rounded-xl border border-border ${
                  isJson
                    ? "bg-[#1e1e1e] text-zinc-300 shadow-inner dark:bg-[#0d0d0d]"
                    : "bg-muted/30"
                } transition-colors`}
              >
                <div className="p-5 overflow-x-auto max-h-[200px] scrollbar-thin scrollbar-thumb-border/50 hover:scrollbar-thumb-border">
                  <pre
                    className={`whitespace-pre-wrap font-mono text-xs leading-relaxed ${
                      isJson ? "" : "text-foreground/80"
                    }`}
                  >
                    {isJson
                      ? renderHighlightedJson(formattedPrompt)
                      : formattedPrompt}
                  </pre>
                </div>
              </div>
            </div>

            {/* Specs Grid */}
            <div className="mb-8 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-border p-4 bg-card/50">
                <div className="mb-1 text-[10px] font-medium uppercase text-muted-foreground">Model</div>
                <p className="text-sm font-medium text-foreground">{imagedata.aiModel || "Unknown"}</p>
              </div>
               <div className="rounded-xl border border-border p-4 bg-card/50">
                <div className="mb-1 text-[10px] font-medium uppercase text-muted-foreground">Resolution</div>
                <p className="text-sm font-medium text-foreground">1024 x 1024</p>
              </div>
            </div>

            <div className="mb-8 h-px w-full bg-border" />

            {/* More Like This - Masonry */}
            <div>
              <h3 className="mb-4 text-sm font-bold text-foreground uppercase tracking-wider">
                More Like This
              </h3>
              <div className="columns-2 gap-3 space-y-3">
                {allImages.slice(0, 8).map((image) => (
                  <Link
                    key={image.id}
                    href={`/gallery/${image.id}`}
                    scroll={false}
                    className="block break-inside-avoid"
                  >
                    <div className="group relative w-full rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={image.imageUrl}
                        alt="related"
                        width={400}
                        height={400}
                        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, 20vw"
                      />
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

