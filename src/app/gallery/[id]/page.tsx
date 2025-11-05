import { getImageById } from '@/lib/gallery-image';
import { notFound } from 'next/navigation';
import React from 'react'
import ImageDetailClient from '../ImageDetailClient';

interface PageProps {
  params: Promise<{id: string}>;
}

export default async function DetailedImagePage({params}:PageProps) {
  const {id} = await params;
  const image = await getImageById(id)

  if(!image) notFound();
  return (
    <div>
      <ImageDetailClient imagedata={image}/>
    </div>
  )
}
