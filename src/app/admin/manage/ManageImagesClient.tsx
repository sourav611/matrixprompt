"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Trash2, Search, AlertCircle, Loader2, ImageOff } from "lucide-react";
import { AdminGalleryImage, deleteImage } from "@/actions/admin-manage";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

interface ManageImagesClientProps {
  initialImages: AdminGalleryImage[];
}

export default function ManageImagesClient({ initialImages }: ManageImagesClientProps) {
  const [images, setImages] = useState(initialImages);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredImages = images.filter((img) =>
    img.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (img.aiModel && img.aiModel.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (img.category && img.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm("Are you sure you want to delete this image? This action cannot be undone.")) return;

    setDeletingId(id);
    try {
      const result = await deleteImage(id, imageUrl);
      if (result.success) {
        setImages((prev) => prev.filter((img) => img.id !== id));
        toast.success("Image deleted successfully");
      } else {
        toast.error(result.error || "Failed to delete image");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while deleting");
    } finally {
      setDeletingId(null);
    }
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-sm">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Content Management</h1>
            <p className="text-sm text-muted-foreground">Manage and moderate gallery images</p>
        </div>
        
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder="Search by prompt, model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-border bg-muted/30 focus:bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/40 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold text-muted-foreground w-[80px]">Preview</th>
                <th className="px-6 py-4 font-semibold text-muted-foreground">Prompt</th>
                <th className="px-6 py-4 font-semibold text-muted-foreground w-[150px]">Model</th>
                <th className="px-6 py-4 font-semibold text-muted-foreground w-[150px]">Category</th>
                <th className="px-6 py-4 font-semibold text-muted-foreground w-[150px]">Date</th>
                <th className="px-6 py-4 font-semibold text-muted-foreground text-right w-[100px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <AnimatePresence>
                {filteredImages.length === 0 ? (
                    <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                            <div className="flex flex-col items-center gap-2">
                                <AlertCircle className="h-8 w-8 opacity-20" />
                                <p>No images found matching your search.</p>
                            </div>
                        </td>
                    </tr>
                ) : (
                    filteredImages.map((image) => (
                        <motion.tr 
                            key={image.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, height: 0 }}
                            className="group hover:bg-muted/30 transition-colors"
                        >
                        <td className="px-6 py-3">
                            <div className="relative h-[50px] w-[50px] rounded-lg overflow-hidden border border-border shadow-sm bg-muted flex items-center justify-center">
                                {image.imageUrl && isValidUrl(image.imageUrl) ? (
                                  <Image
                                      src={image.imageUrl}
                                      alt="Thumbnail"
                                      fill
                                      className="object-cover"
                                      sizes="50px"
                                  />
                                ) : (
                                  <ImageOff className="h-5 w-5 text-muted-foreground/50" />
                                )}
                            </div>
                        </td>
                        <td className="px-6 py-3">
                            <div className="max-w-[300px] truncate font-medium text-foreground" title={image.prompt}>
                                {image.prompt}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1.5">
                                {image.tags.slice(0, 3).map(tag => (
                                    <span key={tag} className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-md border border-primary/10">
                                        #{tag}
                                    </span>
                                ))}
                                {image.tags.length > 3 && (
                                    <span className="text-[10px] text-muted-foreground px-1.5 py-0.5">+{image.tags.length - 3}</span>
                                )}
                            </div>
                        </td>
                        <td className="px-6 py-3">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                                {image.aiModel || "Unknown"}
                            </span>
                        </td>
                        <td className="px-6 py-3 text-muted-foreground">
                            {image.category || "—"}
                        </td>
                        <td className="px-6 py-3 text-muted-foreground text-xs" suppressHydrationWarning>
                            {new Date(image.createdAt).toLocaleDateString("en-US")}
                        </td>
                        <td className="px-6 py-3 text-right">
                            <button
                                onClick={() => handleDelete(image.id, image.imageUrl)}
                                disabled={deletingId === image.id}
                                className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Delete Image"
                            >
                                {deletingId === image.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Trash2 className="h-4 w-4" />
                                )}
                            </button>
                        </td>
                        </motion.tr>
                    ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        <div className="bg-muted/20 border-t border-border px-6 py-3 text-xs text-muted-foreground flex justify-between items-center">
            <span>Showing {filteredImages.length} of {images.length} images</span>
        </div>
      </div>
    </div>
  );
}
