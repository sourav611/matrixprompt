import type { Metadata } from "next";
import { getUser } from "@/utils/supabase/server";
import HomeHeader from "@/components/home/home-header";

export const metadata: Metadata = {
  title: "ArtesiaFlow.com",
  description: "AI generated images with prompts",
};

export default async function MainLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  const user = await getUser();
  return (
    <>
      <HomeHeader user={user} />
      {children}
      {modal}
    </>
  );
}
