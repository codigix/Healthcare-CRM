"use client";

import { useState, useEffect } from "react";
import { useAuthStore, useUIStore } from "@/lib/store";
import {
  Bell, User, Settings, Moon, Sun,
  Info, CheckCircle, AlertTriangle, AlertCircle,
  Trash2, X, CheckCheck, BellOff
} from "lucide-react";
import { notificationAPI } from "@/lib/api";
import ComprehensiveSystemTour from "@/components/ComprehensiveSystemTour";

export default function Topbar() {
  const { user } = useAuthStore();
  const { theme, setTheme } = useUIStore();

  // Notification States
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [fetchingNotifications, setFetchingNotifications] = useState(false);

  const fetchNotifications = async () => {
    try {
      setFetchingNotifications(true);
      const res = await notificationAPI.list();
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setFetchingNotifications(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      // Poll notifications every 20 seconds for a active dashboard feel
      const interval = setInterval(fetchNotifications, 20000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const handleDeleteNotification = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await notificationAPI.delete(id);
      const target = notifications.find(n => n.id === id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      if (target && !target.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  useEffect(() => {
    const savedTheme =
      (localStorage.getItem("theme") as "light" | "dark") || "light";
    setTheme(savedTheme);
    if (savedTheme === "light") {
      document.body.classList.add("light");
    } else {
      document.body.classList.remove("light");
    }
  }, [setTheme]);

  useEffect(() => {
    if (theme === "light") {
      document.body.classList.add("light");
    } else {
      document.body.classList.remove("light");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Helper to render type icons & colors dynamically
  const getNotificationStyles = (type: string) => {
    switch (type) {
      case "success":
        return {
          icon: <CheckCircle size={14} className="text-emerald-400" />,
          bgColor: "bg-emerald-500/10",
          borderColor: "border-emerald-500/20"
        };
      case "warning":
        return {
          icon: <AlertTriangle size={14} className="text-amber-400" />,
          bgColor: "bg-amber-500/10",
          borderColor: "border-amber-500/20"
        };
      case "danger":
      case "error":
        return {
          icon: <AlertCircle size={14} className="text-red-400" />,
          bgColor: "bg-red-500/10",
          borderColor: "border-red-500/20"
        };
      case "info":
      default:
        return {
          icon: <Info size={14} className="text-blue-400" />,
          bgColor: "bg-blue-500/10",
          borderColor: "border-blue-500/20"
        };
    }
  };

  return (
    <div className="topbar h-16 px-6 flex items-center justify-between">
      <div className="text-lg font-semibold">
        Welcome back, {user?.name || "User"}!
      </div>

      <div className="flex items-center gap-4 relative">
        {/* Notification Bell Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            suppressHydrationWarning
            className={`p-2 hover:bg-dark-tertiary rounded transition-all relative ${showNotifications ? "bg-dark-tertiary text-white" : "text-gray-400 hover:text-white"}`}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px]  rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Invisible background overlay to close dropdown */}
          {showNotifications && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowNotifications(false)}
            />
          )}

          {/* Premium Glassmorphic Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2.5 w-80 bg-dark-secondary/95 border border-dark-tertiary shadow-2xl roundederflow-hidden z-50 backdrop-blur-md animate-fadeIn flex flex-col max-h-[460px] max-w-[90vw]">

              {/* Header */}
              <div className="flex items-center justify-between p-3.5 border-b border-dark-tertiary/60">
                <div className="flex items-center gap-2">
                  <span className=" text-sm text-white">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded text-[10px] ">
                      {unreadCount} New
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition-colors flex items-center gap-1 active:scale-95"
                  >
                    <CheckCheck size={13} />
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notifications List */}
              <div className="overflow-y-auto max-h-[360px] divide-y divide-dark-tertiary/40">
                {notifications.length === 0 ? (
                  <div className="p-8 flex flex-col items-center justify-center text-center space-y-2">
                    <div className="p-3 bg-dark-tertiary/20 rounded-full text-gray-500">
                      <BellOff size={22} />
                    </div>
                    <div className="text-xs  text-gray-300">All caught up!</div>
                    <p className="text-[10px] text-gray-500 max-w-[200px]">No new notifications at the moment.</p>
                  </div>
                ) : (
                  notifications.map((notif) => {
                    const styles = getNotificationStyles(notif.type);
                    return (
                      <div
                        key={notif.id}
                        onClick={() => !notif.isRead && handleMarkAsRead(notif.id)}
                        className={`p-3.5 flex gap-3 transition-colors relative cursor-pointer hover:bg-dark-tertiary/20 group ${!notif.isRead ? "bg-dark-tertiary/5 border-l-2 border-emerald-500" : ""}`}
                      >
                        {/* Type Icon Badge */}
                        <div className={`w-7 h-7 rounded ${styles.bgColor} border ${styles.borderColor} flex items-center justify-center shrink-0 mt-0.5`}>
                          {styles.icon}
                        </div>

                        {/* Text Details */}
                        <div className="flex-1 min-w-0 pr-4">
                          <div className="flex items-center justify-between gap-1.5">
                            <span className={`text-xs  truncate ${!notif.isRead ? "text-white" : "text-gray-400"}`}>
                              {notif.title}
                            </span>
                            <span className="text-[9px] text-gray-500 shrink-0">
                              {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className={`text-[11px] mt-0.5 leading-relaxed break-words ${!notif.isRead ? "text-gray-300 font-medium" : "text-gray-400"}`}>
                            {notif.message}
                          </p>
                          {notif.senderName && (
                            <span className="inline-block mt-1.5 text-[9px] text-purple-400 font-medium px-1.5 py-0.5 rounded bg-purple-500/5 border border-purple-500/10">
                              From: {notif.senderName}
                            </span>
                          )}
                        </div>

                        {/* Individual Delete Action */}
                        <button
                          onClick={(e) => handleDeleteNotification(notif.id, e)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-600 hover:text-red-400 rounded transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-dark-tertiary/30"
                          title="Delete notification"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer status */}
              {notifications.length > 0 && (
                <div className="p-2 border-t border-dark-tertiary/60 bg-dark-tertiary/10 text-center text-[10px] text-gray-500 font-medium">
                  Showing last {notifications.length} notification{notifications.length > 1 ? 's' : ''}
                </div>
              )}
            </div>
          )}
        </div>

        <ComprehensiveSystemTour />

        <button
          onClick={toggleTheme}
          suppressHydrationWarning
          className="p-2 hover:bg-dark-tertiary rounded transition-colors text-gray-400 hover:text-white"
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button suppressHydrationWarning className="p-2 hover:bg-dark-tertiary rounded transition-colors text-gray-400 hover:text-white">
          <Settings size={20} />
        </button>

        <div className="flex items-center gap-2 pl-4 border-l border-dark-tertiary">
          <div>
            <div className="text-mdfont-semibold">{user?.name}</div>
            <div className="text-xs text-gray-400">
              {user?.department ? user.department.toUpperCase() : user?.role?.toUpperCase()}
            </div>
          </div>
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center ">
            {user?.name?.charAt(0) || "U"}
          </div>
        </div>
      </div>
    </div>
  );
}
