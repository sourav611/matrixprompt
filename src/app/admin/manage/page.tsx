import React from "react";
import { getAllImagesForAdmin } from "@/actions/admin-manage";
import ManageImagesClient from "./ManageImagesClient";

export const dynamic = "force-dynamic"; // Ensure fresh data on every load

export default async function ManageContentAdmin() {
  const images = await getAllImagesForAdmin();

  return <ManageImagesClient initialImages={images} />;
}
