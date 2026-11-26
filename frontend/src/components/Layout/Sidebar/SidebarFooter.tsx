"use client";

import { LogOut } from "lucide-react";

interface Props {
  name?: string;
  subtitle?: string;
  onLogout: () => void;
}

export default function SidebarFooter({ name, subtitle, onLogout }: Props) {
  const initial = (name?.trim()?.[0] ?? "U").toUpperCase();

  return (
    <div className="border-t border-dark-tertiary p-3">
      <div className="flex items-center gap-3 rounded-lg bg-dark-primary/60 p-2">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-[#fff]">
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-gray-100">
            {name || "User"}
          </p>
          {subtitle && (
            <p className="truncate text-[11px] capitalize text-gray-500">
              {subtitle}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onLogout}
          suppressHydrationWarning
          title="Logout"
          aria-label="Logout"
          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-status-pending-bg hover:text-status-pending"
        >
          <LogOut size={17} />
        </button>
      </div>
    </div>
  );
}
