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

### 🏷️ Backend Tagging System
Implemented a robust tagging infrastructure to support granular image organization and filtering.

*   **Database Schema (`src/db/schema.ts`):**
    *   **`tags` Table:** Stores unique tags with `id`, `name`, `slug` (indexed), and `createdAt`.
    *   **`imageTags` Table:** A junction table connecting images to tags with a composite primary key (`imageId`, `tagId`) and indexes for efficient querying.
*   **Backend Logic:**
    *   **Tag Utility (`src/lib/tags.ts`):** Created `getOrCreateTag(name)` which handles slug generation ("3D Art" -> "3d-art") and ensures no duplicate tags are created.
    *   **Search Action (`src/actions/tags.ts`):** Implemented `searchTags(query)` to find tags by name, ordered by usage count, useful for autocomplete.
    *   **Transactional Uploads (`src/app/api/upload/generate-url/route.ts`):** Enhanced the image upload flow to accept a `tags` array. It uses a database transaction to create the image record and associate tags simultaneously, ensuring data integrity.
    *   **Data Aggregation (`src/lib/gallery-image.ts`):** Updated `getImages` and `getImageById` to include a `tags` array for each image using `LEFT JOIN` and `array_agg` SQL aggregation.

### 🔄 Category to Tag Migration
Refactored the data model to replace the rigid `category` column with the flexible Tagging System.

*   **Schema Update:** Removed the `category` column from the `gallery_images` table.
*   **Data Migration Script:** Implemented (and executed) a migration script (`src/migrate-categories.ts`) that:
    1.  Iterated through all existing images.
    2.  Converted their legacy `category` string (e.g., "Nature") into a Tag entity.
    3.  Linked the new Tag to the Image in the `image_tags` table.
*   **Frontend Updates:**
    *   **Admin Dashboard:** Removed the Category text input; uploads now rely entirely on the Tagging System.
    *   **Image Details:** Removed the dedicated "Category" display box.
    *   **Gallery Feed:** Updated filtering logic to search against tags instead of the removed category field.
    *   **Management Table:** Removed Category column, replaced with a Tags preview column.

### 📊 Admin Enhancements & Smart Inputs
*   **Analytics-Driven Input:**
    *   **Backend:** Updated `getAdminAnalytics` to aggregate top AI models and their usage counts from the database.
    *   **Frontend:** Enhanced the Admin Dashboard "Model Version" input. It now displays "Recent Models" chips (fetched from analytics) for one-tap selection while retaining manual text entry for new models.

## 3. Design & UX Overhaul (High-End Polish)
Implemented a comprehensive "Pexels-inspired" visual redesign to elevate the application to a premium standard.

### 🖼️ Gallery Page (`GalleryFetchPage.tsx`)
*   **Hero Section:** Implemented a dramatic hero area with a large background image and a **radial gradient overlay** for a spotlight effect.
*   **Jumbo Search:** Replaced standard inputs with a large, pill-shaped "jumbo" search bar (`h-14`) featuring a backdrop blur and trending topic suggestions.
*   **Advanced Tag Filter:** 
    *   Replaced the simple scrollbar with a **smart wrap layout**.
    *   **Logic:** Shows top 15 tags by popularity (image count) initially.
    *   **Interaction:** Added an "Expand/Collapse" toggle to view all tags without clutter.
    *   **Visuals:** Tags act as data-rich chips displaying the image count (e.g., "Nature 5").
*   **Refined Masonry Grid:**
    *   Optimized for large screens (`xl:columns-4`).
    *   **Card Design:** Removed borders for a clean look; added `ring-1` for definition.
    *   **Hover Effects:** "Pexels-style" dark gradient overlay revealing User Info, Download, and Like buttons on hover.

### 🔍 Immersive Image Modal (`ImageDetailClient.tsx`)
*   **Lightbox Aesthetic:** Deepened the background atmosphere with a darker, blurrier stage (`opacity-60 blur-[150px]`).
*   **Split Layout:**
    *   **Left:** Immersive image stage with zero distractions.
    *   **Right:** Clean metadata sidebar with a **sticky header** containing primary actions (Like, Share, Download).
*   **Refined UI:** 
    *   **Prompt Box:** Contained with a custom scrollbar (`max-h-[200px]`).
    *   **Typography:** Professional `uppercase tracking-wide` labels.
    *   **Masonry Suggestions:** "More Like This" section now uses a true masonry layout (`columns-2`) instead of a rigid grid.

### 🧭 Adaptive Navigation (`home-header.tsx`)
*   **Glassmorphism:** Implemented a header that transitions from **Transparent** (over the hero image) to **Solid/Blurred** (on scroll).
*   **Smart Visibility:** The header search bar hides automatically on the home page (to avoid redundancy with the hero search) but appears smoothly upon scrolling or navigating elsewhere.
*   **Upload CTA:** Added a dedicated "Upload" button for quick access to the admin dashboard.
*   **Animation:** Applied smooth "Apple-like" easing (`cubic-bezier`) to all transitions.

### 👤 Premium User Profile (`user-profile.tsx`)
*   **Floating Panel:** Redesigned the dropdown as a detached, floating glass panel with `backdrop-blur-xl`.
*   **Visual Polish:**
    *   **Trigger:** Circular avatar with a subtle interaction ring.
    *   **Header:** Dedicated user info section with a "Pro/Upgrade" banner.
    *   **Actions:** Spacious touch targets with clear icons and consistent hover states.