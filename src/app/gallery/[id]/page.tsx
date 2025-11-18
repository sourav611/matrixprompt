import { getImageById, getImageStatsById } from "@/lib/gallery-image";
import { notFound } from "next/navigation";
import React from "react";
import ImageDetailClient from "../ImageDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DetailedImagePage({ params }: PageProps) {
  const { id } = await params;

  const [imageData, imageStats] = await Promise.all([
    getImageById(id),
    getImageStatsById(id),
  ]);

  if (!imageData || !imageStats) notFound();
  return (
    <div>
      <ImageDetailClient imagedata={imageData} imageStats={imageStats} />
    </div>
  );
}
