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
            let attempts = 0;
            const hydrateSession = async () => {
                try {
                    const { authAPI } = await import("@/lib/api");
                    const response = await authAPI.getProfile();
                    setAuth(response.data, storedToken);
                } catch (error) {
                    console.error("Failed to re-hydrate user session:", error);
                    const status = (error as { response?: { status?: number } })?.response?.status;
                    if (status === 401 || status === 403 || status === 404) {
                        // The server says this login is not valid any more.
                        localStorage.removeItem("token");
                        logout();
                        router.push("/login");
                    } else if (++attempts < 3) {
                        // Temporary problem (server busy, network): keep the session and retry.
                        setTimeout(hydrateSession, 2000 * attempts);
                    }
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
                <main className="flex-1 overflow-auto p-4">{children}</main>
            </div>
            <DashboardTour showStartButton={true} />
        </div>
    );
}
