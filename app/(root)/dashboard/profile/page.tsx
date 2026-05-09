"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ProfilePage } from "@/components/dashboard/ProfilePage";
import { useCurrentUser } from "@/lib/getCurrentUser";

export default function ProfileRoute() {
  const { user } = useCurrentUser();
  
  // Use the actual role from the user object, or fallback to the dummy role "Super"
  const role = user?.role || "Super";

  return (
    <DashboardLayout role={role}>
       <ProfilePage />
    </DashboardLayout>
  );
}
