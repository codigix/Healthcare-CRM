"use client";

import { usePathname, useSearchParams } from "next/navigation";
import DashboardLayout from "./DashboardLayout";
import React, { useEffect, Suspense } from "react";
import { useUIStore } from "@/lib/store";

function NavigationEvents() {
 const pathname = usePathname();
 const searchParams = useSearchParams();
 const setIsNavigating = useUIStore((state) => state.setIsNavigating);

 useEffect(() => {
 setIsNavigating(false);
 }, [pathname, searchParams, setIsNavigating]);

 return null;
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
 const pathname = usePathname();
 const isNavigating = useUIStore((state) => state.isNavigating);
 const setIsNavigating = useUIStore((state) => state.setIsNavigating);

 // Safety net: never leave the page stuck on the loading screen
 // (failed or interrupted navigation, same-page link click, etc.).
 useEffect(() => {
 if (!isNavigating) return;
 // Long enough for a first-time page compile in dev (observed up to ~20 s).
 const timer = setTimeout(() => setIsNavigating(false), 30000);
 return () => clearTimeout(timer);
 }, [isNavigating, setIsNavigating]);

 // Do not wrap the login page or the base redirecting page in the DashboardLayout
 if (pathname === '/login' || pathname === '/') {
 return <>{children}</>;
 }

 return (
 <>
 <Suspense fallback={null}>
 <NavigationEvents />
 </Suspense>
 {isNavigating && (
 <div className="fixed top-0 left-0 right-0 h-1 z-[100] bg-dark-secondary overflow-hidden">
 <div className="h-full w-1/3 bg-emerald-500 transition-all duration-300 animate-[pulse_1s_ease-in-out_infinite] rounded-r-full" />
 </div>
 )}
 {/* The current page stays on screen while the next one loads (top progress bar +
 sidebar spinner show the click was received); the next page then appears with
 its real UI immediately. Only data regions inside pages show placeholders. */}
 <DashboardLayout>{children}</DashboardLayout>
 </>
 );
}
