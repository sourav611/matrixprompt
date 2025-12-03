"use server";

import { db } from "@/db";
import { galleryImages } from "@/db/schema";
import { sql, gte, and, lt } from "drizzle-orm";

export interface AnalyticsData {
  totalImages: number;
  uploadedToday: number;
  uploadedYesterday: number;
  last7Days: { date: string; count: number }[];
}

export async function getAdminAnalytics(): Promise<AnalyticsData> {
  // 1. Total Images
  const [totalResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(galleryImages);
  const totalImages = Number(totalResult.count);

  // Date calculations (UTC based for consistency)
  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setUTCHours(0, 0, 0, 0);

  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setUTCDate(startOfYesterday.getUTCDate() - 1);

  // 2. Uploaded Today
  const [todayResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(galleryImages)
    .where(gte(galleryImages.createdAt, startOfToday));
  const uploadedToday = Number(todayResult.count);

  // 3. Uploaded Yesterday
  const [yesterdayResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(galleryImages)
    .where(
      and(
        gte(galleryImages.createdAt, startOfYesterday),
        lt(galleryImages.createdAt, startOfToday)
      )
    );
  const uploadedYesterday = Number(yesterdayResult.count);

  // 4. Last 7 Days (Group by Date)
  // This query might vary depending on Postgres specifics, but a simple way is to fetch last 7 days data and aggregate in JS if volume is low, 
  // or use a proper SQL Group By. For simplicity and robustness with Drizzle/ORM quirks, let's fetch the last 7 days of metadata and reduce in JS.
  // It's unlikely to be millions of rows for this experiment.
  
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 7);
  
  const recentImages = await db
    .select({ createdAt: galleryImages.createdAt })
    .from(galleryImages)
    .where(gte(galleryImages.createdAt, sevenDaysAgo));

  const last7DaysMap = new Map<string, number>();
  
  // Initialize last 7 days with 0
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    const dateStr = d.toISOString().split('T')[0]; // YYYY-MM-DD
    last7DaysMap.set(dateStr, 0);
  }

  recentImages.forEach(img => {
    const dateStr = img.createdAt.toISOString().split('T')[0];
    if (last7DaysMap.has(dateStr)) {
      last7DaysMap.set(dateStr, last7DaysMap.get(dateStr)! + 1);
    }
  });

  const last7Days = Array.from(last7DaysMap.entries())
    .map(([date, count]) => ({ date, count }))
    .reverse(); // Oldest first

  return {
    totalImages,
    uploadedToday,
    uploadedYesterday,
    last7Days,
  };
}
