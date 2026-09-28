"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Calendar, Users, CalendarCheck, ClipboardCheck,
    Activity, Video, List
} from "lucide-react";

export default function AppointmentsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const tabs = [
        { name: "All Appointments", href: "/appointments", icon: List },
        { name: "Doctor Availability", href: "/appointments/doctor-availability", icon: Users },
        { name: "Today's Queue", href: "/appointments/queue", icon: CalendarCheck },
        { name: "Check-In", href: "/appointments/check-in", icon: ClipboardCheck },
        { name: "Walk-In Patients", href: "/appointments/walk-in", icon: Activity },
        { name: "Follow-up", href: "/appointments/follow-up", icon: Calendar },
        { name: "Telemedicine", href: "/appointments/telemedicine", icon: Video },
    ];

    // Some sub-routes like /add or /calendar might not need the tab bar if they are distinct screens,
    // but the user wants the 6 pages to display as tabs in /appointments.
    // If they go to /appointments/calendar, they'll see the tabs. If that's undesirable, we can filter.
    // But for now we show it everywhere under /appointments.

    return (
        <div className="flex flex-col h-full">
            {/* Tab Navigation */}
            <div className="bg-white border-b border-gray-200 px-6 pt-2 -mt-6 -mx-6 flex items-center gap-6 bg-[#f8fafc] min-h-screen p-4 -m-6 flex gap-4 overflow-hidden h-[calc(100vh-64px)] relative custom-scrollbar sticky top-0 z-20">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.href;
                    const Icon = tab.icon;
                    return (
                        <Link
                            key={tab.name}
                            href={tab.href}
                            className={`flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${isActive
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
                                }`}
                        >
                            <Icon size={16} />
                            {tab.name}
                        </Link>
                    );
                })}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 pt-6">
                {children}
            </div>
        </div>
    );
}
