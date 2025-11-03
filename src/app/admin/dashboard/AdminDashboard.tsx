"use client";
import { ModeToggle } from "@/components/theme/mode-toggle";
import {
  ImagePlus,
  LayoutDashboard,
  LogOutIcon,
  Settings,
  SparkleIcon,
  UploadIcon,
  XIcon,
} from "lucide-react";
import React, { ChangeEvent, useRef, useState } from "react";

export default function AdminDashboardPage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false); //hover effect
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [prompt, setPrompt] = useState("");
  const [aiModel, setAiModel] = useState("");
  const [category, setCategory] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !prompt) {
      setError("Please select a file and enter related prompt");
      return;
    }
    setUploading(true);
    setError("");
    setSuccess(false);

    try {
      //step 1 - generate signed url
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
      const { uploadUrl, filePath, recordId } = await generateResponse.json();

      //step 2 - upload directly to supabase storage
      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: selectedFile,
        headers: {
          "Content-Type": selectedFile.type,
        },
      });
      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file to storage");
      }

      //step 3  - confirm upload and update database
      const confirmResponse = await fetch("/api/upload/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recordId, filePath }),
      });
      if (!confirmResponse.ok) {
        throw new Error("Failed to confirm upload");
      }
      setSuccess(true);
      //reset after success upload
      setSelectedFile(null);
      setPreviewUrl("");
      setPrompt("");
      setAiModel("");
      setCategory("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
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
    }
  };

  // file input and upload in client
  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };
  // remove selected file
  const removeSelectedFile = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // disable button when there are not required fields filled
  const isUploadDisabled = !selectedFile || !prompt || !category || uploading;
  return (
    <div className="min-h-screen bg-background flex">
      {/* compact Sidebar */}
      <aside
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
        className={`fixed lg:static inset-y-0 left-0 z-50 ${
          sidebarExpanded ? "w-60" : "w-16"
        } bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out`}
      >
        <div className="h-full flex flex-col">
          {/* logo and theme button */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
            <div className="flex items-center gap-3 min-w-0">
              <SparkleIcon size={16} />
              {sidebarExpanded && (
                <div className="overflow-hidden">
                  <h2 className="text-sm font-semibold text-sidebar-foreground truncate">
                    ArtesiaFlow
                  </h2>
                  <p className="text-[10px] text-muted-foreground truncate">
                    Admin Panel
                  </p>
                </div>
              )}
            </div>
            {sidebarExpanded && (
              <div className="shrink-0">
                <ModeToggle />
              </div>
            )}
          </div>
          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-sidebar-primary-foreground  rounded-lg transition-colors">
              <LayoutDashboard size={18} className="shrink-0" />
              {sidebarExpanded && <span>Dashboard</span>}
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-sidebar-foreground rounded-lg transition-colors">
              <ImagePlus size={18} className="shrink-0" />
              {sidebarExpanded && <span>Gallery</span>}
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-sidebar-foreground  rounded-lg transition-colors">
              <Settings size={18} className="shrink-0" />
              {sidebarExpanded && <span>Settings</span>}
            </button>
          </nav>

          {/* Logout */}
          <div className="p-3 border-t border-sidebar-border">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
              <LogOutIcon size={18} className="shrink-0" />
              {sidebarExpanded && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/*-------------------------------------- Main content------------------------- */}
      <div className="flex-1 flex flex-col ">
        {/* Header */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between">
          <div className="p-2">
            <h2 className="text-lg font-semibold text-foreground">
              Quick Header
            </h2>
          </div>
        </header>
        {/* main content area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl">
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-card p-6 rounded-lg"
            >
              {/* image file input */}
              <div className="lg:col-span-4">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative h-48 border-2 border-dashed border-border  rounded-lg cursor-pointer flex items-center justify-center "
                >
                  {previewUrl ? (
                    <div className="relative w-full h-full">
                      <img
                        src={previewUrl}
                        alt="Preview image"
                        className="w-full h-full object-cover rounded-sm"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSelectedFile();
                        }}
                        className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 hover:bg-destructive/90 transition-colors shadow-lg"
                      >
                        <XIcon size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center px-4">
                      <UploadIcon
                        size={32}
                        className="mx-auto text-muted-foreground mb-2"
                      />
                      <p className="text-sm font-medium text-foreground mb-0.5">
                        Drop or click
                      </p>
                      <p className="text-xs text-muted-foreground">
                        JPG, PNG, GIF (Max 10MB)
                      </p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden "
                    disabled={uploading}
                  />
                </div>
              </div>
              {/*-------------------- Form input fields ------------ */}
              <div className="lg:col-span-8 space-y-4">
                {/* prompt info input */}
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    Prompt <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-input border border-border rounded-sm focus:ring-1 focus:ring-ring focus:border-transparent outline-none transition-all resize-none text-foreground placeholder:text-muted-foreground"
                    disabled={uploading}
                    required
                    placeholder="Enter the prompt related to the image or used to generate the image"
                  />
                </div>
                <div className="  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
                  {/* ai model input */}
                  <div className="lg:col-span-3">
                    <label className="block text-xs font-medium text-foreground mb-1.5 ">
                      AI Model <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      value={aiModel}
                      onChange={(e) => setAiModel(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-input border border-border rounded-sm focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-all text-foreground placeholder:text-muted-foreground"
                      disabled={uploading}
                      placeholder="e.g., DALL-E, Midjourney etc"
                    />
                  </div>
                  {/* category input */}
                  <div className="lg:col-span-2">
                    <label className="block text-xs font-medium text-foreground mb-1.5">
                      Category <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-input border border-border rounded-sm focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-all text-foreground placeholder:text-muted-foreground"
                      disabled={uploading}
                      placeholder="e.g,. Nature , Abstract"
                    />
                  </div>
                  {error && (
                    <div className="text-destructive text-sm">{error}</div>
                  )}
                  {success && (
                    <div className="text-success text-sm">
                      Upload successful
                    </div>
                  )}
                  {/* submit button */}
                  <button
                    type="submit"
                    disabled={isUploadDisabled}
                    className={`w-full py-2 rounded-sm lg:col-span-2 font-medium text-sm transition-all ${
                      isUploadDisabled
                        ? "bg-muted text-muted-foreground cursor-not-allowed"
                        : "bg-primary text-primary-foreground hover:bg-primary/90  shadow-sm"
                    }`}
                  >
                    {uploading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                        Uploading
                      </span>
                    ) : (
                      "Upload"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
