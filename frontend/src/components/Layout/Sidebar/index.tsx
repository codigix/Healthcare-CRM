"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, SearchX, X } from "lucide-react";
import { useAuthStore, useUIStore } from "@/lib/store";
import ModuleTour from "@/components/ModuleTour";
import {
  getMenuForDepartment,
  getSecondaryMenu,
  type NavItem,
} from "@/config/navigation";
import type { ModuleInfo } from "@/config/navigation/moduleInfo";
import SidebarNavItem, { itemKey } from "./SidebarNavItem";
import SidebarSearch from "./SidebarSearch";
import SidebarFooter from "./SidebarFooter";

/** Department used to pick the menu (same rules as before the refactor). */
function resolveDepartment(
  user: { department?: string; role?: string } | null
): string {
  let dept = user?.department;
  if (!dept && user) {
    if (user.role === "admin") dept = "Admin";
    else if (user.role === "doctor") dept = "Doctor";
    else dept = "Admin";
  }
  return (dept || "Admin").toLowerCase();
}

/** Returns the item with only the matching sub-items, or null if nothing matches. */
function filterItem(item: NavItem, q: string): NavItem | null {
  if (!q) return item;
  if (item.label.toLowerCase().includes(q)) return item;
  const subs = item.subItems?.filter((s) => s.label.toLowerCase().includes(q));
  return subs && subs.length ? { ...item, subItems: subs } : null;
}

export default function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuthStore();
  const { sidebarOpen, setIsNavigating, isNavigating } = useUIStore();

  const dept = resolveDepartment(user);
  const menu = useMemo(() => getMenuForDepartment(dept), [dept]);
  const secondary = useMemo(() => getSecondaryMenu(dept), [dept]);

  const [isOpen, setIsOpen] = useState(sidebarOpen);
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string[]>([]);
  const [showModuleTour, setShowModuleTour] = useState(false);
  const [selectedModule] = useState<ModuleInfo | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Highlight follows the real URL only, so the active item and the address
  // bar can never disagree. A clicked link that is still loading is marked
  // with a spinner (pendingPath) instead of being highlighted early.
  const currentPath = pathname;
  const q = query.trim().toLowerCase();
  const pendingFor = (item: NavItem): string | null =>
    pendingPath && (item.href === pendingPath || item.subItems?.some((s) => s.href === pendingPath))
      ? pendingPath
      : null;

  // Keep the section that contains the current page open.
  useEffect(() => {
    const active = menu.find(
      (item) =>
        item.subItems?.length &&
        (pathname.startsWith(item.href) ||
          item.subItems.some((s) => s.href === pathname))
    );
    if (active) {
      const key = itemKey(active);
      setExpanded((prev) => (prev.includes(key) ? prev : [...prev, key]));
    }
  }, [pathname, menu]);

  // Restore scroll position of the menu.
  useEffect(() => {
    if (navRef.current) {
      const saved = sessionStorage.getItem("sidebarScrollPos");
      if (saved) navRef.current.scrollTop = parseInt(saved, 10);
    }
    return () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [pathname]);

  useEffect(() => {
    if (!isNavigating) setPendingPath(null);
  }, [isNavigating, pathname]);

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const target = e.currentTarget;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      sessionStorage.setItem("sidebarScrollPos", target.scrollTop.toString());
    }, 150);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    logout();
    window.location.href = "/login";
  };

  const toggle = useCallback((key: string) => {
    setExpanded((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }, []);

  const navigate = useCallback(
    (href: string) => {
      setIsOpen(false);
      // Already on this page: the route will not change, so nothing would
      // ever clear the loading state. Do not start a navigation.
      if (href === pathname) return;
      setPendingPath(href);
      setIsNavigating(true);
    },
    [setIsNavigating, pathname]
  );

  const visibleMenu = useMemo(
    () =>
      menu
        .map((item) => ({ original: item, shown: filterItem(item, q) }))
        .filter((x) => x.shown),
    [menu, q]
  );
  const visibleSecondary = useMemo(
    () => secondary.filter((i) => !q || i.label.toLowerCase().includes(q)),
    [secondary, q]
  );
  const nothingFound = !!q && !visibleMenu.length && !visibleSecondary.length;

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        suppressHydrationWarning
        aria-label={isOpen ? "Close menu" : "Open menu"}
        className="fixed left-4 top-4 z-50 rounded bg-dark-secondary p-2 lg:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={`sidebar fixed left-0 top-0 z-40 flex h-screen w-72 flex-col pt-16 transition-transform duration-300 lg:static lg:translate-x-0 lg:pt-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        data-tour="sidebar"
      >
        <div className="flex items-center gap-3 border-b border-dark-tertiary px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-dark text-base font-bold text-[#fff] shadow-lg shadow-accent/20">
            M
          </div>
          <div className="leading-tight">
            <h1 className="text-lg font-semibold text-white">MedixPro</h1>
            <p className="text-[11px] text-gray-500">Hospital Management</p>
          </div>
        </div>

        <SidebarSearch value={query} onChange={setQuery} />

        <nav
          ref={navRef}
          onScroll={handleScroll}
          aria-label="Main navigation"
          className="flex-1 space-y-1 overflow-y-auto px-2 pb-2"
        >
          {visibleMenu.map(({ original, shown }) => (
            <SidebarNavItem
              key={original.href + original.label}
              item={original}
              subItems={shown!.subItems}
              currentPath={currentPath}
              pendingHref={pendingFor(original)}
              expanded={!!q || expanded.includes(itemKey(original))}
              onToggle={toggle}
              onNavigate={navigate}
            />
          ))}

          {visibleSecondary.length > 0 && (
            <>
              <div className="my-3 border-t border-dark-tertiary" />
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                Others
              </p>
              {visibleSecondary.map((item) => (
                <SidebarNavItem
                  key={item.href}
                  item={item}
                  currentPath={currentPath}
                  pendingHref={pendingFor(item)}
                  expanded={false}
                  onToggle={toggle}
                  onNavigate={navigate}
                />
              ))}
            </>
          )}

          {nothingFound && (
            <div className="flex flex-col items-center gap-2 px-4 py-10 text-center text-gray-500">
              <SearchX size={28} />
              <p className="text-xs">No menu items match “{query}”</p>
            </div>
          )}
        </nav>

        <SidebarFooter
          name={user?.name}
          subtitle={user?.department || user?.role}
          onLogout={handleLogout}
        />
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <ModuleTour
        isOpen={showModuleTour}
        onClose={() => setShowModuleTour(false)}
        module={selectedModule}
        onExplore={() => {
          setShowModuleTour(false);
          setIsOpen(false);
        }}
      />
    </>
  );
}
