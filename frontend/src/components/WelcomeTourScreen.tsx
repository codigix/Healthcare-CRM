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
      `}</style>

      <div className="welcome-card bg-dark-secondary border border-dark-tertiary rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
        {/* Header */}
        <div className="gradient-bg p-8 relative overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-dark-tertiary rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>

          {/* Hospital Icon Grid */}
          <div className="grid grid-cols-3 gap-4 mb-6 opacity-20">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="text-4xl text-center">
                🏥
              </div>
            ))}
          </div>

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

            <h1 className="text-4xl font-bold text-white mb-2">
              Welcome to MedixPro
            </h1>
            <p className="text-gray-400 text-lg mb-2">
              Advanced Hospital Management System
            </p>
            <p className="text-accent font-semibold">
              Multispeciality Healthcare Excellence
            </p>
          </div>
        </div>

        {/* Hospital Info Section */}
        <div className="p-8 border-b border-dark-tertiary">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Hospital Overview */}
            <div className="text-center">
              <div className="text-4xl mb-3">🏥</div>
              <h3 className="font-semibold text-white mb-2">Complete Hospital Management</h3>
              <p className="text-sm text-gray-400">
                Manage all aspects of your healthcare facility in one place
              </p>
            </div>

            {/* Departments */}
            <div className="text-center">
              <div className="text-4xl mb-3">👨‍⚕️</div>
              <h3 className="font-semibold text-white mb-2">Multiple Specialties</h3>
              <p className="text-sm text-gray-400">
                Support for various medical departments and specializations
              </p>
            </div>

            {/* Patient Care */}
            <div className="text-center">
              <div className="text-4xl mb-3">❤️</div>
              <h3 className="font-semibold text-white mb-2">Patient Focused</h3>
              <p className="text-sm text-gray-400">
                Comprehensive patient management and care coordination
              </p>
            </div>
          </div>
        </div>

        {/* Features List */}
        <div className="p-8 border-b border-dark-tertiary">
          <h3 className="text-white font-semibold mb-4">Key Features You'll Learn:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              "📊 Dashboard Overview & Analytics",
              "👨‍⚕️ Doctor & Staff Management",
              "👥 Patient Records Management",
              "📅 Appointment Scheduling",
              "💊 Prescription Management",
              "🩸 Blood Bank Operations",
              "🚑 Ambulance Services",
              "💰 Billing & Payments",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2 text-gray-300">
                <div className="w-2 h-2 rounded-full bg-accent"></div>
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-8 bg-dark-primary flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onClose}
            className="px-8 py-3 rounded-lg bg-dark-tertiary hover:bg-dark-tertiary/80 text-white transition-colors font-medium"
          >
            Skip for Now
          </button>
          <button
            onClick={onStart}
            className="px-8 py-3 rounded-lg bg-accent hover:bg-accent-dark text-white transition-colors font-medium flex items-center justify-center gap-2"
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
