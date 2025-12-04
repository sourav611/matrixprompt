"use client";

import { GalleryImage, ImageMetadata } from "@/types/image.types";
import Image from "next/image";
import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Copy,
  Download,
  Heart,
  Share2,
  Sparkles,
  Layers,
  Maximize2,
  Check,
  Command,
  Code,
  FileJson,
  Tag,
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

      // Add non-token text (whitespace, brackets, commas)
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
          // Key (remove quote and colon for styling if desired, but keeping simple for now)
          colorClass = "text-sky-400 font-semibold";
        } else {
          // String value
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
      <div className="relative flex h-[40vh] w-full shrink-0 items-center justify-center overflow-hidden bg-zinc-950 p-4 lg:h-full lg:flex-1 lg:p-10">
        {/* Ambient Background Blur */}
        <div className="absolute inset-0 z-0 opacity-30 blur-[100px] saturate-150">
          <Image
            src={imagedata.imageUrl}
            alt="background blur"
            fill
            className="object-cover"
          />
        </div>

        {/* Main Image Wrapper */}
        <div className="relative z-10 h-full w-full">
          <Image
            src={imagedata.imageUrl}
            alt={imagedata.prompt}
            fill
            className="object-contain drop-shadow-2xl transition-transform duration-300 ease-out hover:scale-[1.02]"
            priority
            sizes="(max-width: 1024px) 100vw, 75vw"
          />
        </div>
      </div>

      {/* RIGHT: Information Sidebar */}
      <div className="flex h-full w-full flex-col border-l border-border bg-card lg:w-[500px] xl:w-[550px]">
        {/* HEADER: Actions & Title */}
        <div className="flex flex-col gap-4 border-b border-border bg-card/95 p-6 pr-16 backdrop-blur-sm lg:px-8 lg:pr-20">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                {isJson ? (
                  <FileJson className="h-5 w-5" />
                ) : (
                  <Sparkles className="h-5 w-5" />
                )}
              </div>
              <div>
                <h2 className="text-base font-semibold leading-tight">
                  {isJson ? "Structured Generation" : "Creative Generation"}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {new Date(imagedata.createdAt).toLocaleDateString(undefined, {
                    dateStyle: "medium",
                  })}
                </p>
              </div>
            </div>
            {/* Primary Actions */}
            <div className="flex items-center gap-2 mr-8 lg:mr-0">
              <button
                onClick={handleLike}
                className={`group flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all hover:shadow-sm ${
                  isLiked
                    ? "border-red-200 bg-red-50 text-red-600 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400"
                    : "border-border bg-background hover:bg-muted text-foreground"
                }`}
              >
                <Heart
                  className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`}
                />
                <span>{imageStats.likeCount + (isLiked ? 1 : 0)}</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-all hover:opacity-90"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Download</span>
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
            {/* Prompt Section */}
            <div className="mb-8">
              <div className="mb-3 flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {isJson ? <Code className="h-3 w-3" /> : null}
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
                {isJson && (
                  <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 bg-white/5">
                    <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
                      JSON Preview
                    </span>
                  </div>
                )}
                <div className="p-5 overflow-x-auto">
                  <pre
                    className={`whitespace-pre-wrap font-mono text-xs leading-relaxed ${
                      isJson ? "" : "text-foreground/90"
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
              <div className="rounded-xl border border-border p-4">
                <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                  <Command className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase">Model</span>
                </div>
                <p className="font-medium text-foreground">
                  {imagedata.aiModel}
                </p>
              </div>
              <div className="rounded-xl border border-border p-4">
                <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                  <Layers className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase">
                    Category
                  </span>
                </div>
                <p className="font-medium text-foreground">
                  {imagedata.category}
                </p>
              </div>
            </div>

            {/* Tags Section */}
            {imagedata.tags && imagedata.tags.length > 0 && (
              <div className="mb-8">
                <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <Tag className="h-3 w-3" />
                  <span>Tags</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {imagedata.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-8 h-px w-full bg-border" />

            {/* More Posts */}
            <div>
              <h3 className="mb-4 text-sm font-semibold text-foreground">
                More Like This
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {allImages.slice(0, 6).map((image) => (
                  <Link
                    key={image.id}
                    href={`/gallery/${image.id}`}
                    scroll={false}
                  >
                    <div className="group relative aspect-square overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={image.imageUrl}
                        alt="related"
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 50vw, 20vw"
                      />
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

