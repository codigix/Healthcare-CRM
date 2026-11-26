"use client";

import { Search, X } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SidebarSearch({ value, onChange }: Props) {
  return (
    <div className="relative px-2 pb-2 pt-2">
      <Search
        size={15}
        className="pointer-events-none absolute left-5 top-1/2 -translate-y-[40%] text-gray-500"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Escape" && onChange("")}
        placeholder="Search menu..."
        aria-label="Search menu"
        autoComplete="off"
        suppressHydrationWarning
        className="w-full rounded-lg border border-dark-tertiary bg-dark-primary py-2 pl-9 pr-8 text-xs text-gray-200 placeholder:text-gray-500 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-4 top-1/2 -translate-y-[40%] rounded p-0.5 text-gray-500 hover:text-white"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
