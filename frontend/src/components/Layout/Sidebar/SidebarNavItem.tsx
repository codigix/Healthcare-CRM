"use client";

import Link from "next/link";
import { memo } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import type { NavItem } from "@/config/navigation";

interface Props {
  item: NavItem;
  /** The real URL path. Active highlighting follows this only. */
  currentPath: string;
  /** Link of this item (or one of its sub-items) that is still loading, if any. */
  pendingHref?: string | null;
  expanded: boolean;
  /** Sub-items to show (already filtered by search). */
  subItems?: NavItem["subItems"];
  onToggle: (key: string) => void;
  onNavigate: (href: string) => void;
}

export const itemKey = (item: Pick<NavItem, "label" | "href">) =>
  `${item.label}|${item.href}`;

function SidebarNavItem({
  item,
  currentPath,
  pendingHref,
  expanded,
  subItems,
  onToggle,
  onNavigate,
}: Props) {
  const Icon = item.icon;
  const hasSubItems = !!item.subItems && item.subItems.length > 0;
  const key = itemKey(item);

  const isActive = hasSubItems
    ? currentPath.startsWith(item.href)
    : currentPath === item.href;

  const rowBase =
    "group relative flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-[13px] transition-colors";
  const rowState = isActive
    ? "bg-accent/10 text-accent"
    : "text-gray-300 hover:bg-dark-tertiary hover:text-white";

  const tile = (
    <span
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
        isActive
          ? "bg-accent text-[#fff]"
          : "bg-dark-tertiary/60 text-gray-400 group-hover:text-white"
      }`}
    >
      <Icon size={17} />
    </span>
  );

  const activeBar = isActive && (
    <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-accent" />
  );

  if (!hasSubItems) {
    return (
      <Link
        href={item.href}
        aria-current={isActive ? "page" : undefined}
        className={`${rowBase} ${rowState}`}
        data-tour={item.tourId}
        onClick={() => onNavigate(item.href)}
      >
        {activeBar}
        {tile}
        <span className="truncate">{item.label}</span>
        {pendingHref === item.href && (
          <Loader2 size={14} className="ml-auto shrink-0 animate-spin text-accent" aria-label="Loading" />
        )}
      </Link>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => onToggle(key)}
        aria-expanded={expanded}
        suppressHydrationWarning
        className={`${rowBase} ${rowState}`}
        data-tour={item.label.toLowerCase().replace(" ", "-") + "-nav"}
      >
        {activeBar}
        {tile}
        <span className="flex-1 truncate text-left">{item.label}</span>
        {pendingHref ? (
          <Loader2 size={15} className="shrink-0 animate-spin text-accent" aria-label="Loading" />
        ) : (
          <ChevronDown
            size={15}
            className={`shrink-0 text-gray-500 transition-transform duration-200 ${
              expanded ? "rotate-180" : ""
            }`}
          />
        )}
      </button>

      {expanded && (
        <div className="ml-6 mt-1 space-y-0.5 border-l border-dark-tertiary pl-3">
          {(subItems ?? item.subItems)!.map((sub) => {
            const subActive = currentPath === sub.href;
            return (
              <Link
                key={`${sub.href}-${sub.label}`}
                href={sub.href}
                aria-current={subActive ? "page" : undefined}
                className={`flex items-center justify-between gap-2 rounded-md px-2.5 py-1.5 text-xs transition-colors ${
                  subActive
                    ? "bg-accent font-medium text-[#fff]"
                    : "text-gray-400 hover:bg-dark-tertiary hover:text-gray-200"
                }`}
                onClick={() => onNavigate(sub.href)}
              >
                <span className="truncate">{sub.label}</span>
                {pendingHref === sub.href && (
                  <Loader2 size={12} className="shrink-0 animate-spin text-accent" aria-label="Loading" />
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default memo(SidebarNavItem);
