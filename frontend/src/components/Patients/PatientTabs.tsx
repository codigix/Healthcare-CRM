"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, FileSignature, FolderOpen, Camera, BadgeCheck } from "lucide-react";

interface PatientTabsProps {
  patientId: string | null;
}

export default function PatientTabs({ patientId }: PatientTabsProps) {
  const pathname = usePathname();

  if (!patientId) return null;

  const tabs = [
    { name: "Demographics", href: "/patients/demographics", icon: User },
    { name: "Consents & Forms", href: "/patients/consents", icon: FileSignature },
    { name: "Patient Documents", href: "/patients/documents", icon: FolderOpen },
    { name: "Photo Capture", href: "/patients/photo", icon: Camera },
    { name: "ID Card", href: "/patients/id-card", icon: BadgeCheck },
  ];

  return (
    <div className="bg-white border-b border-gray-200 mb-4 rounded-lg shadow-sm px-2 pt-2 pb-0 flex overflow-x-auto no-scrollbar">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        const Icon = tab.icon;
        
        return (
          <Link
            key={tab.name}
            href={`${tab.href}?patientId=${patientId}`}
            className={`
              flex items-center gap-2 px-6 py-3 font-semibold text-sm border-b-2 transition-colors whitespace-nowrap
              ${isActive 
                ? 'border-blue-600 text-blue-700 bg-blue-50/50 rounded-t-md' 
                : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'}
            `}
          >
            <Icon size={16} className={isActive ? "text-blue-600" : "text-gray-400"} />
            {tab.name}
          </Link>
        );
      })}
    </div>
  );
}
