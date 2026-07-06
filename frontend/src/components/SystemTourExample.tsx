'use client';

import { useState } from 'react';
import SystemTourModal from './ui/SystemTourModal';

interface TourStep {
    title: string;
    description: string;
}

const tourSteps: TourStep[] = [
    {
        title: '👋 Welcome to Multi-Hospital Management System',
        description: 'This system helps you manage hospitals efficiently. We will guide you through the key features and how to navigate through the dashboard. Let\'s get started!',
    },
    {
        title: '📊 Dashboard Overview',
        description: 'The dashboard provides a comprehensive view of all key metrics and recent activities. You can see real-time statistics about patients, appointments, revenue, and more at a glance.',
    },
    {
        title: '👨‍⚕️ Doctors Management',
        description: 'Manage your medical staff here. You can add new doctors, update their profiles, view their schedules, and manage their specialties and departments.',
    },
    {
        title: '🏥 Patient Management',
        description: 'Handle all patient-related operations. Register new patients, view medical histories, manage appointments, and track patient progress through the system.',
    },
    {
        title: '📅 Appointments',
        description: 'Schedule and manage appointments efficiently. View appointment calendars, manage patient bookings, track appointment status, and handle cancellations or rescheduling.',
    },
    {
        title: '🩸 Blood Bank Management',
        description: 'Manage blood inventory and donations. Track blood types, availability, storage, and process blood donation requests from donors.',
    },
    {
        title: '💊 Pharmacy Module',
        description: 'Manage medicines and prescriptions. Track medicine inventory, manage stock levels, process prescriptions, and handle medicine orders.',
    },
    {
        title: '📋 Billing & Invoices',
        description: 'Handle financial transactions and billing. Create invoices, manage payments, track outstanding bills, and generate financial reports.',
    },
    {
        title: '🏥 Room Allotment',
        description: 'Manage hospital room assignments. Allocate rooms to patients, track bed availability, manage room types, and handle room releases.',
    },
    {
        title: '✅ You\'re All Set!',
        description: 'You now have a complete understanding of the system. Feel free to explore each section and refer back to this tour whenever you need help. Happy managing!',
    },
];

interface SystemTourExampleProps {
    onComplete?: () => void;
    autoStart?: boolean;
}

export default function SystemTourExample({
    onComplete,
    autoStart = false,
}: SystemTourExampleProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [showModal, setShowModal] = useState(autoStart);

    const handleStartTour = () => {
        setCurrentStep(0);
        setShowModal(true);
    };

    const handleCloseTour = () => {
        setShowModal(false);
        if (onComplete) {
            onComplete();
        }
    };

    const handleNextStep = () => {
        if (currentStep < tourSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleCloseTour();
        }
    };

    const handlePrevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSkipTour = () => {
        handleCloseTour();
    };

    const step = tourSteps[currentStep];

    return (
        <>
            <button
                onClick={handleStartTour}
                className="flex items-center gap-2 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors duration-200"
                data-testid="system-tour-start-button"
            >
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                </svg>
                Start System Tour
            </button>

            <SystemTourModal
                isOpen={showModal}
                onClose={handleCloseTour}
                title={step.title}
                description={step.description}
                currentStep={currentStep + 1}
                totalSteps={tourSteps.length}
                onNext={handleNextStep}
                onPrev={handlePrevStep}
                onSkip={handleSkipTour}
            />
        </>
    );
}
