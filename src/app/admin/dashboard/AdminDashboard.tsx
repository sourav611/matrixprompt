"use client";

import {
  SparkleIcon,
  UploadCloud,
  X,
  Wand2,
  Layers,
  TrendingUp,
  Calendar,
  Image as ImageIcon,
  BarChart3,
  ImagePlus,
  Tag as TagIcon,
  Plus,
  Star,
  AlertCircle,
} from "lucide-react";
import React, {
  ChangeEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { AnalyticsData } from "@/actions/admin-analytics";
import { validateTagName } from "@/lib/tags-validation";

interface AdminDashboardProps {
  analytics: AnalyticsData;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
  usageCount: number;
}

export default function AdminDashboardPage({ analytics }: AdminDashboardProps) {
  // Form State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [prompt, setPrompt] = useState("");
  const [aiModel, setAiModel] = useState("");
  const [uploading, setUploading] = useState(false);

  // Tagging System State
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isLoadingTags, setIsLoadingTags] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch tags on mount
  useEffect(() => {
    const fetchTags = async () => {
      setIsLoadingTags(true);
      try {
        const res = await fetch("/api/tags");
        if (res.ok) {
          const data = await res.json();
          setAllTags(data);
        } else {
          toast.error("Failed to load tags");
        }
      } catch (error) {
        console.error("Failed to fetch tags", error);
        toast.error("Network error loading tags");
      } finally {
        setIsLoadingTags(false);
      }
    };
    fetchTags();
  }, []);

  // Memoized tag categories for styling logic
  const { popularTags, existingTagNames } = useMemo(() => {
    const popular = new Set(allTags.slice(0, 10).map((t) => t.name));
    const existing = new Set(allTags.map((t) => t.name));
    return { popularTags: popular, existingTagNames: existing };
  }, [allTags]);

  // --- Handlers ---

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
      if (item.type.indexOf("image") !== -1) {
        const file = item.getAsFile();
        if (file) {
          handleFileSelect(file);
          toast.success("Image pasted from clipboard!");
        }
        break;
      }
    }
  };

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Please select a valid image file");
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // --- Tagging Logic ---

  const handleAddTag = (tagName: string) => {
    // Client-side validation
    const error = validateTagName(tagName);
    if (error) {
      toast.error(error);
      return;
    }

    if (selectedTags.includes(tagName)) {
      toast("Tag already added", { icon: "ℹ️" });
      return;
    }

    if (selectedTags.length >= 10) {
      toast.error("Maximum 10 tags allowed");
      return;
    }

    setSelectedTags((prev) => [...prev, tagName]);
    setNewTagInput(""); // Clear input if added via input
    setValidationError(null);
  };

  const handleRemoveTag = (tagName: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tagName));
  };

  const handleNewTagInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNewTagInput(val);

    if (val.trim()) {
      const error = validateTagName(val);
      setValidationError(error);
    } else {
      setValidationError(null);
    }
  };

  const handleNewTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!newTagInput.trim()) return;

      const error = validateTagName(newTagInput);
      if (error) {
        toast.error(error);
        return;
      }

      handleAddTag(newTagInput.trim());
    }
  };

  // --- Upload Submission ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !prompt) {
      toast.error("Please select a file and enter a prompt");
      return;
    }

    if (selectedTags.length === 0) {
      toast.error("Please select at least one tag");
      return;
    }

    setUploading(true);
    const toastId = toast.loading("Initializing upload...");

    try {
      // Step 1: Generate signed URL
      const generateResponse = await fetch("/api/upload/generate-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
          contentType: selectedFile.type,
          prompt,
          aiModel,
          // We still pass a 'category' for backward compatibility if needed,
          // but relying on 'tags' is better. Using the first tag as a fallback category.
          category: selectedTags[0] || "Uncategorized",
          tags: selectedTags,
        }),
      });

      if (!generateResponse.ok) {
        const errorData = await generateResponse.json();
        throw new Error(errorData.error || "Failed to generate upload URL");
      }

      const { timestamp, folder, signature, apiKey, cloudName, recordId } =
        await generateResponse.json();

      // Step 2: Upload to Cloudinary
      toast.loading("Uploading to cloud...", { id: toastId });

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      formData.append("folder", folder);

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        const err = await uploadResponse.json();
        throw new Error(
          err.error?.message || "Failed to upload file to storage"
        );
      }

      const cloudinaryData = await uploadResponse.json();
      const imageUrl = cloudinaryData.secure_url;

      // Step 3: Confirm upload
      toast.loading("Finalizing...", { id: toastId });
      const confirmResponse = await fetch("/api/upload/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recordId, imageUrl }),
      });

      if (!confirmResponse.ok) {
        throw new Error("Failed to confirm upload");
      }

      toast.success("Image published successfully!", { id: toastId });

      // Reset form
      setSelectedFile(null);
      setPreviewUrl("");
      setPrompt("");
      setAiModel("");
      setSelectedTags([]);
      setNewTagInput("");

      // Refresh tags to update counts
      const res = await fetch("/api/tags");
      if (res.ok) {
        const data = await res.json();
        setAllTags(data);
      }
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Upload failed", {
        id: toastId,
      });
    } finally {
      setUploading(false);
    }
  };

  const isUploadDisabled =
    !selectedFile || !prompt || selectedTags.length === 0 || uploading;
  const maxCount = Math.max(...analytics.last7Days.map((d) => d.count), 1);

  return (
    <div
      className="flex-1 overflow-y-auto p-6 space-y-6"
      onPaste={handlePaste}
      tabIndex={0}
    >
      {/* 1. Upload Section */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column: Image Preview & Basic Info */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4 text-sm font-medium text-muted-foreground uppercase tracking-wider">
              <UploadCloud size={16} />
              Media Input
            </div>

            {/* Preview Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`
                    w-full aspect-4/3 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden
                    ${
                      previewUrl
                        ? "border-transparent bg-background shadow-md"
                        : "border-border hover:border-primary/50 hover:bg-accent/50"
                    }
                 `}
            >
              {previewUrl ? (
                <>
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    layout="fill"
                    objectFit="cover"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSelectedFile();
                    }}
                    className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full opacity-0 hover:opacity-100 transition-opacity hover:bg-destructive z-10"
                  >
                    <X size={16} />
                  </button>
                </>
              ) : (
                <div className="text-center p-4">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 text-primary animate-bounce">
                    <ImagePlus size={28} />
                  </div>
                  <p className="text-sm text-foreground font-medium">
                    Click or Drop Image
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Ctrl+V to Paste
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>

            {/* Basic Inputs */}
            <div className="mt-6 space-y-4 flex-1">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <Layers size={14} className="text-blue-500" /> Model Version
                </label>
                <input
                  type="text"
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                  placeholder="e.g. DALL-E 3"
                  className="w-full p-3 text-sm bg-muted/30 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <Wand2 size={14} className="text-purple-500" /> Prompt
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the image in detail..."
                  className="w-full h-32 p-3 text-sm bg-muted/30 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Tagging System */}
        <div className="xl:col-span-8">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                <TagIcon size={16} />
                Tagging System
              </div>
              <div className="text-xs text-muted-foreground">
                {selectedTags.length}/10 Selected
              </div>
            </div>

            <div className="flex-1 space-y-6">
              {/* Section 1: Selected Tags */}
              <div className="min-h-[100px] p-4 rounded-xl bg-muted/20 border border-border/50">
                <label className="text-xs font-semibold text-foreground mb-3 block">
                  Selected Tags ({selectedTags.length})
                </label>

                {selectedTags.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-4 text-muted-foreground/50 text-xs italic">
                    <TagIcon size={24} className="mb-2 opacity-20" />
                    No tags selected yet
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tag) => {
                      const isPopular = popularTags.has(tag);
                      const isExisting = existingTagNames.has(tag);
                      const isNew = !isExisting;

                      let badgeStyle =
                        "bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700";
                      let badgeLabel = null;

                      if (isPopular) {
                        badgeStyle =
                          "bg-green-50 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700";
                        badgeLabel = (
                          <Star size={10} className="fill-current" />
                        );
                      } else if (isNew) {
                        badgeStyle =
                          "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700";
                        badgeLabel = <SparkleIcon size={10} />;
                      }

                      return (
                        <div
                          key={tag}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border shadow-sm animate-in zoom-in duration-200 ${badgeStyle}`}
                        >
                          {badgeLabel}
                          {tag}
                          {isNew && (
                            <span className="text-[9px] font-bold uppercase opacity-75 ml-1">
                              New
                            </span>
                          )}
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5 transition-colors ml-1"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Section 2: Available Tags */}
              <div>
                <label className="text-xs font-semibold text-foreground mb-3 flex items-center gap-2">
                  Available Tags
                  <span className="text-[10px] font-normal text-muted-foreground">
                    (Click to add)
                  </span>
                </label>

                {isLoadingTags ? (
                  <div className="h-24 flex items-center justify-center text-xs text-muted-foreground">
                    Loading tags...
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto p-1">
                    {allTags.map((tag) => {
                      if (selectedTags.includes(tag.name)) return null; // Hide if selected
                      return (
                        <button
                          key={tag.id}
                          onClick={() => handleAddTag(tag.name)}
                          className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-border bg-card/50 hover:border-primary/50 hover:bg-primary/5 transition-all text-muted-foreground hover:text-foreground shadow-sm"
                        >
                          {tag.name}
                          <span className="bg-muted text-[9px] px-1.5 py-0.5 rounded-md group-hover:bg-background transition-colors opacity-70">
                            {tag.usageCount}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Section 3: Create New Tag */}
              <div className="pt-4 border-t border-border">
                <label className="text-xs font-semibold text-foreground mb-2 block">
                  Create New Tag
                </label>
                <div className="flex gap-3 items-start">
                  <div className="flex-1 space-y-1">
                    <div className="relative">
                      <input
                        type="text"
                        value={newTagInput}
                        onChange={handleNewTagInputChange}
                        onKeyDown={handleNewTagKeyDown}
                        placeholder="Type tag name and press Enter"
                        className={`w-full pl-9 pr-4 py-2.5 text-sm bg-muted/30 border rounded-lg outline-none transition-all ${
                          validationError
                            ? "border-destructive/50 focus:ring-2 focus:ring-destructive/20"
                            : "border-border focus:ring-2 focus:ring-primary/20"
                        }`}
                      />
                      <Plus
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      />
                    </div>
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] text-muted-foreground">
                        {newTagInput.length}/30 characters
                      </span>
                      {validationError && (
                        <div className="text-[10px] text-destructive flex items-center gap-1">
                          <AlertCircle size={10} /> {validationError}
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (!newTagInput.trim()) return;
                      const error = validateTagName(newTagInput);
                      if (error) {
                        toast.error(error);
                        return;
                      }
                      handleAddTag(newTagInput.trim());
                    }}
                    disabled={!newTagInput.trim() || !!validationError}
                    className="h-[42px] px-4 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Add
                  </button>
                </div>

                <div className="mt-4 flex gap-4 text-[10px] text-muted-foreground bg-muted/20 p-2 rounded-lg justify-start">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>Popular</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span>Existing</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    <span>New</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div className="mt-6 pt-6 border-t border-border">
              <button
                onClick={handleSubmit}
                disabled={isUploadDisabled}
                className={`
                         w-full py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2
                         ${
                           isUploadDisabled
                             ? "bg-muted text-muted-foreground cursor-not-allowed"
                             : "bg-linear-to-r from-primary to-purple-600 text-white hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.01] active:scale-[0.99]"
                         }
                      `}
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Publishing...
                  </>
                ) : (
                  <>
                    <UploadCloud size={18} />
                    Publish to Gallery
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Analytics Section */}
      <div className="space-y-6 pt-8 border-t border-border">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <BarChart3 size={20} />
          Analytics Overview
        </h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border p-5 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                <ImageIcon size={20} />
              </div>
              <span className="text-xs font-medium bg-blue-500/10 text-blue-500 px-2 py-1 rounded-full">
                Total
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-foreground">
                {analytics.totalImages}
              </p>
              <p className="text-xs text-muted-foreground">
                Total images in gallery
              </p>
            </div>
          </div>

          <div className="bg-card border border-border p-5 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                <TrendingUp size={20} />
              </div>
              <span className="text-xs font-medium bg-green-500/10 text-green-500 px-2 py-1 rounded-full">
                Today
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-foreground">
                {analytics.uploadedToday}
              </p>
              <p className="text-xs text-muted-foreground">
                Uploads in last 24h
              </p>
            </div>
          </div>

          <div className="bg-card border border-border p-5 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                <Calendar size={20} />
              </div>
              <span className="text-xs font-medium bg-purple-500/10 text-purple-500 px-2 py-1 rounded-full">
                Yesterday
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-foreground">
                {analytics.uploadedYesterday}
              </p>
              <p className="text-xs text-muted-foreground">
                Uploads previous day
              </p>
            </div>
          </div>
        </div>

        {/* Activity Chart */}
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-foreground">
              Upload Activity
            </h3>
            <p className="text-xs text-muted-foreground">
              Last 7 days performance
            </p>
          </div>

          <div className="flex items-end gap-2 sm:gap-4 h-48">
            {analytics.last7Days.map((day, i) => {
              const heightPercent =
                maxCount > 0 ? Math.max((day.count / maxCount) * 100, 5) : 5;
              const dateObj = new Date(day.date);
              const label = dateObj.toLocaleDateString("en-US", {
                weekday: "short",
                day: "numeric",
              });

              return (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-2 group"
                >
                  <div className="w-full relative flex items-end justify-center h-full bg-muted/20 rounded-t-lg overflow-hidden">
                    <div
                      className="w-full bg-primary/80 group-hover:bg-primary transition-all duration-500 ease-out rounded-t-md relative"
                      style={{ height: `${heightPercent}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs font-bold py-1 px-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                        {day.count} uploads
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

