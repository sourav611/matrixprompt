import { getImageById, getImageStatsById, getImages } from "@/lib/gallery-image";
import { notFound } from "next/navigation";
import React from "react";
import Modal from "@/components/Modal";
import { GalleryImage } from "@/types/image.types";
import ImageDetailClient from "@/app/(main)/gallery/ImageDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DetailedImagePage({ params }: PageProps) {
  const { id } = await params;

  const [imageData, imageStats, allImages] = await Promise.all([
    getImageById(id),
    getImageStatsById(id),
    getImages(),
  ]);

  if (!imageData || !imageStats) notFound();
  return (
    <Modal>
      <ImageDetailClient
        imagedata={imageData}
        imageStats={imageStats}
        allImages={allImages as GalleryImage[]}
      />
    </Modal>
  );
}
