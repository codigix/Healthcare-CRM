"use client";

import { ReactNode, useEffect } from "react";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import DashboardTour from "@/components/DashboardTour";

export default function DashboardLayout({ children }: { children: ReactNode }) {
 const router = useRouter();
 const { user, token, setAuth, logout } = useAuthStore();

 useEffect(() => {
 const storedToken = localStorage.getItem("token");
 if (!token && !storedToken) {
 router.push("/login");
 return;
 }

 // Hydrate user session if token exists but user profile is null (e.g., on page refresh)
 if (storedToken && !user) {
 const hydrateSession = async () => {
 try {
 const { authAPI } = await import("@/lib/api");
 const response = await authAPI.getProfile();
 setAuth(response.data, storedToken);
 } catch (error) {
 console.error("Failed to re-hydrate user session:", error);
 localStorage.removeItem("token");
 logout();
 router.push("/login");
 }
 };
 hydrateSession();
 }
 }, [token, user, setAuth, logout, router]);

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
