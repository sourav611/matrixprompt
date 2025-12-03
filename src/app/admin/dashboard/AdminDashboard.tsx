"use client";
import { ModeToggle } from "@/components/theme/mode-toggle";
import {
  LayoutDashboard,
  LogOutIcon,
  Settings,
  SparkleIcon,
  UploadCloud,
  X,
  FileImage,
  Command,
  Wand2,
  Layers,
  TrendingUp,
  Calendar,
  Image as ImageIcon,
  BarChart3,
  ImagePlus, // Explicitly imported ImagePlus
} from "lucide-react";
import React, { ChangeEvent, useRef, useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { AnalyticsData } from "@/actions/admin-analytics";

interface AdminDashboardProps {
  analytics: AnalyticsData;
}

export default function AdminDashboardPage({ analytics }: AdminDashboardProps) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [prompt, setPrompt] = useState("");
  const [aiModel, setAiModel] = useState("");
  const [category, setCategory] = useState("");
  const [uploading, setUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !prompt) {
      toast.error("Please select a file and enter a prompt");
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
          category,
        }),
      });

      if (!generateResponse.ok) {
        const errorData = await generateResponse.json();
        throw new Error(errorData.error || "Failed to generate upload URL");
      }
      
      const { timestamp, folder, signature, apiKey, cloudName, recordId } = await generateResponse.json();

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
        throw new Error(err.error?.message || "Failed to upload file to storage");
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
      setCategory("");
      
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Upload failed", { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const isUploadDisabled = !selectedFile || !prompt || !category || uploading;

  // Calculate max count for simple bar chart scaling
  const maxCount = Math.max(...analytics.last7Days.map(d => d.count), 1);

  return (
    <div className="min-h-screen bg-background flex overflow-hidden font-sans">
      {/* Sidebar */}
      <aside
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
        className={`fixed lg:static inset-y-0 left-0 z-50 ${
          sidebarExpanded ? "w-64" : "w-20"
        } bg-card border-r border-border transition-all duration-300 ease-in-out flex flex-col`}
      >
        <div className="h-16 flex items-center justify-center border-b border-border">
           <div className="flex items-center gap-3">
              <SparkleIcon className="text-primary" size={24} />
              {sidebarExpanded && (
                  <span className="text-lg font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Artesia
                  </span>
              )}
           </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {[
            { icon: LayoutDashboard, label: "Dashboard", active: true },
            { icon: ImagePlus, label: "Gallery", active: false },
            { icon: Settings, label: "Settings", active: false },
          ].map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200 ${
                item.active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <item.icon size={20} />
              {sidebarExpanded && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <button className="w-full flex items-center gap-4 p-3 text-destructive hover:bg-destructive/10 rounded-xl transition-all">
            <LogOutIcon size={20} />
            {sidebarExpanded && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between px-8 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
             <ModeToggle />
             <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/50" />
          </div>
        </header>

        <div 
          className="flex-1 overflow-y-auto p-6 space-y-6"
          onPaste={handlePaste}
          tabIndex={0}
        >
          {/* 1. Upload Section (Compact Card) */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
             <div className="flex items-center gap-2 mb-4 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                <UploadCloud size={16} />
                Quick Upload Studio
             </div>
             
             <div className="flex flex-col lg:flex-row gap-8">
                {/* Small Preview Card */}
                <div className="shrink-0">
                   <div 
                     onClick={() => fileInputRef.current?.click()}
                     className={`
                        w-full lg:w-64 aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all
                        ${previewUrl ? "border-transparent bg-background shadow-md" : "border-border hover:border-primary/50 hover:bg-accent/50"}
                     `}
                   >
                      {previewUrl ? (
                        <div className="relative w-full h-full rounded-xl overflow-hidden group">
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
                              className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                            >
                              <X size={16} />
                            </button>
                        </div>
                      ) : (
                        <div className="text-center p-4">
                           <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 text-primary">
                             <ImagePlus size={24} />
                           </div>
                           <p className="text-xs text-muted-foreground font-medium">Click or Drop Image</p>
                           <p className="text-[10px] text-muted-foreground/60 mt-1">Ctrl+V to Paste</p>
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
                </div>

                {/* Form Inputs */}
                <div className="flex-1 space-y-4">
                   <div className="space-y-1.5">
                      <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                         <Wand2 size={14} className="text-purple-500" /> Prompt
                      </label>
                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe the image..."
                        className="w-full h-24 p-3 text-sm bg-muted/30 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                      />
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                          <Layers size={14} className="text-blue-500" /> Model
                        </label>
                        <input
                          type="text"
                          value={aiModel}
                          onChange={(e) => setAiModel(e.target.value)}
                          placeholder="e.g. DALL-E 3"
                          className="w-full p-2.5 text-sm bg-muted/30 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                          <FileImage size={14} className="text-green-500" /> Category
                        </label>
                        <input
                          type="text"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          placeholder="e.g. Sci-Fi"
                          className="w-full p-2.5 text-sm bg-muted/30 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                      </div>
                   </div>

                   <div className="pt-2">
                      <button
                        onClick={handleSubmit}
                        disabled={isUploadDisabled}
                        className={`
                          w-full py-3 rounded-lg font-semibold text-sm transition-all
                          ${isUploadDisabled
                            ? "bg-muted text-muted-foreground cursor-not-allowed"
                            : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
                          }
                        `}
                      >
                        {uploading ? "Publishing..." : "Publish Image"}
                      </button>
                   </div>
                </div>
             </div>
          </div>

          {/* 2. Analytics Section (Below Upload) */}
          <div className="space-y-6">
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
                      <span className="text-xs font-medium bg-blue-500/10 text-blue-500 px-2 py-1 rounded-full">Total</span>
                   </div>
                   <div className="space-y-1">
                      <p className="text-3xl font-bold text-foreground">{analytics.totalImages}</p>
                      <p className="text-xs text-muted-foreground">Total images in gallery</p>
                   </div>
                </div>

                <div className="bg-card border border-border p-5 rounded-2xl shadow-sm">
                   <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                         <TrendingUp size={20} />
                      </div>
                      <span className="text-xs font-medium bg-green-500/10 text-green-500 px-2 py-1 rounded-full">Today</span>
                   </div>
                   <div className="space-y-1">
                      <p className="text-3xl font-bold text-foreground">{analytics.uploadedToday}</p>
                      <p className="text-xs text-muted-foreground">Uploads in last 24h</p>
                   </div>
                </div>

                <div className="bg-card border border-border p-5 rounded-2xl shadow-sm">
                   <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                         <Calendar size={20} />
                      </div>
                      <span className="text-xs font-medium bg-purple-500/10 text-purple-500 px-2 py-1 rounded-full">Yesterday</span>
                   </div>
                   <div className="space-y-1">
                      <p className="text-3xl font-bold text-foreground">{analytics.uploadedYesterday}</p>
                      <p className="text-xs text-muted-foreground">Uploads previous day</p>
                   </div>
                </div>
             </div>

             {/* Activity Chart (CSS Bar Chart) */}
             <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
                <div className="mb-6">
                   <h3 className="text-sm font-medium text-foreground">Upload Activity</h3>
                   <p className="text-xs text-muted-foreground">Last 7 days performance</p>
                </div>
                
                <div className="flex items-end gap-2 sm:gap-4 h-48">
                   {analytics.last7Days.map((day, i) => {
                      // Calculate height percentage (min 5% for visibility)
                      const heightPercent = maxCount > 0 ? Math.max((day.count / maxCount) * 100, 5) : 5;
                      // Format date to simple "Mon 01" or "01/01"
                      const dateObj = new Date(day.date);
                      const label = dateObj.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
                      
                      return (
                         <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                            <div className="w-full relative flex items-end justify-center h-full bg-muted/20 rounded-t-lg overflow-hidden">
                               <div 
                                 className="w-full bg-primary/80 group-hover:bg-primary transition-all duration-500 ease-out rounded-t-md relative"
                                 style={{ height: `${heightPercent}%` }}
                               >
                                  {/* Tooltip */}
                                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs font-bold py-1 px-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                     {day.count} uploads
                                  </div>
                               </div>
                            </div>
                            <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">{label}</span>
                         </div>
                      );
                   })}
                </div>
             </div>
          </div>

        </div>
      </main>
    </div>
  );
}