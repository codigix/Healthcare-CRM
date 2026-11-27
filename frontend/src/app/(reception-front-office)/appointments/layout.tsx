"use client";

/**
 * The appointments screens draw their own tab bar (see appointments/page.tsx).
 * This layout used to add a second, full-screen-height tab bar whose links
 * pointed at pages that do not exist, which pushed the real content off screen.
 */
export default function AppointmentsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
