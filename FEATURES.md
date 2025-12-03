# Project: ArtesiaFlow (SlopDrift)

## 1. Existing Features

### Core Functionality
- **AI Image Gallery:** A public-facing masonry grid displaying AI-generated artwork.
- **User Authentication:** Secure login system powered by Supabase Auth.
- **Interaction System:**
    - **Likes:** Authenticated users can like/unlike images (persisted in `post_likes` table).
    - **Statistics:** Tracks likes, downloads, and prompt copy counts (`post_stats` table).
    - **Copy Prompt:** One-click ability to copy the generation prompt.

### Admin Dashboard
- **Protected Route:** `/admin` requires specific authentication.
- **Image Management:** 
    - **Upload System:** Functionality to upload new images (`image-upload-form.tsx`).
    - **Metadata Entry:** Admins can input Prompts, AI Models (DALL-E 3, Midjourney, etc.), Categories, and settings (Seed, Resolution).
    - **Dashboard View:** A dedicated view to manage the gallery content.

### Technical Architecture
- **Framework:** Next.js 15 (App Router).
- **Database:** PostgreSQL managed via Drizzle ORM.
- **Styling:** Tailwind CSS with Framer Motion animations.
- **State Management:** React Server Components + Client Components.

---

## 2. Recently Added Features (Current Session)

### 🚀 Modal Architecture Overhaul
Transformed the image detail viewing experience from a separate page to a high-performance overlay.

*   **Route Interception:** implemented `src/app/@modal/(.)gallery/[id]` to intercept navigation to image details.
    *   *Behavior:* Clicking an image opens a modal while keeping the home page in the background. Refreshing the page or visiting the link directly still renders the full `src/app/gallery/[id]` page.
*   **Custom Modal Component:**
    *   Created `src/components/Modal.tsx`.
    *   **Dimensions:** Fixed to `85vh` height and `calc(85vw - 60px)` width for a "floating card" aesthetic.
    *   **Animation:** Smooth scale/fade entry (0.2s duration) using `framer-motion`.
    *   **UX:** Backdrop blur and click-outside-to-close functionality.

### 🎨 Image Detail Layout Redesign
Completely restructured `ImageDetailClient.tsx` to fit the new modal context.

*   **Split Layout (Top Section):**
    *   **Left (60%):** Large, contained image display.
    *   **Right (40%):** Scrollable metadata panel (Prompt, Model, Category, Stats).
*   **"More Posts" Section (Bottom Section):**
    *   Integrated a related posts section directly into the modal.
    *   **Design:** Converted from a horizontal slider to a **Vertically Scrollable Masonry Grid**.
    *   **Data Fetching:** Updated `DetailedImagePage` to fetch `allImages` and pass them down for this section.

### 🛠️ Codebase Refactoring & Fixes
*   **Centralized Logic:** Moved `getImages` fetching logic to `src/lib/gallery-image.ts` to be shared between the Home page and the Modal.
*   **Cleanup:** Deleted the obsolete `src/app/image` directory.
*   **Bug Fixes:**
    *   Resolved a "unique key prop" warning in `GalleryFetchPage`.
    *   Fixed a crash in the standalone detail page where `allImages` was undefined.