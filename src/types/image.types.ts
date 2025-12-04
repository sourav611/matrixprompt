export type GalleryImage = {
  id: string;
  imageUrl: string;
  prompt: string;
  aiModel: string | null;
  category: string | null;
  createdAt: Date;
  tags?: string[];
};

export  interface CategoryCard {
  id: string;
  name: string;
  pinCount: number;
  thumbnails: string[];
}

export type ImageMetadata = {
  id: string;
  likeCount: number;
  downloadCount: number;
  promptCopyCount: number;
};