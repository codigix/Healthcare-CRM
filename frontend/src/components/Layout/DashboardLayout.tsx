"use client";

import { ReactNode, useEffect } from "react";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import DashboardTour from "@/components/DashboardTour";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, token } = useAuthStore();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!token && !storedToken) {
      router.push("/login");
    }
  }, [token, router]);

  if (
    !token &&
    typeof window !== "undefined" &&
    !localStorage.getItem("token")
  ) {
    return null;
  }

  return (
    <div className="flex h-screen bg-dark-primary">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
      <DashboardTour showStartButton={true} />
    </div>
  );
}
