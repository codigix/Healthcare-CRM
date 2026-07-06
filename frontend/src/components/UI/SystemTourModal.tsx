"use client";

import { useEffect, useState, useRef } from "react";
import { X, ChevronRight, ChevronLeft } from "lucide-react";

interface SystemTourModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
    actionTip?: string;
    currentStep?: number;
    totalSteps?: number;
    onNext?: () => void;
    onPrev?: () => void;
    onSkip?: () => void;
    initialPosition?: { x: number; y: number };
    position?: { x: number; y: number };
    targetElement?: HTMLElement | null;
    navigateTo?: string;
    isNavigating?: boolean;
    pageLabel?: string;
}

export default function SystemTourModal({
    isOpen,
    onClose,
    title,
    description,
    actionTip,
    currentStep = 1,
    totalSteps = 1,
    onNext,
    onPrev,
    onSkip,
    initialPosition,
    position: externalPosition,
    targetElement,
    navigateTo,
    isNavigating = false,
    pageLabel,
}: SystemTourModalProps) {
    const [displayedText, setDisplayedText] = useState("");
    const [isTyping, setIsTyping] = useState(true);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [arrowPosition, setArrowPosition] = useState({ top: "", right: "", bottom: "", left: "" });
    const typewriterIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const textIndexRef = useRef(0);
    const modalRef = useRef<HTMLDivElement>(null);
    const contentBodyRef = useRef<HTMLDivElement>(null);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);
    const intersectionObserverRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        if (!isOpen) {
            setDisplayedText("");
            setIsTyping(false);
            textIndexRef.current = 0;
            setIsDragging(false);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
            if (typewriterIntervalRef.current) {
                clearInterval(typewriterIntervalRef.current);
            }
            if (resizeObserverRef.current) {
                resizeObserverRef.current.disconnect();
            }
            if (intersectionObserverRef.current) {
                intersectionObserverRef.current.disconnect();
            }
            return;
        }

        setIsTyping(true);
        textIndexRef.current = 0;
        setDisplayedText("");

        typewriterIntervalRef.current = setInterval(() => {
            setDisplayedText((prev) => {
                if (textIndexRef.current < description.length) {
                    textIndexRef.current += 1;
                    return description.substring(0, textIndexRef.current);
                } else {
                    setIsTyping(false);
                    if (typewriterIntervalRef.current) {
                        clearInterval(typewriterIntervalRef.current);
                    }
                    return prev;
                }
            });
        }, 30);

        return () => {
            if (typewriterIntervalRef.current) {
                clearInterval(typewriterIntervalRef.current);
            }
        };
    }, [isOpen, description]);

    // Auto-scroll to bottom while typing
    useEffect(() => {
        if (isTyping && contentBodyRef.current) {
            // Small delay to ensure DOM has updated
            const scrollTimer = setTimeout(() => {
                if (contentBodyRef.current) {
                    contentBodyRef.current.scrollTop = contentBodyRef.current.scrollHeight;
                }
            }, 0);
            return () => clearTimeout(scrollTimer);
        }
    }, [displayedText, isTyping]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
            return () => document.removeEventListener("keydown", handleKeyDown);
        }
    }, [isOpen, onClose]);

    // Drag functionality
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;

            const newX = e.clientX - dragOffset.x;
            const newY = e.clientY - dragOffset.y;

            // Keep modal within viewport bounds (100% of screen width/height)
            const modalWidth = modalRef.current?.offsetWidth || 400;
            const modalHeight = modalRef.current?.offsetHeight || 300;

            const maxX = Math.max(0, window.innerWidth - modalWidth);
            const maxY = Math.max(0, window.innerHeight - modalHeight);

            setPosition({
                x: Math.max(0, Math.min(newX, maxX)),
                y: Math.max(0, Math.min(newY, maxY)),
            });
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!isDragging || e.touches.length !== 1) return;

            const touch = e.touches[0];
            const newX = touch.clientX - dragOffset.x;
            const newY = touch.clientY - dragOffset.y;

            // Keep modal within viewport bounds (100% of screen width/height)
            const modalWidth = modalRef.current?.offsetWidth || 400;
            const modalHeight = modalRef.current?.offsetHeight || 300;

            const maxX = Math.max(0, window.innerWidth - modalWidth);
            const maxY = Math.max(0, window.innerHeight - modalHeight);

            setPosition({
                x: Math.max(0, Math.min(newX, maxX)),
                y: Math.max(0, Math.min(newY, maxY)),
            });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        const handleTouchEnd = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("touchmove", handleTouchMove, {
                passive: false,
            });
            document.addEventListener("mouseup", handleMouseUp);
            document.addEventListener("touchend", handleTouchEnd);
            document.body.style.cursor = "grabbing";
            document.body.style.userSelect = "none";
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("touchmove", handleTouchMove);
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("touchend", handleTouchEnd);
            document.body.style.cursor = "";
            document.body.style.userSelect = "";
        };
    }, [isDragging, dragOffset]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!modalRef.current) return;

        const rect = modalRef.current.getBoundingClientRect();
        setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
        setIsDragging(true);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        if (!modalRef.current || e.touches.length !== 1) return;

        const touch = e.touches[0];
        const rect = modalRef.current.getBoundingClientRect();
        setDragOffset({
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top,
        });
        setIsDragging(true);
    };

    // Calculate smart position based on target element
    const calculateSmartPosition = (): { x: number; y: number } => {
        if (!targetElement) {
            // Center the modal on screen
            return { x: Math.max(0, window.innerWidth / 2 - 250), y: Math.max(0, window.innerHeight / 2 - 200) };
        }

        const rect = targetElement.getBoundingClientRect();
        let modalWidth = 480;
        let modalHeight = 320;
        const padding = 20;
        const gap = 30;
        const sidebarWidth = 256;

        // Check available space and adjust modal size if needed
        if (window.innerWidth < 768) {
            modalWidth = Math.min(480, window.innerWidth - padding * 2);
            modalHeight = 300;
        }

        let x = 0;
        let y = 0;

        // Smart vertical positioning
        const spaceAbove = rect.top;
        const spaceBelow = window.innerHeight - rect.bottom;

        if (spaceAbove > modalHeight + gap) {
            // Position above
            y = window.scrollY + rect.top - modalHeight - gap;
        } else if (spaceBelow > modalHeight + gap) {
            // Position below
            y = window.scrollY + rect.bottom + gap;
        } else {
            // Limited vertical space - center vertically with small gap
            y = window.scrollY + rect.top + rect.height / 2 - modalHeight / 2;
        }

        // Detect if element is in the sidebar (left side of screen)
        const isInSidebar = rect.left < sidebarWidth;

        // Smart horizontal positioning
        if (isInSidebar) {
            // Element is in sidebar - always position modal to the right with extra gap
            const sidebarGap = 50;
            let proposedX = sidebarWidth + sidebarGap;

            // Check if modal fits on the right side with current size
            if (proposedX + modalWidth > window.innerWidth - padding) {
                // Not enough space on right - try center if sidebar allows
                const centerX = window.innerWidth / 2 - modalWidth / 2;
                if (centerX > sidebarWidth + sidebarGap) {
                    x = centerX;
                } else {
                    x = Math.max(sidebarWidth + sidebarGap, window.innerWidth - modalWidth - padding);
                }
            } else {
                x = proposedX;
            }
        } else {
            // Element is not in sidebar - use normal logic
            const spaceLeft = rect.left;
            const spaceRight = window.innerWidth - rect.right;

            // Prefer positioning to the side with more space
            if (spaceRight > modalWidth + gap) {
                // Position to the right
                x = window.scrollX + rect.right + gap;
            } else if (spaceLeft > modalWidth + gap) {
                // Position to the left
                x = window.scrollX + rect.left - modalWidth - gap;
            } else {
                // Limited horizontal space - position on side with most space
                if (spaceRight > spaceLeft) {
                    x = window.scrollX + rect.right + gap;
                } else {
                    x = window.scrollX + rect.left - modalWidth - gap;
                }
            }
        }

        // Ensure modal stays within 100% of viewport bounds (0 to window.innerWidth - modalWidth)
        const maxX = Math.max(0, window.innerWidth - modalWidth);
        const maxY = Math.max(0, document.documentElement.scrollHeight - modalHeight);

        x = Math.max(0, Math.min(x, maxX));
        y = Math.max(0, Math.min(y, maxY));

        return { x, y };
    };

    // Reset position when modal opens or external position changes
    useEffect(() => {
        if (isOpen) {
            if (externalPosition) {
                setPosition(externalPosition);
            } else if (initialPosition) {
                setPosition(initialPosition);
            } else if (targetElement) {
                const smartPos = calculateSmartPosition();
                setPosition(smartPos);
                setTimeout(() => {
                    const newArrowPos = calculateArrowPosition();
                    setArrowPosition(newArrowPos);
                }, 50);
            } else {
                setPosition({ x: 0, y: 0 });
            }
            setIsDragging(false);
        }
    }, [isOpen, initialPosition, externalPosition, targetElement]);

    // Calculate arrow position to point at target element
    const calculateArrowPosition = (): { top: string; right: string; bottom: string; left: string } => {
        if (!targetElement || !modalRef.current) {
            return { top: "", right: "", bottom: "", left: "" };
        }

        const rect = targetElement.getBoundingClientRect();
        const modalRect = modalRef.current.getBoundingClientRect();
        let arrowPos = { top: "", right: "", bottom: "", left: "" };

        const targetCenterX = rect.left + rect.width / 2;
        const targetCenterY = rect.top + rect.height / 2;
        const modalCenterX = modalRect.left + modalRect.width / 2;
        const modalCenterY = modalRect.top + modalRect.height / 2;

        // Determine arrow direction based on relative position
        const isAbove = targetCenterY < modalCenterY;
        const isBelow = targetCenterY > modalCenterY;
        const isLeft = targetCenterX < modalCenterX;
        const isRight = targetCenterX > modalCenterX;

        // Position arrow on appropriate side
        if (isAbove) {
            arrowPos.top = "-12px";
        } else if (isBelow) {
            arrowPos.bottom = "-12px";
        }

        // Calculate arrow horizontal position based on relative location
        // Clamp to ensure arrow stays within modal bounds (10% to 90%)
        const horizontalPercent = Math.max(10, Math.min(90, ((targetCenterX - modalRect.left) / modalRect.width) * 100));

        if (isLeft) {
            arrowPos.left = `${Math.max(10, horizontalPercent)}%`;
        } else if (isRight) {
            arrowPos.right = `${Math.max(10, 100 - horizontalPercent)}%`;
        } else {
            arrowPos.left = "50%";
        }

        return arrowPos;
    };

    // Auto-reposition modal when target element moves, window resizes, or user scrolls
    useEffect(() => {
        if (!isOpen || !targetElement || isDragging) return;

        const handleReposition = () => {
            const smartPos = calculateSmartPosition();
            setPosition(smartPos);
            const newArrowPos = calculateArrowPosition();
            setArrowPosition(newArrowPos);
        };

        // ResizeObserver to watch target element size changes
        if (!resizeObserverRef.current) {
            resizeObserverRef.current = new ResizeObserver(() => {
                handleReposition();
            });
        }
        resizeObserverRef.current.observe(targetElement);

        // IntersectionObserver to detect visibility changes
        if (!intersectionObserverRef.current) {
            intersectionObserverRef.current = new IntersectionObserver(() => {
                handleReposition();
            }, { threshold: 0 });
        }
        intersectionObserverRef.current.observe(targetElement);

        // Window events for scroll and resize
        window.addEventListener("resize", handleReposition);
        window.addEventListener("scroll", handleReposition, true);

        return () => {
            if (resizeObserverRef.current && targetElement) {
                resizeObserverRef.current.unobserve(targetElement);
            }
            if (intersectionObserverRef.current && targetElement) {
                intersectionObserverRef.current.unobserve(targetElement);
            }
            window.removeEventListener("resize", handleReposition);
            window.removeEventListener("scroll", handleReposition, true);
        };
    }, [isOpen, targetElement, isDragging]);

    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
        e.stopPropagation();
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 p-4 animate-in fade-in duration-200 w-[100%] h-[100%] overflow-x-auto overflow-y-auto"
            style={{ zIndex: 9999, pointerEvents: 'auto' }}
            data-testid="system-tour-modal-overlay"
            onClick={handleOverlayClick}
        >
            <style>{`
 @keyframes slideInScale {
 from {
 opacity: 0;
 transform: scale(0.95) translateY(-20px);
 }
 to {
 opacity: 1;
 transform: scale(1) translateY(0);
 }
 }

 @keyframes fadeIn {
 from {
 opacity: 0;
 }
 to {
 opacity: 1;
 }
 }

 .system-tour-modal-container {
 animation: slideInScale 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
 transition: left 0.2s ease-out, top 0.2s ease-out;
 position: relative;
 z-index: 10000 !important;
 }

 .system-tour-modal-arrow {
 position: absolute;
 width: 0;
 height: 0;
 border-style: solid;
 z-index: 10;
 }

 .system-tour-modal-arrow.top {
 border-width: 0 12px 12px 12px;
 border-color: transparent transparent #1a1f2e transparent;
 }

 .system-tour-modal-arrow.bottom {
 border-width: 12px 12px 0 12px;
 border-color: #1a1f2e transparent transparent transparent;
 }

 .system-tour-modal-arrow.left {
 border-width: 12px 12px 12px 0;
 border-color: transparent #1a1f2e transparent transparent;
 }

 .system-tour-modal-arrow.right {
 border-width: 12px 0 12px 12px;
 border-color: transparent transparent transparent #1a1f2e;
 }

 .tour-typewriter-cursor {
 display: inline-block;
 width: 2px;
 height: 1em;
 background-color: currentColor;
 margin-left: 2px;
 animation: blink 0.7s infinite;
 }

 @keyframes blink {
 0%, 49% {
 opacity: 1;
 }
 50%, 100% {
 opacity: 0;
 }
 }

 .tour-text-container {
 min-height: 80px;
 display: flex;
 align-items: flex-start;
 font-family: 'Monaco', 'Courier New', monospace;
 }

 .tour-text-content {
 line-height: 1.6;
 word-wrap: break-word;
 white-space: pre-wrap;
 }

 @media (max-width: 640px) {
 .system-tour-modal-content {
 max-width: 100%;
 width: 100%;
 }
 }
 `}</style>

            <div
                ref={modalRef}
                className="system-tour-modal-container bg-dark-secondary border border-dark-tertiary rounded shadow-2xl overflow-hidden flex flex-col absolute"
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    width: "clamp(300px, 90vw, 520px)",
                    maxHeight: "30pc",
                    cursor: isDragging ? "grabbing" : "default",
                    pointerEvents: 'auto',
                }}
                data-testid="system-tour-modal-content"
                onClick={(e) => e.stopPropagation()}
            >
                {targetElement && (
                    <div
                        className={`system-tour-modal-arrow ${arrowPosition.top ? "top" : arrowPosition.bottom ? "bottom" : ""
                            } ${arrowPosition.left ? "left" : arrowPosition.right ? "right" : ""}`}
                        style={{
                            top: arrowPosition.top || undefined,
                            bottom: arrowPosition.bottom || undefined,
                            left: arrowPosition.left || undefined,
                            right: arrowPosition.right || undefined,
                        }}
                    />
                )}
                <div
                    className="flex justify-between items-start p-2 border-b border-dark-tertiary cursor-grab active:cursor-grabbing select-none"
                    data-testid="system-tour-modal-header"
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                >
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h2
                                className="text-2xl  text-white"
                                data-testid="system-tour-modal-title"
                            >
                                {title}
                            </h2>
                            {isNavigating && (
                                <span className="px-2 py-1 bg-accent/20 text-accent text-xs font-semibold rounded">
                                    Loading...
                                </span>
                            )}
                        </div>
                        {pageLabel && (
                            <p className="text-sm text-accent mb-2">📍 {pageLabel}</p>
                        )}
                        {totalSteps > 1 && (
                            <p
                                className="text-mdtext-dark-tertiary"
                                data-testid="system-tour-modal-step-counter"
                            >
                                Step {currentStep} of {totalSteps}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-dark-tertiary rounded transition-colors duration-200"
                            aria-label="Close tour"
                            data-testid="system-tour-modal-close-btn"
                        >
                            <X size={20} className="text-gray-400 hover:text-white" />
                        </button>
                    </div>
                </div>

                <div
                    ref={contentBodyRef}
                    className="flex-1 overflow-y-auto p-6"
                    data-testid="system-tour-modal-body"
                >
                    <div className="tour-text-container">
                        <div
                            className="tour-text-content text-gray-200"
                            data-testid="system-tour-modal-text"
                        >
                            {displayedText}
                            {isTyping && (
                                <span
                                    className="tour-typewriter-cursor"
                                    aria-hidden="true"
                                ></span>
                            )}
                        </div>
                    </div>
                    {actionTip && !isTyping && (
                        <div className="mt-4 pt-4 border-t border-dark-tertiary">
                            <p className="text-accent text-sm font-medium">{actionTip}</p>
                        </div>
                    )}
                </div>

                <div
                    className="flex justify-between items-center my-3 my-3 p-6 border-t border-dark-tertiary bg-dark"
                    data-testid="system-tour-modal-footer"
                >
                    <div className="flex gap-2">
                        {onPrev && currentStep > 1 && (
                            <button
                                onClick={onPrev}
                                className="flex items-center gap-2 p-2 bg-dark-tertiary hover:bg-dark-tertiary/80 text-white rounded transition-colors duration-200"
                                data-testid="system-tour-modal-prev-btn"
                            >
                                <ChevronLeft size={15} />
                                Previous
                            </button>
                        )}
                    </div>

                    <div className="flex gap-2">
                        {onSkip && (
                            <button
                                onClick={onSkip}
                                className="p-2 bg-dark-tertiary hover:bg-dark-tertiary/80 text-gray-300 hover:text-white rounded transition-colors duration-200"
                                data-testid="system-tour-modal-skip-btn"
                            >
                                Skip Tour
                            </button>
                        )}
                        {onNext && currentStep < totalSteps && (
                            <button
                                onClick={onNext}
                                className="flex items-center gap-2 p-2 bg-accent hover:bg-accent-dark text-white rounded transition-colors duration-200"
                                data-testid="system-tour-modal-next-btn"
                            >
                                Next
                                <ChevronRight size={15} />
                            </button>
                        )}
                        {currentStep === totalSteps && (
                            <button
                                onClick={onClose}
                                className="flex items-center gap-2 p-2 bg-accent hover:bg-accent-dark text-white rounded transition-colors duration-200"
                                data-testid="system-tour-modal-complete-btn"
                            >
                                🎉 Complete Tour
                            </button>
                        )}
                    </div>
                </div>

                {totalSteps > 1 && (
                    <div
                        className="h-1 bg-dark-tertiary"
                        data-testid="system-tour-modal-progress-bar"
                    >
                        <div
                            className="h-full bg-accent transition-all duration-300"
                            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                            data-testid="system-tour-modal-progress-fill"
                        ></div>
                    </div>
                )}
            </div>
        </div>
    );
}
