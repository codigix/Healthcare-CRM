"use client";

import { useState } from "react";
import { Play, X } from "lucide-react";

interface WelcomeTourScreenProps {
 isOpen: boolean;
 onClose: () => void;
 onStart: () => void;
 description?: string;
}

export default function WelcomeTourScreen({
 isOpen,
 onClose,
 onStart,
}: WelcomeTourScreenProps) {
 if (!isOpen) return null;

 return (
 <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4">
 <style>{`
 @keyframes fadeIn {
 from { opacity: 0; transform: scale(0.95); }
 to { opacity: 1; transform: scale(1); }
 }
 
 @keyframes float {
 0%, 100% { transform: translateY(0px); }
 50% { transform: translateY(-10px); }
 }
 
 @keyframes pulse-glow {
 0%, 100% { box-shadow: 0 0 0 0 rgba(26, 188, 156, 0.7); }
 50% { box-shadow: 0 0 0 10px rgba(26, 188, 156, 0); }
 }
 
 .welcome-card {
 animation: fadeIn 0.6s ease-out;
 max-height: 90vh;
 overflow-y: auto;
 display: flex;
 flex-direction: column;
 }
 
 .welcome-card::-webkit-scrollbar {
 width: 6px;
 }
 
 .welcome-card::-webkit-scrollbar-track {
 background: transparent;
 }
 
 .welcome-card::-webkit-scrollbar-thumb {
 background: rgba(26, 188, 156, 0.3);
 border-radius: 3px;
 }
 
 .welcome-card::-webkit-scrollbar-thumb:hover {
 background: rgba(26, 188, 156, 0.5);
 }
 
 .hospital-icon {
 animation: float 3s ease-in-out infinite;
 }
 
 .pulse-icon {
 animation: pulse-glow 2s ease-in-out infinite;
 }
 
 .gradient-bg {
 background: linear-gradient(135deg, #171B1E 0%, #1E1F27 100%);
 }
 
 .welcome-buttons {
 flex-shrink: 0;
 }
 `}</style>

 <div className="welcome-card bg-dark-secondary border border-dark-tertiary rounded-2xl shadow-2xl w-full max-w-sm">
 {/* Header */}
 <div className="gradient-bg p-6 relative overflow-hidden">
 <button
 onClick={onClose}
 className="absolute top-4 right-4 p-2 hover:bg-dark-tertiary rounded-lg transition-colors"
 >
 <X size={20} className="text-gray-400" />
 </button>

 {/* Main Welcome Section */}
 <div className="relative z-10 text-center">
 <div className="flex justify-center mb-6">
 <div className="relative">
 <div className="pulse-icon absolute inset-0 rounded-full"></div>
 <div className="relative bg-gradient-to-br from-accent to-accent-dark p-6 rounded-full w-24 h-24 flex items-center justify-center">
 <svg
 className="hospital-icon w-12 h-12 text-white"
 fill="currentColor"
 viewBox="0 0 24 24"
 >
 <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 9h-2v2h-2v-2h-2v-2h2V8h2v2h2v2z" />
 </svg>
 
 </div>
 </div>
 </div>

 <h1 className="text-2xl font-bold text-white mb-2">
 Welcome to MedixPro
 </h1>
 <p className="text-gray-400 text-md mb-2">
 Advanced Hospital Management System
 </p>
 <p className="text-accent text-sm font-semibold">
 Multispeciality Healthcare Excellence
 </p>
 </div>
 </div>

 {/* Action Buttons */}
 <div className="welcome-buttons p-6 bg-dark-primary flex flex-col gap-3 justify-center">
 <button
 onClick={onClose}
 className="px-6 py-3 rounded-lg bg-dark-tertiary hover:bg-dark-tertiary/80 text-white transition-colors text-sm font-medium"
 >
 Skip for Now
 </button>
 <button
 onClick={onStart}
 className="px-6 py-3 rounded-lg bg-accent hover:bg-accent-dark text-white transition-colors text-sm font-medium flex items-center justify-center gap-2"
 >
 <Play size={18} />
 Start Guided Tour
 </button>
 </div>

 {/* Progress Indicator */}
 <div className="h-1 bg-dark-tertiary">
 <div className="h-full bg-gradient-to-r from-accent to-accent-dark" 
 style={{ width: "100%" }}></div>
 </div>
 </div>
 </div>
 );
}
