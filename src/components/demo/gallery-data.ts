// Types
export interface DemoGalleryImage {
  id: string;
  url: string;
  prompt: string;
  model: string;
  settings: {
    resolution: string;
    quality: string;
    steps: number;
    seed: number;
  };
  category: string;
  likes: number;
  isLiked: boolean;
}

// Mock Data - Manual Image Array
export const mockImages: DemoGalleryImage[] = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
    prompt:
      "A cozy wooden cabin nestled in misty mountains during golden hour, surrounded by pine trees and wildflowers, atmospheric lighting, cinematic composition, highly detailed, photorealistic",
    model: "Midjourney v6",
    settings: {
      resolution: "1024×1024",
      quality: "HD",
      steps: 50,
      seed: 123456789,
    },
    category: "Landscape",
    likes: 342,
    isLiked: false,
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
    prompt:
      "Majestic mountain peaks covered in snow under a starlit sky, dramatic lighting, milky way visible, ultra-detailed terrain, cinematic perspective, award-winning photography",
    model: "DALL-E 3",
    settings: {
      resolution: "1536×1024",
      quality: "Ultra HD",
      steps: 75,
      seed: 987654321,
    },
    category: "Nature",
    likes: 128,
    isLiked: false,
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e",
    prompt:
      "Ancient forest with rays of sunlight filtering through tall trees, volumetric lighting, moss-covered ground, mystical atmosphere, highly detailed foliage, photorealistic render",
    model: "Stable Diffusion XL",
    settings: {
      resolution: "1024×1536",
      quality: "HD",
      steps: 60,
      seed: 456789123,
    },
    category: "Nature",
    likes: 891,
    isLiked: false,
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1426604966848-d7adac402bff",
    prompt:
      "Serene lake reflecting mountains at sunset, perfect mirror reflection, vibrant orange and pink sky, peaceful atmosphere, crystal clear water, cinematic composition, 8k quality",
    model: "Midjourney v6",
    settings: {
      resolution: "1024×1024",
      quality: "Ultra HD",
      steps: 50,
      seed: 741852963,
    },
    category: "Landscape",
    likes: 456,
    isLiked: false,
  },
  {
    id: "5",
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
    prompt:
      "Misty forest path winding through autumn trees, golden leaves falling, atmospheric fog, warm color palette, depth of field, highly detailed, cinematic lighting, photorealistic",
    model: "DALL-E 3",
    settings: {
      resolution: "1024×1024",
      quality: "HD",
      steps: 45,
      seed: 159753486,
    },
    category: "Fantasy",
    likes: 234,
    isLiked: false,
  },
  {
    id: "6",
    url: "https://images.unsplash.com/photo-1511497584788-876760111969",
    prompt:
      "Crystal clear waterfall in tropical rainforest, long exposure effect, lush green vegetation, misty spray, vibrant colors, natural lighting, highly detailed water flow, 4k resolution",
    model: "Stable Diffusion XL",
    settings: {
      resolution: "1024×1536",
      quality: "Ultra HD",
      steps: 65,
      seed: 852963741,
    },
    category: "Nature",
    likes: 567,
    isLiked: false,
  },
  {
    id: "7",
    url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
    prompt:
      "Northern lights dancing over snowy landscape, aurora borealis in green and purple, starry night sky, frozen lake, ethereal glow, cinematic composition, highly detailed, photorealistic",
    model: "Midjourney v6",
    settings: {
      resolution: "1536×1024",
      quality: "HD",
      steps: 55,
      seed: 369258147,
    },
    category: "Landscape",
    likes: 789,
    isLiked: false,
  },
  {
    id: "8",
    url: "https://images.unsplash.com/photo-1518623489648-a173ef7824f3",
    prompt:
      "Enchanted forest with glowing mushrooms and fireflies, bioluminescent plants, magical atmosphere, fantasy landscape, soft ethereal lighting, highly detailed, vibrant colors, dreamlike quality",
    model: "DALL-E 3",
    settings: {
      resolution: "1024×1024",
      quality: "Ultra HD",
      steps: 70,
      seed: 753951486,
    },
    category: "Fantasy",
    likes: 923,
    isLiked: false,
  },
  {
    id: "9",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
    prompt:
      "Dramatic cliff overlooking stormy ocean waves, powerful waves crashing, dark moody sky, dramatic lighting, cinematic perspective, highly detailed water, photorealistic, 8k quality",
    model: "Stable Diffusion XL",
    settings: {
      resolution: "1024×1536",
      quality: "HD",
      steps: 60,
      seed: 147258369,
    },
    category: "Landscape",
    likes: 345,
    isLiked: false,
  },
  {
    id: "10",
    url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
    prompt:
      "Peaceful zen garden with cherry blossoms, Japanese aesthetic, pink petals falling, raked sand patterns, stone lanterns, serene atmosphere, soft natural lighting, highly detailed, photorealistic",
    model: "Midjourney v6",
    settings: {
      resolution: "1024×1024",
      quality: "Ultra HD",
      steps: 50,
      seed: 951753852,
    },
    category: "Nature",
    likes: 456,
    isLiked: false,
  },
  {
    id: "11",
    url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e",
    prompt:
      "Futuristic cityscape with neon lights at night, cyberpunk aesthetic, towering skyscrapers, vibrant neon signs, flying vehicles, rainy streets reflecting lights, cinematic composition, highly detailed",
    model: "DALL-E 3",
    settings: {
      resolution: "1536×1024",
      quality: "HD",
      steps: 65,
      seed: 486159753,
    },
    category: "Sci-Fi",
    likes: 678,
    isLiked: false,
  },
  {
    id: "12",
    url: "https://images.unsplash.com/photo-1426604966848-d7adac402bff",
    prompt:
      "Desert dunes under starry night sky, milky way visible, sand ripples in moonlight, peaceful atmosphere, cool blue tones, cinematic wide angle, highly detailed stars, photorealistic",
    model: "Stable Diffusion XL",
    settings: {
      resolution: "1024×1024",
      quality: "Ultra HD",
      steps: 55,
      seed: 258369147,
    },
    category: "Landscape",
    likes: 234,
    isLiked: false,
  },
  {
    id: "13",
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
    prompt:
      "Mystical castle on floating island in clouds, fantasy architecture, dramatic sky, magical atmosphere, ethereal lighting, waterfalls cascading down, highly detailed stonework, cinematic composition",
    model: "Midjourney v6",
    settings: {
      resolution: "1024×1536",
      quality: "HD",
      steps: 75,
      seed: 654987321,
    },
    category: "Fantasy",
    likes: 890,
    isLiked: false,
  },
  {
    id: "14",
    url: "https://images.unsplash.com/photo-1511497584788-876760111969",
    prompt:
      "Tropical beach with turquoise water and palm trees, white sand, crystal clear ocean, paradise island, sunny day, vibrant colors, natural lighting, highly detailed waves, photorealistic, 4k quality",
    model: "DALL-E 3",
    settings: {
      resolution: "1536×1024",
      quality: "Ultra HD",
      steps: 50,
      seed: 321654987,
    },
    category: "Nature",
    likes: 567,
    isLiked: false,
  },
  {
    id: "15",
    url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
    prompt:
      "Snowy mountain village during winter evening, warm lights in windows, smoke from chimneys, fresh snow, cozy atmosphere, blue hour lighting, highly detailed architecture, cinematic composition, photorealistic",
    model: "Stable Diffusion XL",
    settings: {
      resolution: "1024×1024",
      quality: "HD",
      steps: 60,
      seed: 789456123,
    },
    category: "Landscape",
    likes: 445,
    isLiked: false,
  },
];