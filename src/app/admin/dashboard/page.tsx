import React from "react";
import AdminDashboardPage from "./AdminDashboard";
import { getAdminAnalytics } from "@/actions/admin-analytics";

// This is a Server Component
export default async function DashboardPage() {
  // Fetch data on the server
  const analytics = await getAdminAnalytics();

  return (
    <div>
      <AdminDashboardPage analytics={analytics} />
    </div>
  );
}