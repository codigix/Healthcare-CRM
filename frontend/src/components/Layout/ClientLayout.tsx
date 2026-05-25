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
      <DashboardLayout>
        {isNavigating ? (
          <div className="flex flex-col items-center justify-center h-full w-full min-h-[50vh] text-gray-400 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            <p className="text-lg font-medium animate-pulse">Loading data...</p>
          </div>
        ) : (
          children
        )}
      </DashboardLayout>
    </>
  );
}
